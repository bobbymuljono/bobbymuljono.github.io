# TODO

Working notes and handover checklist for this repo. See [DESIGN_NOTES.md](./DESIGN_NOTES.md) for design reasoning and [README.md](./README.md) for stack/commands.

## Design system (2026-07-08)

The site now runs on the imported **Bobby Muljono editorial design system** (Claude Design
handoff bundle) — see `DESIGN_NOTES.md`. The first pass covered **Home + Work**; the **Chat**
persona shipped 2026-07-10 (see Phase 2 below). **Writing** (blog) is the last deferred screen.
Bio + project copy were populated from the bundle's sample content.

## Content checklist (blocking a real launch)

- [x] **Bio content** (`src/pages/index.astro`): hero, lead paragraph, and contact section
  populated from the design bundle's first-person copy (Senior Data Analyst at Shopee, 5+ yrs,
  RAG / multi-agent / 8 markets). Skill tags regrounded in the real resume (Presto SQL, Python,
  LangChain, RAG, Multi-agent, Claude agents & skills, A/B testing) — no longer generic. Removed
  the "Available for AI & analytics work" badge and the "8 markets" skill/tech tags per review.
- [x] **Contact details**: GitHub and LinkedIn (`linkedin.com/in/bobbymul`) are wired real in
  both `src/pages/index.astro` and `src/components/Footer.astro`. Email was intentionally removed
  everywhere (hero contact row + footer) — not published. `bobbymul93@gmail.com` is on file from
  the resume if a mail link is ever wanted again.
- [x] **Résumé PDF — won't do** (2026-07-08): decided not to host the résumé on the site (it
  evolves over time). It's parsed in as context for copy instead; there's no link to wire up.
- [x] **3-5 real projects** (`src/content/projects/`): four write-ups added (support-rag-chatbot,
  ops-copilot-multi-agent, marketplace-health-dashboard, checkout-ab-framework) with `kind`,
  description, techStack, and Problem/Approach/Technical decisions/What I learned prose. Add
  real `liveUrl`/`repoUrl` where they exist.
- [x] **Experience section** (2026-07-08): added a minimalist progression list on the Home page
  directly below the hero (`.experience` / `.exp-list` in `src/pages/index.astro`), styled after
  the henrylin.io reference Bobby supplied. Each entry is company (serif) + year range (right,
  muted) on one line, an italic-serif role, and a one-liner — reverse-chronological, whitespace-
  separated, no dividers; year drops below company on mobile. Entries: Shopee — Senior Data Analyst
  — 2020–Present — "Building analytical solutions with AI"; ISS Facility Services — Data Analyst —
  2019–2020 — "Drawing insights from data"; First Code Academy — STEM Course Facilitator — 2017 —
  "Teaching kids how to code" (this last role is not on the résumé; Bobby supplied it directly).
  No confidentiality concern — the earlier draft's résumé metrics were dropped in favour of the
  one-liners. The résumé itself is intentionally NOT hosted (it evolves) — parsed in as context
  only. Education (NTU, Singapore Polytechnic) is intentionally left out to keep the list minimal
  (confirmed 2026-07-08 — keep it off).
- [x] **Headshot photo** (2026-07-08): real headshot added at `public/bobby-headshot.png` and
  wired into the hero on `src/pages/index.astro` — the `.avatar-placeholder` ("BM") monogram is
  gone. The photo fills the 320×400 sage-wash panel (`object-fit: cover`, `object-position:
  center top`) with a subtle CSS bottom-fade mask that dissolves it into the sage (image file
  untouched). Hero markup was split into `.hero__intro` / `.hero__portrait` / `.hero__body` and
  laid out with grid areas so the photo sits between the intro and the CTAs when stacked on
  mobile. `.avatar-placeholder` remains in `global.css` as the documented monogram fallback.
- [x] **Self-host fonts** (2026-07-08): Newsreader / Hanken Grotesk / IBM Plex Mono are now
  self-hosted from `public/fonts/` (latin + latin-ext `woff2` subsets) via `@font-face` in
  `src/styles/fonts.css`, imported by `BaseLayout`. The Google Fonts `<link>` + `preconnect`
  tags are gone; the two above-the-fold latin faces (Hanken 400 body, Newsreader 600 hero) are
  `preload`ed. Regenerate with `scripts/fetch-fonts.ps1` if the weights/axes change. Restores
  the near-zero-network goal (no third-party font request).
- [ ] **Optional visual assets**: per-project cover screenshots, a real default OG share image
  (`public/og-default.png` doesn't exist yet — the `image` prop on `BaseLayout` is optional and
  currently unused).
- [~] **Project write-ups: first real rewrite done; three still placeholders** (updated
  2026-07-10). The four write-ups started as sample copy from the design bundle. **One is now a
  real, published rewrite**: `data-analyst-ai-agent.md` ("An AI agent did half a day of my
  analyst work in 3 minutes"), a journey piece (Boko → Astro → Clyde) with four inline HTML/CSS
  architecture diagrams (the `.arch` pattern), written with Bobby via brain-dump + interview and
  cleared through the confidentiality gate (`draft: false`, live). It **replaced and deleted** the
  old `support-rag-chatbot.md` (URL changed to `/projects/data-analyst-ai-agent`). The other three
  (`ops-copilot-multi-agent`, `marketplace-health-dashboard`, `checkout-ab-framework`) are still
  placeholder scaffolding and were flipped to **`draft: true`** (hidden from the live Work list)
  until Bobby rewrites each in his own words. Confidentiality still applies to each rewrite. **Use
  the `portfolio-writeup` skill** (see below) to draft/rework these.
- [x] **Content-writing skill** (2026-07-08): built a project `portfolio-writeup` skill at
  `.claude/skills/portfolio-writeup/SKILL.md` for writing impactful, lean, illustrative work
  showcases. Two modes (interview-first + rough-notes→draft), flexible per-project structure,
  warm & personal voice, and a confidentiality gate that softens internal metrics by default and
  appends a "please check" list (keeps `draft: true` until cleared). Validated against a real
  project (the AI data analyst agent) vs a no-skill baseline — clear lift. **Versioned with the
  repo**: `.gitignore` was changed to `.claude/*` + `!.claude/skills/`, so the skill is tracked
  and travels to other devices on clone, while local `.claude` files (launch.json,
  settings.local.json) stay ignored.
- [x] **Skill expanded from the first real write-up** (2026-07-10): after drafting
  `data-analyst-ai-agent.md`, folded the lessons back into `portfolio-writeup/SKILL.md`. New
  guidance: an **Illustrations & diagrams** section (build diagrams as self-contained inline
  HTML/CSS in the `.md` using the design tokens, not image-gen; lock the architecture with Bobby
  first; the `.arch` reference pattern; preview-verify workflow; gentle glyphs only, no aggressive
  symbols like the heavy X); a hard **no em-dashes / en-dashes** rule; **strong concrete,
  searchable titles** (not vague); the **hook as a lead before the first heading**, with every
  heading matching its section; the journey/evolution shape; deriving an honest hook number
  (show the math, or use a compression framing) instead of inventing one; stand-in names for
  internal tools; and slug-rename on replacement. No-em-dashes is also saved to Claude's memory as
  a general writing preference.

## Decisions log

- [x] **Framework**: Astro (TypeScript strict) — ships ~0KB JS, static output for GitHub Pages.
- [x] **License**: MIT (switched from GPL-3.0, 2026-07-07) — copyleft was a poor fit for a portfolio.
- [x] **Hosting / domain — migrated to Vercel (2026-07-10)**: **Vercel is now canonical.** The
  chatbot needs a server runtime (the `/api/chat` endpoint is `prerender = false`), which GitHub
  Pages can't serve, so the migration became mandatory rather than optional. Done this session:
  added the **`@astrojs/vercel` adapter** to `astro.config.mjs` (static pages stay prerendered;
  only `/api/chat` becomes a serverless function), updated `site` to
  `https://bobbymuljono-github-io.vercel.app`, and **removed `.github/workflows/deploy.yml`**
  (the Pages CI could not build the server route). Push to `main` now auto-deploys to Vercel with
  the env vars set in the dashboard. Verified live 2026-07-10. _Still open:_ (1) attach a **custom
  domain** in Vercel → Domains, then update `site` in `astro.config.mjs` to it (drives canonical
  URLs, sitemap, absolute OG URLs) — DNS differs from the old GH Pages A-record recipe
  (185.199.108/109/110/111.153 + `www` CNAME no longer apply); (2) **rotate the Gemini + Anthropic
  API keys** before wider promotion (both were exposed during setup) and update them in Vercel +
  local `.env`.
- [x] **Chatbot backend (built 2026-07-10)**: originally planned as a Supabase Edge Function; **shipped instead as an Astro on-demand endpoint** (`src/pages/api/chat.ts`) running on the Vercel adapter — keeps everything in one codebase/deploy. Supabase is still used, but as the **pgvector store + conversation log** (Postgres), not as the compute. Provider is switchable (Claude Haiku / Gemini) via `CHAT_PROVIDER`. See Phase 2 for the full shape.
- [x] **Layout redesign (2026-07-07)**: original design read as "plain and uninviting." Reworked to a side-by-side photo hero (placeholder avatar for now), card/bento-grid content sections (Now card, Background timeline, Stack pill-grid, Contact card), and subtle CSS-only hover reveals (animated underline on links, lift + image zoom on project cards) — still zero shipped JS.
- [x] **Design system import (2026-07-08)**: adopted the Claude Design handoff bundle ("Bobby Muljono editorial design system") — warm stone + single forest-green accent, Newsreader/Source Sans 3/IBM Plex Mono, hairline-driven editorial layout. Replaced the prior warm-clay/system-font tokens in `global.css`; rebuilt nav, footer, Home and Work to match. Fonts now load from Google Fonts CDN (one deliberate webfont request). Writing + Chat screens deferred to Phase 2. See `DESIGN_NOTES.md`.
- [x] **Scroll-reveal + elevated cards (2026-07-07)**: added a small vanilla-JS `IntersectionObserver` (inlined, no separate `.js` file) that fades in About sections and project cards on scroll — fully progressive enhancement, content is visible immediately with no JS or `prefers-reduced-motion` set. Cards moved from a flat border to a shadow-based elevation (softer radius, resting + hover shadow tokens), inspired by the Supercharged Design agency site the user shared, kept deliberately more restrained than that reference. See `DESIGN_NOTES.md`.
- [x] **Font refresh to match updated bundle (2026-07-08)**: body/UI font Source Sans 3 → **Hanken Grotesk**; eyebrows/tags/badges/footer heads/chat marker moved from mono UPPERCASE → **italic Newsreader** (sentence case, `--font-label` token). IBM Plex Mono is now code/data only. Shipped in PR #1.
- [x] **Redundancy / UX cleanup (2026-07-08)**: (1) **sticky header** — the top bar is now `position: sticky` with a solid stone background + hairline (no blur, per the design system), so the `Get in touch` CTA stays reachable on scroll; (2) **de-duplicated the header** — dropped the `Contact` text link since `Get in touch` already targets `#contact` (nav is now `Work · Get in touch`); (3) **minimal footer** — removed the `Site`/`Elsewhere` columns that duplicated the header nav + contact links; footer is now brand + tagline + `©` on the left and a single `GitHub · LinkedIn` line on the right. Still zero shipped JS. _Note: the hero still has its own `Get in touch` secondary button (standard hero dual-CTA); left as-is, easy to drop later if it reads as redundant with the sticky CTA._

## Phase 2

- [x] **Chatbot — "Bobby AI" (shipped 2026-07-10)**: a vanilla-TS `<dialog>` island launched from
  a **hero CTA button** ("Chat with Bobby AI", `src/components/ChatBot.astro`) — no UI framework,
  streaming fetch, session-id in localStorage. It calls an **Astro on-demand endpoint**
  (`src/pages/api/chat.ts`, `prerender = false`), not the originally-planned Supabase Edge Function
  — the adapter route was simpler to keep in one codebase. Per request the endpoint: validates +
  rate-limits (12 msgs / 60s per session via a recent-row count), embeds the question, retrieves
  the top-5 matching chunks from Supabase pgvector, assembles the persona system prompt + context +
  recent history, streams the reply, and logs the turn to a `conversations` table.
  - **Provider-switchable** via `CHAT_PROVIDER` env var: `anthropic` → Claude Haiku
    (`claude-haiku-4-5`), else Gemini (`gemini-3.5-flash`). Abstraction lives in `src/lib/chat/`
    (`types.ts`, `gemini.ts`, `anthropic.ts`, `index.ts` selector). Currently set to `anthropic`.
  - **Embeddings are always Gemini** (`gemini-embedding-001`, 768-dim) — Anthropic has no
    embeddings API — regardless of `CHAT_PROVIDER`. So `GEMINI_API_KEY` is *always* required.
  - **RAG corpus**: `knowledge/` (`bio.md` seeded; `faq.md` + `resume.md` are stubs for Bobby to
    fill) plus published project write-ups. `scripts/ingest.mjs` chunks + embeds them and rebuilds
    the `documents` table — run `npm run ingest` after editing the KB. Schema in
    `supabase/schema.sql` (`documents` + `conversations` tables, HNSW index, `match_documents` RPC,
    service_role grants) — applied manually in the Supabase SQL editor.
  - **Env vars** (local `.env`, git-ignored; also set in Vercel → Production): `CHAT_PROVIDER`,
    `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. The
    service-role key is server-side only — never `PUBLIC_`-prefixed, never in the browser.
    `.env.example` is the tracked template (no real secrets).
  - _Gemini generation quota:_ the current Gemini key's project has **zero free-tier *generation*
    quota** (`limit: 0` on `gemini-2.0-flash`); embeddings work fine. `gemini-3.5-flash` has quota
    but hits transient 503s. This is why `CHAT_PROVIDER=anthropic` is the working default — resolve
    Gemini billing before switching the provider to gemini.

- [x] **Chatbot on/off toggle (shipped 2026-07-10)**: built as a single source-level flag rather
  than an env var (simpler, no Vercel dashboard step needed) — `export const CHAT_ENABLED = false`
  in `src/lib/chat/enabled.ts`, imported by both `ChatBot.astro` and `pages/api/chat.ts`. Flip that
  one line + redeploy to bring it back. When `false`: the hero renders a disabled, dashed-border
  button reading "Chat with Bobby AI · *In development*" (the italic badge reuses the existing
  `.badge` token, no new colors) instead of the launch button + dialog, and `POST /api/chat`
  short-circuits with a `503` so the endpoint can't be hit directly while hidden. Currently **off**
  while Bobby reworks the persona/KB.

- [ ] **Blog / Writing**: second content collection under `src/content/blog`, frontmatter
  `{ title, description, date, tags, draft }`. The last deferred screen from the design bundle.

## Repo setup reminders

- Local: `.obsidian/` and `.claude/` are intentionally kept on disk but gitignored — don't expect them on a fresh clone.
- Local `.env` is required to run the chatbot in `npm run dev` (git-ignored — copy `.env.example` and fill in the secrets). `test_chat.*` scratch scripts are git-ignored too.
- Deploy is **Vercel** (auto-builds on push to `main`). Set the 5 chatbot env vars in the Vercel dashboard (Production scope) — see Phase 2. GitHub Pages is retired (`deploy.yml` removed).

## Working agreements

- [ ] **Design inspiration**: for future design/layout changes, Bobby will supply reference sites/samples directly. Don't web-search for inspiration and design independently — wait for the samples first.
