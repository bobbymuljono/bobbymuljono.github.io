// Ingestion: read the knowledge corpus + published project write-ups, chunk them,
// embed each chunk with Gemini, and (re)build the Supabase `documents` table.
//
// Run with:  npm run ingest
// (which is:  node --env-file=.env scripts/ingest.mjs)
//
// Re-runnable: it wipes `documents` and rebuilds from scratch each time, so it always
// reflects the current content. The corpus is small, so a full rebuild is simplest.

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EMBED_MODEL = 'gemini-embedding-001';
const EMBED_DIM = 768; // pinned to match the vector(768) column (model default is 3072)
const CHUNK_TARGET = 1200; // characters
const CHUNK_OVERLAP = 150;

const { GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Ensure .env has GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/** Strip a leading YAML frontmatter block (--- ... ---) and grab its title, if any. */
function stripFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { title: null, body: raw };
  const titleLine = match[1].match(/^title:\s*(.+)$/m);
  const title = titleLine ? titleLine[1].trim().replace(/^["']|["']$/g, '') : null;
  return { title, body: raw.slice(match[0].length) };
}

/** Split text into ~CHUNK_TARGET-char chunks on paragraph boundaries, with slight overlap. */
function chunkText(text) {
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let cur = '';
  for (const p of paras) {
    if (cur && (cur.length + p.length + 2) > CHUNK_TARGET) {
      chunks.push(cur);
      const tail = cur.slice(Math.max(0, cur.length - CHUNK_OVERLAP));
      cur = `${tail}\n\n${p}`;
    } else {
      cur = cur ? `${cur}\n\n${p}` : p;
    }
  }
  if (cur.trim()) chunks.push(cur);
  return chunks;
}

/** Collect { source, title, body } records from a directory of .md files. */
function readMarkdownDir(dir, { skipUnderscore = false } = {}) {
  let entries;
  try {
    entries = readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  const records = [];
  for (const file of entries) {
    if (skipUnderscore && file.startsWith('_')) continue;
    const raw = readFileSync(join(dir, file), 'utf8');
    const { title, body } = stripFrontmatter(raw);
    // Skip project write-ups still marked draft: true
    if (/^draft:\s*true\s*$/m.test(raw.slice(0, 400))) continue;
    if (body.trim().length < 40) continue; // skip empty stubs
    records.push({ source: basename(file), title: title ?? basename(file), body });
  }
  return records;
}

async function embedOne(text) {
  const res = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
    config: { outputDimensionality: EMBED_DIM },
  });
  return res.embeddings[0].values;
}

async function main() {
  const records = [
    ...readMarkdownDir(join(ROOT, 'knowledge')),
    ...readMarkdownDir(join(ROOT, 'src', 'content', 'projects'), { skipUnderscore: true }),
  ];

  // Build the chunk list with metadata
  const rows = [];
  for (const rec of records) {
    for (const content of chunkText(rec.body)) {
      rows.push({ content, metadata: { source: rec.source, title: rec.title } });
    }
  }
  console.log(`Prepared ${rows.length} chunks from ${records.length} documents.`);
  if (rows.length === 0) {
    console.error('No content to ingest. Add files under knowledge/ and try again.');
    process.exit(1);
  }

  // Embed one chunk at a time (gemini-embedding-001 takes a single content per call)
  for (let i = 0; i < rows.length; i++) {
    rows[i].embedding = await embedOne(rows[i].content);
    console.log(`Embedded ${i + 1}/${rows.length}`);
  }

  // Rebuild the table: wipe, then insert
  const { error: delErr } = await supabase.from('documents').delete().neq('id', -1);
  if (delErr) throw delErr;

  const { error: insErr } = await supabase.from('documents').insert(
    rows.map((r) => ({ content: r.content, metadata: r.metadata, embedding: r.embedding }))
  );
  if (insErr) throw insErr;

  console.log(`Done. Inserted ${rows.length} chunks into documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
