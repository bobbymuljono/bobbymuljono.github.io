// PDF -> staged Markdown converter (authoring/prep step, NOT part of the ingest pipeline).
//
// Turns a PDF into a *draft* markdown file for human review before it is ever embedded.
// The ingest pipeline stays markdown-only and dumb; this is the messy extraction step,
// deliberately fenced off with a review checkpoint.
//
// Usage:
//   npm run pdf2md                       -> convert every *.pdf in the project root,
//                                           then DELETE each source PDF from the root
//   npm run pdf2md -- <input.pdf>        -> convert a specific PDF (from any path)
//   npm run pdf2md -- <input.pdf> --dry  -> print markdown + stats, write nothing, delete nothing
//   npm run pdf2md -- <input.pdf> --keep -> convert but do NOT delete the source
//   npm run pdf2md -- <input.pdf> --out <dir>
//
// Default flow (no path given): drop a PDF into the project root, run `npm run pdf2md`,
// and it lands cleaned in knowledge/_staging/ while the source PDF is removed from the root.
// Output is stamped `draft: true` and lives in knowledge/_staging/, which `ingest.mjs`
// ignores (its readdirSync is non-recursive and only matches top-level *.md). Review + clean
// the .md, move it up into knowledge/, set draft: false, then run `npm run ingest`.
//
// Deletion rule: a source PDF is only removed when it sits DIRECTLY in the project root and
// its staging .md was written successfully. PDFs anywhere else are never deleted. --dry and
// --keep both suppress deletion.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, basename, extname, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// Keep these in sync with ingest.mjs so the dry-run chunk count is representative.
const CHUNK_TARGET = 1200;
const CHUNK_OVERLAP = 150;

const LINE_TOL = 3;          // items within this many y-units count as the same visual line
const PARA_GAP_FACTOR = 1.6; // a line gap > this * median line gap starts a new paragraph

/** Case-insensitive path equality (Windows-friendly). */
function samePath(a, b) {
  return resolve(a).toLowerCase() === resolve(b).toLowerCase();
}

function parseArgs(argv) {
  const args = { inputs: [], out: null, dry: false, keep: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry') args.dry = true;
    else if (a === '--keep') args.keep = true;
    else if (a === '--out') args.out = argv[++i];
    else args.inputs.push(a);
  }
  return args;
}

/** Extract text from one page as an array of { y, text } visual lines, top-to-bottom. */
async function extractPageLines(page) {
  const content = await page.getTextContent();
  const rawLines = [];
  let curY = null;
  let cur = '';
  for (const it of content.items) {
    const str = it.str ?? '';
    const y = Math.round(it.transform[5]);
    if (curY === null) {
      curY = y;
      cur = str;
    } else if (Math.abs(y - curY) <= LINE_TOL) {
      cur += str; // same visual line
    } else {
      rawLines.push({ y: curY, text: cur });
      curY = y;
      cur = str;
    }
    if (it.hasEOL) {
      rawLines.push({ y: curY, text: cur });
      curY = null;
      cur = '';
    }
  }
  if (cur.trim()) rawLines.push({ y: curY ?? 0, text: cur });
  return rawLines.map((l) => ({ y: l.y, text: l.text.replace(/\s+/g, ' ').trim() })).filter((l) => l.text);
}

/** Drop lines that recur near the top/bottom of most pages (running headers/footers). */
function stripRunningHeadersFooters(pages) {
  const edgeCounts = new Map();
  for (const lines of pages) {
    const edges = new Set();
    if (lines[0]) edges.add(lines[0].text);
    if (lines[1]) edges.add(lines[1].text);
    if (lines[lines.length - 1]) edges.add(lines[lines.length - 1].text);
    if (lines[lines.length - 2]) edges.add(lines[lines.length - 2].text);
    for (const t of edges) edgeCounts.set(t, (edgeCounts.get(t) ?? 0) + 1);
  }
  const threshold = Math.max(2, Math.ceil(pages.length / 2));
  const isNoise = (t) =>
    /^\d+$/.test(t) ||                       // bare page number
    /^page\s+\d+(\s+of\s+\d+)?$/i.test(t) || // "Page 3 of 10"
    (edgeCounts.get(t) ?? 0) >= threshold;   // repeats across many pages
  return pages.map((lines) => lines.filter((l, idx) => {
    const nearEdge = idx <= 1 || idx >= lines.length - 2;
    return !(nearEdge && isNoise(l.text));
  }));
}

/** Reconstruct paragraphs from lines using vertical gaps, and de-hyphenate wrapped words. */
function linesToParagraphs(pages) {
  // Flatten with a null separator between pages so a page break can end a paragraph.
  const flat = [];
  pages.forEach((lines, i) => {
    if (i > 0) flat.push(null);
    flat.push(...lines);
  });

  // Median gap between consecutive same-page lines, used to detect paragraph breaks.
  const gaps = [];
  for (let i = 1; i < flat.length; i++) {
    const a = flat[i - 1];
    const b = flat[i];
    if (a && b) gaps.push(Math.abs(a.y - b.y));
  }
  gaps.sort((x, y) => x - y);
  const medianGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;

  const paras = [];
  let buf = '';
  const flush = () => { if (buf.trim()) paras.push(buf.trim()); buf = ''; };

  for (let i = 0; i < flat.length; i++) {
    const line = flat[i];
    if (line === null) { flush(); continue; } // page boundary
    const prev = flat[i - 1];
    const bigGap = prev && medianGap > 0 && Math.abs(prev.y - line.y) > medianGap * PARA_GAP_FACTOR;
    if (bigGap) flush();

    if (!buf) {
      buf = line.text;
    } else if (buf.endsWith('-')) {
      buf = buf.slice(0, -1) + line.text; // de-hyphenate wrapped word
    } else {
      buf = `${buf} ${line.text}`;        // unwrap soft line break
    }
  }
  flush();
  return paras;
}

/** Mirror of ingest.mjs chunkText, for the dry-run stat only. */
function chunkCount(text) {
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
  return chunks.length;
}

function toTitle(name) {
  return name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Convert a single PDF into { md, slug, stats }. */
async function convert(inputPath) {
  const data = new Uint8Array(readFileSync(inputPath));
  const doc = await getDocument({ data, useSystemFonts: true, isEvalSupported: false }).promise;

  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    pages.push(await extractPageLines(page));
  }

  const cleanedPages = stripRunningHeadersFooters(pages);
  const paras = linesToParagraphs(cleanedPages);
  const body = paras.join('\n\n');

  const stem = basename(inputPath, extname(inputPath));
  const slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'document';
  const title = toTitle(stem);
  const md = `---\ntitle: "${title}"\nsource_pdf: "${basename(inputPath)}"\ndraft: true\n---\n\n${body}\n`;

  return {
    md,
    slug,
    stats: { pages: doc.numPages, paras: paras.length, chars: body.length, chunks: chunkCount(body) },
  };
}

async function main() {
  const { inputs, out, dry, keep } = parseArgs(process.argv.slice(2));

  // No explicit path -> scan the project root for PDFs (the "drop it in and run" flow).
  let targets = inputs.map((p) => (isAbsolute(p) ? p : resolve(process.cwd(), p)));
  const scannedRoot = targets.length === 0;
  if (scannedRoot) {
    targets = readdirSync(ROOT)
      .filter((f) => f.toLowerCase().endsWith('.pdf'))
      .map((f) => join(ROOT, f));
    if (targets.length === 0) {
      console.error('No PDFs found in the project root. Drop a .pdf here and re-run, or pass a path.');
      process.exit(1);
    }
    console.error(`Found ${targets.length} PDF(s) in project root: ${targets.map((t) => basename(t)).join(', ')}`);
  }

  const outDir = out
    ? (isAbsolute(out) ? out : resolve(process.cwd(), out))
    : join(ROOT, 'knowledge', '_staging');

  for (const inputPath of targets) {
    if (extname(inputPath).toLowerCase() !== '.pdf') {
      console.error(`Skipping (not a .pdf): ${inputPath}`);
      continue;
    }
    const { md, slug, stats } = await convert(inputPath);
    console.error(
      `${basename(inputPath)}: ${stats.pages} pages -> ${stats.paras} paragraphs, ` +
      `${stats.chars} chars, ~${Math.round(stats.chars / 4)} tokens, ${stats.chunks} chunks.`
    );

    if (dry) {
      console.error('--- DRY RUN: markdown below, nothing written, source kept ---\n');
      console.log(md);
      continue;
    }

    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `${slug}.md`);
    writeFileSync(outPath, md, 'utf8');
    console.error(`Wrote ${outPath}`);

    // Delete the source ONLY if it lives directly in the project root and the write succeeded.
    const inRoot = samePath(dirname(inputPath), ROOT);
    if (inRoot && !keep) {
      unlinkSync(inputPath);
      console.error(`Deleted source from project root: ${basename(inputPath)}`);
    } else if (inRoot && keep) {
      console.error(`Kept source (--keep): ${basename(inputPath)}`);
    }
  }

  if (!dry) {
    console.error('Review + clean the staged .md, move it up into knowledge/, set draft: false, then run `npm run ingest`.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
