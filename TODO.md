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
- [x] **Default OG share image** (2026-07-13): `public/og-default.png` (1200x630) shipped, rendered
  via an HTML `<canvas>` using the site's own self-hosted webfonts (not an image generator) so it
  matches the design tokens: oat background, inset hairline frame, forest-green period on the
  wordmark + a short forest accent rule, italic-serif "Senior Data Analyst" eyebrow, Newsreader
  headline, muted subtitle, bottom-right "bobbymuljono". Wired as the `image` prop default on
  `BaseLayout`, so every page now emits `og:image`/`twitter:image` and a `summary_large_image`
  Twitter card (pages can still override via the `image` prop).
- [ ] **Optional visual assets**: per-project cover screenshots (still outstanding; the default
  OG image above is done).
- [~] **Project write-ups: two real rewrites done; three still placeholders** (updated
  2026-07-15). The four original write-ups started as sample copy from the design bundle. **Two
  are now real, published rewrites**: `data-analyst-ai-agent.md` ("An AI agent did half a day of
  my analyst work in 3 minutes"), a journey piece (Boko → Astro → Clyde) with four inline HTML/CSS
  architecture diagrams (the `.arch` pattern), and `chat-recommendation-copilot.md` ("One-click
  magic: a multi-agent item recommendation copilot for chat support", published 2026-07-14), a
  case study on an AI item-recommendation copilot for shop-chat support agents. Both were written
  with Bobby via brain-dump + interview and cleared through the confidentiality gate (`draft:
  false`, live). `data-analyst-ai-agent.md` **replaced and deleted** the old
  `support-rag-chatbot.md` (URL changed to `/projects/data-analyst-ai-agent`). For
  `chat-recommendation-copilot.md`, confidentiality was cleared by softening internal metrics (a
  productivity lift described as "low single digits across multiple regions", the "no
  order-conversion hit" claim kept but qualitative), describing the internal AI builder generically
  ("think Coze"), keeping model names generic ("one of the leading frontier models" / "a
  lightweight model"), redacting a relevance-score threshold into plain English ("clears a high
  bar"), and omitting screenshots in favor of an inline architecture diagram; that diagram also
  introduced a branching variant of the `.arch` pattern (see `DESIGN_NOTES.md`). The other three
  (`ops-copilot-multi-agent`, `marketplace-health-dashboard`, `checkout-ab-framework`) are still
  placeholder scaffolding and remain **`draft: true`** (hidden from the live Work list) until Bobby
  rewrites each in his own words. Confidentiality still applies to each rewrite. **Use the
  `portfolio-writeup` skill** (see below) to draft/rework these.
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
  the env vars set in the dashboard. Verified live 2026-07-10. _Still open:_ **rotate the Gemini +
  Anthropic API keys** before wider promotion (both were exposed during setup) and update them in
  Vercel + local `.env`.
- [x] **Custom domain attached (2026-07-16)**: `www.bobbymuljono.com` is live and is now the
  canonical domain. `site` in `astro.config.mjs` was updated from
  `https://bobbymuljono-github-io.vercel.app` to `https://www.bobbymuljono.com`. _Still open:_
  confirm in the Vercel dashboard that the apex domain 301-redirects to `www`.
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
  - **PDF → KB helper (added 2026-07-11)**: `scripts/pdf-to-md.mjs` (`npm run pdf2md`, `pdfjs-dist`
    devDependency) extracts a PDF into a draft `.md` under `knowledge/_staging/` for review, so the
    ingest pipeline itself stays markdown-only. No-arg form converts every `*.pdf` in the project
    root then deletes the source from the root; explicit-path form (`-- <path>`) targets one PDF and
    only deletes it if it lives in the root; `--dry` previews, `--keep` skips deletion. Extraction is
    intentionally staged because it's noisy (bullet lists flatten onto one line, running
    headers/footers need trimming) — promote `knowledge/_staging/*.md` into `knowledge/` (set
    `draft: false`) only after a human cleanup pass, then `npm run ingest`. `knowledge/_staging/` and
    root `*.pdf` are git-ignored. _Deferred nicety:_ auto-split `● …` bullet runs into markdown list
    items during extraction to cut manual cleanup (skipped for now — review step handles it).
  - **Env vars** (local `.env`, git-ignored; also set in Vercel → Production): `CHAT_PROVIDER`,
    `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. The
    service-role key is server-side only — never `PUBLIC_`-prefixed, never in the browser.
    `.env.example` is the tracked template (no real secrets).
  - _Gemini generation quota:_ the current Gemini key's project has **zero free-tier *generation*
    quota** (`limit: 0` on `gemini-2.0-flash`); embeddings work fine. `gemini-3.5-flash` has quota
    but hits transient 503s. This is why `CHAT_PROVIDER=anthropic` is the working default — resolve
    Gemini billing before switching the provider to gemini.

- [x] **Chatbot on/off toggle (shipped 2026-07-10, updated 2026-07-13, live in prod 2026-07-16)**:
  built as a single source-level flag rather than an env var (simpler, no Vercel dashboard step
  needed) — `src/lib/chat/enabled.ts` now exports
  `CHAT_ENABLED = import.meta.env.DEV || ENABLED_IN_PROD`, imported by both `ChatBot.astro` and
  `pages/api/chat.ts`. The chatbot is **always enabled under `npm run dev`** so it can be tested
  locally without touching the prod flag; production is gated solely by the source-level
  `ENABLED_IN_PROD` boolean (flip it + redeploy to bring it back). When disabled: the launch button
  renders as a disabled, dashed-border button reading "Chat with Bobby AI · *In development*" (the
  italic badge reuses the existing `.badge` token, no new colors) instead of the launch button +
  dialog, and `POST /api/chat` short-circuits with a `503` so the endpoint can't be hit directly
  while hidden. **`ENABLED_IN_PROD` was flipped to `true` on 2026-07-16** — the chatbot is now
  live in production.

- [~] **Chatbot persona rework (2026-07-13, one iteration, more expected)**: replaced the old
  thin 5-rule `PERSONA` constant in `src/pages/api/chat.ts` with a structured one: a Voice section
  (warm coffee-chat colleague, a light casual Singlish rhythm via short affirmatives like "yea
  can"/"ok can" but explicitly no particles lah/leh/meh, framed as a speaking style only "not a
  fact to announce", occasional follow-up questions, no emoji), a Length cap (2-4 sentences
  default, don't pad), a Grounding+privacy section (facts only from CONTEXT; personal/demographic
  details, location, nationality, birthplace, age, family, availability, are private unless present
  in CONTEXT), and Boundaries (no internal metrics/dollar figures/client/team/market-count
  specifics). Driven by testing against the live Supabase conversation log (replies were running
  too long, and the bot had volunteered location/nationality by inference). The chatbot is now
  **live in production** (`ENABLED_IN_PROD = true` as of 2026-07-16). **Re-ingested 2026-07-15**
  after `chat-recommendation-copilot.md` went live: the Supabase `documents` table held 29 chunks
  from 4 sources (the two knowledge files plus the two published write-ups), and an agent
  smoke-test confirmed the new article answers from retrieval. **KB enriched and re-ingested again
  2026-07-16**: added `knowledge/career-story.md` (first-person career narrative: First Code
  Academy to ISS to Shopee, the mid-2025 pivot into AI, how he works, lessons, what's next) and
  expanded `knowledge/faq.md` from 3 to 11 Q&As (adds: what he's best at, working style, why
  AI+analytics, tools/stack, what he's learning, open-to-opportunities/freelance, outside-work).
  The `documents` table now holds 37 chunks from 5 sources (`bio.md`, `faq.md`, `career-story.md`,
  `data-analyst-ai-agent.md`, `chat-recommendation-copilot.md`). **Deferred next step**: add
  `views.md`, an opinions/POV knowledge file (what makes an AI agent useful vs. a demo, telling
  good output from slop, where analytics is heading, when to reach for AI, contrarian opinions).
  Interview questions are drafted, Bobby's brain-dump is pending. This is the last high-value KB
  content file planned after career-story + faq.
- [x] **Chatbot streaming UX (2026-07-13)**: `ChatBot.astro` replaced the immediate per-chunk
  `textContent = full` render with a typewriter "pump" that buffers incoming network text and
  reveals a few characters per animation frame (adaptive, speeds up to catch up on bursty chunks),
  so the stream reads naturally instead of lurching. Respects `prefers-reduced-motion` (renders
  instantly, no typewriter) and only auto-scrolls the log when the reader is already at the bottom.
- [x] **Chatbot starter questions (2026-07-13)**: added four clickable predefined starter-question
  chips (`data-chat-starters` container, `data-chat-starter` buttons) shown in the chat's empty
  state to guide visitors. Clicking a chip sends that hard-coded question through a shared
  `sendMessage()` path (form submit now calls the same function); chips are removed once a
  conversation begins. New `.bobbychat__starters` / `.bobbychat__chip` styles (hairline border that
  shifts to accent-border + sage-wash on hover, matching the interactive-card hover cue). Still
  vanilla-TS, no new dependencies.

- [ ] **Chatbot cost / abuse protection (added 2026-07-15, chatbot went live in prod 2026-07-16
  regardless)**: figure out how to stop sustained or abusive chatting from burning
  Anthropic/Gemini API tokens now that the bot is public. There's already an in-app per-session
  rate limit (12 msgs / 60s, `RATE_LIMIT_MAX` in `src/pages/api/chat.ts`), but it keys off a
  client-supplied `sessionId` (spoofable) and won't stop a determined abuser hammering `/api/chat`.
  The new `device_hash` (server-derived HMAC of a persistent client device id, see the
  conversation-analytics item below) is a better, less-spoofable candidate rate-limit key than
  `sessionId`, worth switching to once it's flowing. Also still worth investigating Vercel-side
  controls: **Vercel Firewall / WAF rate limiting** on the `/api/chat` route, IP-based limits, a
  **spend cap / usage alert**, plus **provider-side spend limits** (Anthropic usage caps, Gemini
  billing quota).

- [ ] **Chatbot conversation analytics (added 2026-07-16)**: the Supabase `conversations` table
  gained two columns: `country` (from Vercel's `x-vercel-ip-country` geo header, null under local
  dev) and `device_hash` (a one-way HMAC-SHA256 hash, via `node:crypto`, of a persistent client
  device id; the raw id is never stored). `ChatBot.astro` now generates/sends a persistent
  `deviceId` (localStorage key `bobbychat_device`); `src/pages/api/chat.ts` reads the geo header
  and hashes the device id with a new `DEVICE_ID_SALT` env var and includes both in the insert.
  `supabase/schema.sql` was updated with the columns plus idempotent `ALTER` statements, and
  `.env.example` gained `DEVICE_ID_SALT`. **Two manual steps still outstanding**: (1) run the
  `ALTER` statements in the Supabase SQL editor; (2) set `DEVICE_ID_SALT` in Vercel Production and
  local `.env`.

- [ ] **Blog / Writing**: second content collection under `src/content/blog`, frontmatter
  `{ title, description, date, tags, draft }`. The last deferred screen from the design bundle.

- [x] **Contact form (2026-07-13)**: added a Resend-backed on-demand endpoint
  (`src/pages/api/contact.ts`, `prerender = false`) and a `<dialog>` island
  (`src/components/ContactForm.astro`); the site now has two on-demand routes (`/api/chat` and
  `/api/contact`). Requires `RESEND_API_KEY` in Vercel Production (optional `CONTACT_TO`/
  `CONTACT_FROM` overrides).
- [x] **Header CTA restructure (2026-07-13)**: the hero's standalone "Get in touch" button was
  removed (it now lives header-only, at `/#contact`); the header gained a primary "Chat with Bobby
  AI" CTA. `ChatBot.astro` picked up `sm`/`primary` props to support the header (small) vs. hero
  (full-size) placements, both with the on-brand inline-SVG sparkle.
- [x] **Dark mode (2026-07-14)**: full dark theme added. `:root[data-theme='dark']` in
  `src/styles/global.css` remaps the semantic tokens (plus `--sage-wash`) to warm, forest-derived
  dark surfaces (never pure black) with the accent lifted for contrast, so component CSS inverts
  automatically. An anti-flash inline script in `BaseLayout.astro`'s `<head>` applies the stored
  theme before paint; new visitors default to **light** and the site does not follow
  `prefers-color-scheme`, dark only appears once a visitor toggles it (persisted in
  `localStorage` under `theme`). The toggle is a slider switch in the sticky header
  (`Header.astro`), left of the Work link. Also fixed in this pass: the `.arch__group` background
  in `data-analyst-ai-agent.md` was hardcoded to the light-only `--oat-raised` token (stayed pale
  and unreadable in dark) and now uses the semantic `--color-surface`; the hero portrait in
  `index.astro` gets a dark-mode override (drops the bottom mask-fade, restores a full border,
  adds `--shadow-md`, slight brightness/contrast filter) so the light studio photo seats against
  the dark page, light mode unchanged. The hero's tag list was also removed from `index.astro`
  (declutter), so the hero body now holds only the CTA row. See `DESIGN_NOTES.md` for the full
  reasoning.

## Repo setup reminders

- Local: `.obsidian/` and `.claude/` are intentionally kept on disk but gitignored — don't expect them on a fresh clone.
- Local `.env` is required to run the chatbot in `npm run dev` (git-ignored — copy `.env.example` and fill in the secrets). `test_chat.*` scratch scripts are git-ignored too.
- Deploy is **Vercel** (auto-builds on push to `main`). Set the 6 chatbot env vars (including `DEVICE_ID_SALT`, added 2026-07-16) in the Vercel dashboard (Production scope) — see Phase 2. GitHub Pages is retired (`deploy.yml` removed).

## Working agreements

- [ ] **Design inspiration**: for future design/layout changes, Bobby will supply reference sites/samples directly. Don't web-search for inspiration and design independently — wait for the samples first.
