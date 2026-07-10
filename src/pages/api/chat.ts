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
import { createClient } from '@supabase/supabase-js';
import { getChatProvider, type Turn, type Usage } from '../../lib/chat';
import { CHAT_ENABLED } from '../../lib/chat/enabled';
import { embedQuery } from '../../lib/embeddings';

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.ANTHROPIC_API_KEY;
const CHAT_PROVIDER = import.meta.env.CHAT_PROVIDER;
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_TURNS = 6; // trailing turns sent as context (session-only memory)
const MAX_OUTPUT_TOKENS = 800;
const RATE_LIMIT_WINDOW_S = 60;
const RATE_LIMIT_MAX = 12;

const PERSONA = `You are "Bobby AI", a warm, concise first-person AI version of Bobby Muljono,
a Senior Data Analyst who builds with AI (RAG chatbots, multi-agent workflows, analytics).
You are speaking to visitors on Bobby's personal portfolio site.

Rules:
- Speak as Bobby, in the first person ("I", "my").
- Answer ONLY using the CONTEXT provided below plus the conversation so far. If the context
  does not cover something, say you are not sure or suggest they reach out to Bobby directly,
  rather than inventing details.
- Never reveal internal or confidential information: no internal metrics, dashboards,
  system or team names, or anything not already public on the site. If asked, politely decline and ask them to reach out directly.
- Keep replies short and conversational (a few sentences). Warm, not corporate.
- If asked how to get in touch, point to GitHub (github.com/bobbymuljono) or
  LinkedIn (linkedin.com/in/bobbymul).`;

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

  let payload: { message?: string; history?: Turn[]; sessionId?: string };
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const message = (payload.message ?? '').trim();
  const sessionId = (payload.sessionId ?? 'anon').slice(0, 100);
  const history = Array.isArray(payload.history) ? payload.history.slice(-MAX_HISTORY_TURNS) : [];

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
