// "Bobby AI" chat endpoint.
//
// Runs on-demand (not prerendered). Flow per request:
//   1. validate + rate-limit
//   2. embed the question (always Gemini) and retrieve relevant chunks from Supabase pgvector
//   3. assemble persona system prompt + retrieved context + recent history
//   4. stream the answer back from the selected provider (Gemini or Claude — CHAT_PROVIDER)
//   5. log the turn to Supabase `conversations`
//
// Secrets (GEMINI_API_KEY, ANTHROPIC_API_KEY, SUPABASE_*) are read server-side only.
// GEMINI_API_KEY is always required (for embeddings). ANTHROPIC_API_KEY is required
// only when CHAT_PROVIDER=anthropic.
// NOTE: shipping this to production requires the Vercel adapter in astro.config.mjs.
// It works in `astro dev` as-is.

export const prerender = false;

import type { APIRoute } from 'astro';
import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getChatProvider, type Turn, type Usage } from '../../lib/chat';
import { CHAT_ENABLED } from '../../lib/chat/enabled';
import { embedQuery } from '../../lib/embeddings';

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.ANTHROPIC_API_KEY;
const CHAT_PROVIDER = import.meta.env.CHAT_PROVIDER;
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
// Secret salt for hashing the client device id. If unset, device_hash is stored null
// (the raw device id is never persisted regardless).
const DEVICE_ID_SALT = import.meta.env.DEVICE_ID_SALT;

/** One-way HMAC-SHA256 of a raw device id, so it's never stored in plaintext. */
function hashDeviceId(deviceId: string | undefined): string | null {
  if (!deviceId || !DEVICE_ID_SALT) return null;
  return createHmac('sha256', DEVICE_ID_SALT).update(deviceId).digest('hex');
}

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_TURNS = 6; // trailing turns sent as context (session-only memory)
const MAX_OUTPUT_TOKENS = 800;
const RATE_LIMIT_WINDOW_S = 60;
const RATE_LIMIT_MAX = 12;

const PERSONA = `You are "Bobby AI", a first-person AI version of Bobby Muljono talking with
visitors on his personal portfolio site. You are Bobby: warm, curious, plain-spoken,
a builder who codes and storytells with data. Think approachable colleague at a
coffee chat, not a support bot or a salesperson.

Voice:
- Speak as Bobby, first person ("I", "my"). Contractions, short sentences, real warmth.
- Bobby's English has a light, casual Singlish rhythm: short affirmatives like "yea, can"
  or "ok can", relaxed phrasing like "if like that, then...", the odd dropped filler word.
  Keep it light and readable for an international visitor (recruiters read this too). Do
  NOT use particles like "lah", "leh", or "meh". Never force it; a plain warm sentence is
  always fine. This is a speaking style only, not a fact to announce about myself.
- Show genuine interest, but ask a question back only occasionally, not in every reply.
- No corporate filler, no hype, no emoji.

Length (important):
- Keep replies SHORT: 2 to 4 sentences, one tight paragraph, is the default.
- Only go longer when the visitor explicitly asks for a story or deeper detail. Even then,
  stay tight and don't pad with a summary or wrap-up paragraph.

Grounding and privacy (important):
- The CONTEXT below and the conversation so far are your only source of truth for FACTS:
  employers, dates, projects, numbers, skills, contact details. Never invent or guess.
- Treat personal and demographic details as PRIVATE: location, nationality, where I was
  born, age, relationship or family details, real-time availability. Do not state or infer
  any of these unless it appears in the CONTEXT. If asked, decline warmly ("I haven't put
  that on here, easiest is to reach out and ask me directly").
- You may speak naturally around what IS in context (connecting ideas, how I think), as
  long as you're not asserting facts the context doesn't support.

Boundaries:
- Never share internal or confidential details: no internal metrics or dollar figures, no
  dashboards, no client, team, or market-count specifics, nothing not already public on
  this site. If asked, decline lightly and keep it at the level of shape, not numbers
  ("that one's internal so I'll keep it vague, but the idea was...").
- For getting in touch, point to GitHub (github.com/bobbymuljono) or LinkedIn
  (linkedin.com/in/bobbymul). No personal contact beyond that.
- If someone's hostile or off-topic, stay easygoing and steer back to the work.`;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!CHAT_ENABLED) {
    return json(503, { error: 'Bobby AI is temporarily offline.' });
  }

  // Embeddings always need Gemini; Supabase is always needed.
  if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: 'Server is not configured. Missing env vars.' });
  }

  let provider;
  try {
    provider = getChatProvider({
      CHAT_PROVIDER,
      GEMINI_API_KEY,
      ANTHROPIC_API_KEY,
    });
  } catch (err) {
    console.error('Provider selection failed:', err);
    return json(500, { error: 'Chat provider is not configured.' });
  }

  let payload: { message?: string; history?: Turn[]; sessionId?: string; deviceId?: string };
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const message = (payload.message ?? '').trim();
  const sessionId = (payload.sessionId ?? 'anon').slice(0, 100);
  const history = Array.isArray(payload.history) ? payload.history.slice(-MAX_HISTORY_TURNS) : [];

  // Analytics metadata. `country` comes from Vercel's geo header (present only on the
  // deployed function, null under `astro dev`); `device_hash` is a one-way hash of the
  // client device id (raw id is never stored).
  const country = request.headers.get('x-vercel-ip-country') || null;
  const deviceHash = hashDeviceId(payload.deviceId);

  if (!message) return json(400, { error: 'Message is required.' });
  if (message.length > MAX_MESSAGE_CHARS) {
    return json(413, { error: `Message too long (max ${MAX_MESSAGE_CHARS} characters).` });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Rate limit: count this session's recent rows
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_S * 1000).toISOString();
  const { count } = await supabase
    .from('conversations')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .gte('created_at', since);
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return json(429, { error: 'Too many messages, please slow down a moment.' });
  }

  // 2. Embed the question (Gemini) and retrieve relevant chunks
  let context = '';
  try {
    const queryEmbedding = await embedQuery(GEMINI_API_KEY, message);
    if (queryEmbedding) {
      const { data: matches } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_count: 5,
        match_threshold: 0.3,
      });
      context = (matches ?? []).map((m: { content: string }) => m.content).join('\n\n---\n\n');
    }
  } catch (err) {
    console.error('Retrieval failed:', err);
    // Continue without context rather than failing the whole request.
  }

  const system = `${PERSONA}\n\nCONTEXT:\n${context || '(no relevant context found)'}`;

  // 3 + 4. Stream the reply from the selected provider, then log it.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let answer = '';
      const usage: Usage = { inputTokens: null, outputTokens: null };
      try {
        for await (const chunk of provider.streamChat(
          { system, history, message, maxOutputTokens: MAX_OUTPUT_TOKENS },
          usage,
        )) {
          answer += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error(`Generation failed (${provider.name}):`, err);
        if (!answer) controller.enqueue(encoder.encode('Sorry, something went wrong on my end.'));
      } finally {
        controller.close();
        // Log the turn (fire-and-forget; do not block the response).
        supabase
          .from('conversations')
          .insert({
            session_id: sessionId,
            question: message,
            answer,
            input_tokens: usage.inputTokens,
            output_tokens: usage.outputTokens,
            model: provider.model,
            country,
            device_hash: deviceHash,
          })
          .then(({ error }) => { if (error) console.error('Log failed:', error); });
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
