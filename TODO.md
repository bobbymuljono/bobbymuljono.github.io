# TODO

Working notes and handover checklist for this repo. See [DESIGN_NOTES.md](./DESIGN_NOTES.md) for design reasoning and [README.md](./README.md) for stack/commands.

## Design system (2026-07-08)

The site now runs on the imported **Bobby Muljono editorial design system** (Claude Design
handoff bundle) — see `DESIGN_NOTES.md`. This pass covered **Home + Work** only; **Writing**
and **Chat** stay Phase 2. Bio + project copy were populated from the bundle's sample content.

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
- [ ] **Résumé PDF**: coming later; wire up the link once the file exists.
- [x] **3-5 real projects** (`src/content/projects/`): four write-ups added (support-rag-chatbot,
  ops-copilot-multi-agent, marketplace-health-dashboard, checkout-ab-framework) with `kind`,
  description, techStack, and Problem/Approach/Technical decisions/What I learned prose. Add
  real `liveUrl`/`repoUrl` where they exist.
- [x] **Headshot photo** (2026-07-08): real headshot added at `public/bobby-headshot.png` and
  wired into the hero on `src/pages/index.astro` — the `.avatar-placeholder` ("BM") monogram is
  gone. The photo fills the 320×400 sage-wash panel (`object-fit: cover`, `object-position:
  center top`) with a subtle CSS bottom-fade mask that dissolves it into the sage (image file
  untouched). Hero markup was split into `.hero__intro` / `.hero__portrait` / `.hero__body` and
  laid out with grid areas so the photo sits between the intro and the CTAs when stacked on
  mobile. `.avatar-placeholder` remains in `global.css` as the documented monogram fallback.
- [ ] **Self-host fonts (optional)**: Newsreader / Source Sans 3 / IBM Plex Mono currently load
  from the Google Fonts CDN via `<link>` in `BaseLayout.astro`. Download and `@font-face` them
  if you want to drop the network request.
- [ ] **Optional visual assets**: per-project cover screenshots, a real default OG share image
  (`public/og-default.png` doesn't exist yet — the `image` prop on `BaseLayout` is optional and
  currently unused).
- [ ] **Project write-ups are intentional placeholders** (2026-07-08): the four write-ups were
  authored from the bundle's representative sample copy and are kept live **as scaffolding /
  inspiration** — Bobby will rewrite each one-by-one in his own words. Do NOT treat the current
  copy as final. Confidentiality still applies: when each is rewritten, confirm it only describes
  what's public/non-confidential about the Shopee work before publishing.

## Decisions log

- [x] **Framework**: Astro (TypeScript strict) — ships ~0KB JS, static output for GitHub Pages.
- [x] **License**: MIT (switched from GPL-3.0, 2026-07-07) — copyleft was a poor fit for a portfolio.
- [~] **Hosting / domain (updated 2026-07-08)**: **migrating to Vercel.** The site is currently
  dual-hosted — GitHub Pages (`bobbymuljono.github.io`, the documented CI deploy) **and** Vercel.
  Decision: make **Vercel the canonical home** and attach the custom domain there, then retire the
  Pages deploy (running two public copies indefinitely risks duplicate-content/SEO ambiguity).
  Cutover steps: (1) point the domain's DNS at Vercel per its dashboard (differs from the old GH
  Pages A-record recipe — 185.199.108/109/110/111.153 + `www` CNAME no longer apply); (2) update
  `site` in `astro.config.mjs` to the real domain (drives canonical URLs, sitemap, absolute OG
  URLs); (3) disable/remove `.github/workflows/deploy.yml` (or set Pages Source → None). _Open:
  record the Vercel project URL + final domain here once confirmed._
- [x] **Chatbot backend (Phase 2)**: Supabase Edge Function, not Cloudflare Workers — one account handles both the Claude Haiku proxy (API key as a secret) and conversation logging in Postgres.
- [x] **Layout redesign (2026-07-07)**: original design read as "plain and uninviting." Reworked to a side-by-side photo hero (placeholder avatar for now), card/bento-grid content sections (Now card, Background timeline, Stack pill-grid, Contact card), and subtle CSS-only hover reveals (animated underline on links, lift + image zoom on project cards) — still zero shipped JS.
- [x] **Design system import (2026-07-08)**: adopted the Claude Design handoff bundle ("Bobby Muljono editorial design system") — warm stone + single forest-green accent, Newsreader/Source Sans 3/IBM Plex Mono, hairline-driven editorial layout. Replaced the prior warm-clay/system-font tokens in `global.css`; rebuilt nav, footer, Home and Work to match. Fonts now load from Google Fonts CDN (one deliberate webfont request). Writing + Chat screens deferred to Phase 2. See `DESIGN_NOTES.md`.
- [x] **Scroll-reveal + elevated cards (2026-07-07)**: added a small vanilla-JS `IntersectionObserver` (inlined, no separate `.js` file) that fades in About sections and project cards on scroll — fully progressive enhancement, content is visible immediately with no JS or `prefers-reduced-motion` set. Cards moved from a flat border to a shadow-based elevation (softer radius, resting + hover shadow tokens), inspired by the Supercharged Design agency site the user shared, kept deliberately more restrained than that reference. See `DESIGN_NOTES.md`.
- [x] **Font refresh to match updated bundle (2026-07-08)**: body/UI font Source Sans 3 → **Hanken Grotesk**; eyebrows/tags/badges/footer heads/chat marker moved from mono UPPERCASE → **italic Newsreader** (sentence case, `--font-label` token). IBM Plex Mono is now code/data only. Shipped in PR #1.
- [x] **Redundancy / UX cleanup (2026-07-08)**: (1) **sticky header** — the top bar is now `position: sticky` with a solid stone background + hairline (no blur, per the design system), so the `Get in touch` CTA stays reachable on scroll; (2) **de-duplicated the header** — dropped the `Contact` text link since `Get in touch` already targets `#contact` (nav is now `Work · Get in touch`); (3) **minimal footer** — removed the `Site`/`Elsewhere` columns that duplicated the header nav + contact links; footer is now brand + tagline + `©` on the left and a single `GitHub · LinkedIn` line on the right. Still zero shipped JS. _Note: the hero still has its own `Get in touch` secondary button (standard hero dual-CTA); left as-is, easy to drop later if it reads as redundant with the sticky CTA._

## Phase 2 (not built yet)

- **Blog**: second content collection under `src/content/blog`, frontmatter `{ title, description, date, tags, draft }`.
- **Chatbot**: the Home hero shows a non-functional **"Chat with Bobby AI — In development"** marker (`.chat-soon` in `src/pages/index.astro`) as a standing reminder that this is unbuilt. When it ships, replace that marker with the real entry point and restore the design's "Chat with my AI" nav CTA. Planned build: a single interactive island (vanilla TS Web Component, not a UI framework, to keep shipped JS near zero) calling a Supabase Edge Function (`supabase/functions/chat/index.ts`) that:
  1. Prepends a static persona system prompt server-side.
  2. Calls Claude Haiku with a capped max-token budget.
  3. Inserts a row into a `conversations` table (`id`, `created_at`, `session_id`/IP hash, `question`, `answer`, `input_tokens`, `output_tokens`, `flagged`, `model`) before returning the reply.
  4. Does a naive recent-row-count check per session as a first-pass rate limit.

## Repo setup reminders

- Local: `.obsidian/` and `.claude/` are intentionally kept on disk but gitignored — don't expect them on a fresh clone.
- GitHub: **Settings → Pages → Source** must be set to **GitHub Actions** for `.github/workflows/deploy.yml` to publish.

## Working agreements

- [ ] **Design inspiration**: for future design/layout changes, Bobby will supply reference sites/samples directly. Don't web-search for inspiration and design independently — wait for the samples first.
