// Query embeddings. Always Gemini — Anthropic has no embeddings API, and the
// documents table was built with gemini-embedding-001 at 768 dimensions, so the
// query vector must come from the same model/dimension to match.
import { GoogleGenAI } from '@google/genai';

const EMBED_MODEL = 'gemini-embedding-001';
const EMBED_DIM = 768; // must match the vector(768) column and scripts/ingest.mjs

export async function embedQuery(apiKey: string, text: string): Promise<number[] | undefined> {
  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
    config: { outputDimensionality: EMBED_DIM },
  });
  return res.embeddings?.[0]?.values;
}
