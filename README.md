# bobbymuljono-site

Personal portfolio site — About/bio, selected project write-ups, and an AI persona chatbot
("Bobby AI"), built with [Astro](https://astro.build).

> **Deployed on Vercel** (as of 2026-07-10). Vercel auto-builds on push to `main`. A custom
> domain is still to be attached. See [Deployment](#deployment).

Design decisions and their reasoning live in [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Stack

- [Astro](https://astro.build) (TypeScript strict) — static pages, near-zero JS. The one
  interactive island is the chatbot (vanilla TS, no framework); the rest ships no JS.
- Content collections for project write-ups (`src/content/projects`)
- No component/animation library — hand-written CSS tokens in `src/styles/global.css`
- Self-hosted webfonts (Newsreader / Hanken Grotesk / IBM Plex Mono) in `src/styles/fonts.css` — no third-party font requests
- **Chatbot (`src/pages/api/chat.ts` + `src/components/ChatBot.astro`)**: RAG over Supabase
  pgvector, Gemini embeddings, streamed generation from Claude Haiku or Gemini (switchable via
  `CHAT_PROVIDER`). Needs an on-demand server route — hence the `@astrojs/vercel` adapter.

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build the production site to `./dist/`       |
| `npm run preview`  | Preview the production build locally         |
| `npm run ingest`   | Re-chunk + embed `knowledge/` + write-ups into Supabase (run after editing the chatbot KB) |

Running the chatbot locally (`npm run dev`) needs a `.env` file — copy `.env.example` and fill in the keys.

## Adding a project

Copy `src/content/projects/_template.md` to a new file in the same folder (filename becomes the URL slug), fill in the frontmatter, and set `draft: false` once it's ready to publish.

## Deployment

**Vercel (canonical).** Pushing to `main` auto-builds Astro via the `@astrojs/vercel` adapter and deploys. Static pages are prerendered; the chatbot route (`src/pages/api/chat.ts`, `prerender = false`) is bundled as a serverless function. Currently live at `https://bobbymuljono-github-io.vercel.app`.

Required setup in **Vercel → Project → Settings → Environment Variables** (Production scope): `CHAT_PROVIDER`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Without them the chatbot endpoint returns a "Server is not configured" error. None may be `PUBLIC_`-prefixed — they're server-side secrets.

Still to do:

1. Attach a **custom domain** (Vercel dashboard → Project → Domains walks through the DNS records).
2. Update `site` in [`astro.config.mjs`](./astro.config.mjs) from the `.vercel.app` URL to the final domain — it drives canonical URLs, the sitemap, and absolute OG image URLs.

GitHub Pages has been retired (`deploy.yml` removed) — the chatbot needs a server runtime that Pages can't provide.

## License

Code is licensed under [LICENSE](./LICENSE). Written content and images are not covered by the code license — all rights reserved unless stated otherwise.
