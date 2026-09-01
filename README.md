# bobbymuljono-site

Personal portfolio site — About/bio, selected project write-ups, and an AI persona chatbot
("Bobby AI"), built with [Next.js](https://nextjs.org) (App Router).

> **Deployed on Vercel** (as of 2026-07-10) at [www.bobbymuljono.com](https://www.bobbymuljono.com)
> (custom domain attached 2026-07-16). Vercel auto-builds on push to `main`. A migration from
> Astro to Next.js is complete on the `feature/nextjs-migration` integration branch; the cutover
> merge to `main` and production redeploy are still pending, so production is currently still
> serving the Astro build. See [Deployment](#deployment).

Design decisions and their reasoning live in [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Stack

- [Next.js](https://nextjs.org) 15 (App Router) with React 19, TypeScript strict — server
  components by default (near-zero client JS), with small client components used only where
  interactivity is genuinely needed (the chatbot, the contact-form dialog, the theme toggle,
  the header nav, scroll reveal). No general-purpose UI or animation library.
- Content for project write-ups lives in `content/projects` (a `fs` + `gray-matter` + `zod`
  loader in `lib/content.ts`); the two published write-ups are `.mdx`, the rest are `.md`.
- No component/animation library — hand-written CSS tokens in `styles/global.css`
- Self-hosted webfonts (Newsreader / Hanken Grotesk / IBM Plex Mono) in `styles/fonts.css` — no third-party font requests
- Light and dark theme, toggled from the sticky header (`components/ThemeToggle.tsx`). New
  visitors see light by default (the site does not follow OS `prefers-color-scheme`); dark only
  appears once toggled, and the choice persists in `localStorage`.
- **Chatbot (`app/api/chat/route.ts` + `components/ChatBot.tsx`)**: RAG over Supabase
  pgvector, Gemini embeddings, streamed generation from Claude Haiku or Gemini (switchable via
  `CHAT_PROVIDER`). Needs an on-demand server route — Next.js route handlers deploy to Vercel
  natively, no adapter required. Toggle on/off via `CHAT_ENABLED` in `lib/chat/enabled.ts`; live
  in production as of 2026-07-16 (always on outside production, i.e. in local dev).
- **Contact form (`app/api/contact/route.ts` + `components/ContactForm.tsx`)**: another
  on-demand route, sends mail via Resend (`RESEND_API_KEY`).

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:3000`   |
| `npm run build`    | Build the production site (`next build`)     |
| `npm run start`    | Serve the production build locally (`next start`) |
| `npm run lint`     | Lint the codebase (`next lint`)              |
| `npm run ingest`   | Re-chunk + embed `knowledge/` + write-ups (from `content/projects/`) into Supabase (run after editing the chatbot KB) |
| `npm run pdf2md`   | Extract a PDF into a draft markdown file in `knowledge/_staging/` for review (KB prep helper) |

Running the chatbot locally (`npm run dev`) needs a `.env` file — copy `.env.example` and fill in the keys.

**Adding a PDF to the chatbot KB:** drop the `.pdf` into the project root and run `npm run pdf2md` — it extracts + cleans the text into `knowledge/_staging/<name>.md` (stamped `draft: true`) and deletes the source PDF from the root. Review and clean the staged markdown (fix flattened bullet lists, trim noise), move it up into `knowledge/`, set `draft: false`, then run `npm run ingest`. The `knowledge/_staging/` folder and root `*.pdf` files are git-ignored (transient scratch). You can also target a PDF anywhere with `npm run pdf2md -- "path/to/file.pdf"` (a PDF outside the root is never deleted), and add `--dry` to preview without writing.

## Adding a project

Copy `content/projects/_template.md` to a new file in the same folder (filename becomes the URL slug), fill in the frontmatter, and set `draft: false` once it's ready to publish. Use a `.mdx` extension instead of `.md` if the write-up needs to embed a React component (for example, an architecture diagram from `components/arch/`).

## Deployment

**Vercel (canonical), native Next.js on cutover.** The Astro to Next.js migration (App Router, React 19) is complete on the `feature/nextjs-migration` integration branch; merging to `main` and redeploying to production are still pending, so production currently still serves the Astro build (see `TODO.md`). Once cut over, pushing to `main` auto-builds and deploys via Vercel's native Next.js support, no adapter and no `vercel.json`. Static/SSG pages are prerendered; the chatbot route (`app/api/chat/route.ts`) and the contact-form route (`app/api/contact/route.ts`), both Next.js route handlers (`runtime: 'nodejs'`, `dynamic: 'force-dynamic'`), are bundled as serverless functions. `next.config.mjs` sets `trailingSlash: true` so the existing URL shape (`/projects/`, `/projects/<slug>/`) carries over unchanged; requests without a trailing slash 308-redirect. The domain itself does not change: `https://www.bobbymuljono.com` (custom domain attached 2026-07-16; canonical is `www`).

Required setup in **Vercel → Project → Settings → Environment Variables** (Production scope): `CHAT_PROVIDER`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DEVICE_ID_SALT` for the chatbot, plus `RESEND_API_KEY` (optional `CONTACT_TO`/`CONTACT_FROM` overrides) for the contact form. Without them the relevant endpoint returns a "Server is not configured" error. None may be `PUBLIC_`-prefixed — they're server-side secrets (Next.js's client-exposed prefix, `NEXT_PUBLIC_`, is unused here).

Still to do:

1. Merge `feature/nextjs-migration` into `main` and redeploy (the Next.js cutover).
2. Confirm in the Vercel dashboard that the apex domain 301-redirects to `www`.

GitHub Pages has been retired (`deploy.yml` removed) — the chatbot needs a server runtime that Pages can't provide.

## License

Code is licensed under [LICENSE](./LICENSE). Written content and images are not covered by the code license — all rights reserved unless stated otherwise.
