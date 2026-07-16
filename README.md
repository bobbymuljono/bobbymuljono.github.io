# bobbymuljono-site

Personal portfolio site — About/bio, selected project write-ups, and an AI persona chatbot
("Bobby AI"), built with [Astro](https://astro.build).

> **Deployed on Vercel** (as of 2026-07-10) at [www.bobbymuljono.com](https://www.bobbymuljono.com)
> (custom domain attached 2026-07-16). Vercel auto-builds on push to `main`. See
> [Deployment](#deployment).

Design decisions and their reasoning live in [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Stack

- [Astro](https://astro.build) (TypeScript strict) — static pages, near-zero JS. The interactive
  islands are the chatbot and the contact-form dialog (both vanilla TS, no framework); the rest
  ships no JS.
- Content collections for project write-ups (`src/content/projects`)
- No component/animation library — hand-written CSS tokens in `src/styles/global.css`
- Self-hosted webfonts (Newsreader / Hanken Grotesk / IBM Plex Mono) in `src/styles/fonts.css` — no third-party font requests
- Light and dark theme, toggled from the sticky header. New visitors see light by default (the
  site does not follow OS `prefers-color-scheme`); dark only appears once toggled, and the choice
  persists in `localStorage`.
- **Chatbot (`src/pages/api/chat.ts` + `src/components/ChatBot.astro`)**: RAG over Supabase
  pgvector, Gemini embeddings, streamed generation from Claude Haiku or Gemini (switchable via
  `CHAT_PROVIDER`). Needs an on-demand server route — hence the `@astrojs/vercel` adapter.
  Toggle on/off via `CHAT_ENABLED` in `src/lib/chat/enabled.ts`; live in production as of
  2026-07-16 (always on in local dev).
- **Contact form (`src/pages/api/contact.ts` + `src/components/ContactForm.astro`)**: another
  on-demand route, sends mail via Resend (`RESEND_API_KEY`).

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build the production site to `./dist/`       |
| `npm run preview`  | Preview the production build locally         |
| `npm run ingest`   | Re-chunk + embed `knowledge/` + write-ups into Supabase (run after editing the chatbot KB) |
| `npm run pdf2md`   | Extract a PDF into a draft markdown file in `knowledge/_staging/` for review (KB prep helper) |

Running the chatbot locally (`npm run dev`) needs a `.env` file — copy `.env.example` and fill in the keys.

**Adding a PDF to the chatbot KB:** drop the `.pdf` into the project root and run `npm run pdf2md` — it extracts + cleans the text into `knowledge/_staging/<name>.md` (stamped `draft: true`) and deletes the source PDF from the root. Review and clean the staged markdown (fix flattened bullet lists, trim noise), move it up into `knowledge/`, set `draft: false`, then run `npm run ingest`. The `knowledge/_staging/` folder and root `*.pdf` files are git-ignored (transient scratch). You can also target a PDF anywhere with `npm run pdf2md -- "path/to/file.pdf"` (a PDF outside the root is never deleted), and add `--dry` to preview without writing.

## Adding a project

Copy `src/content/projects/_template.md` to a new file in the same folder (filename becomes the URL slug), fill in the frontmatter, and set `draft: false` once it's ready to publish.

## Deployment

**Vercel (canonical).** Pushing to `main` auto-builds Astro via the `@astrojs/vercel` adapter and deploys. Static pages are prerendered; the chatbot route (`src/pages/api/chat.ts`) and the contact-form route (`src/pages/api/contact.ts`), both `prerender = false`, are bundled as serverless functions. Currently live at `https://www.bobbymuljono.com` (custom domain attached 2026-07-16; `site` in [`astro.config.mjs`](./astro.config.mjs) points at it, canonical is `www`).

Required setup in **Vercel → Project → Settings → Environment Variables** (Production scope): `CHAT_PROVIDER`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DEVICE_ID_SALT` for the chatbot, plus `RESEND_API_KEY` (optional `CONTACT_TO`/`CONTACT_FROM` overrides) for the contact form. Without them the relevant endpoint returns a "Server is not configured" error. None may be `PUBLIC_`-prefixed — they're server-side secrets.

Still to do:

1. Confirm in the Vercel dashboard that the apex domain 301-redirects to `www`.

GitHub Pages has been retired (`deploy.yml` removed) — the chatbot needs a server runtime that Pages can't provide.

## License

Code is licensed under [LICENSE](./LICENSE). Written content and images are not covered by the code license — all rights reserved unless stated otherwise.
