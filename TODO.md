# TODO

Working notes and handover checklist for this repo. See [DESIGN_NOTES.md](./DESIGN_NOTES.md) for design reasoning and [README.md](./README.md) for stack/commands.

## Content checklist (blocking a real launch)

- [ ] **Bio content** (`src/pages/index.astro`): full name + current title, one concrete sentence on what you do and for whom, a 2-3 sentence "now" blurb, 3-4 past roles each with one concrete impact line, a plain grouped skills list (languages / frameworks / infra / tools).
- [ ] **Contact details**: real email and LinkedIn URL (`src/pages/index.astro` and `src/components/Footer.astro` both have `TODO@replace-me.com` / `TODO-your-handle` placeholders — search for `TODO` to find every spot).
- [ ] **Résumé PDF**: coming later; wire up the link once the file exists.
- [ ] **3-5 real projects** (`src/content/projects/`): copy `_template.md` per project. Each needs title, ≤160-char description, tech stack, a working `liveUrl` and/or `repoUrl`, and real Problem/Approach/Technical decisions/What I learned prose. Set `draft: false` when ready to publish.
- [ ] **Headshot photo**: the hero on `src/pages/index.astro` uses an `.avatar-placeholder` circle (initials "BM") until you supply a real photo. Once you have one, add it under `public/` and swap the placeholder `<div>` for an `<img>` (marked with a `TODO` comment at the swap site).
- [ ] **Optional visual assets**: per-project cover screenshots, a real default OG share image (`public/og-default.png` doesn't exist yet — the `image` prop on `BaseLayout` is optional and currently unused).
- [ ] **Confidentiality check**: for any project built as part of your day job, only describe what's already public/non-confidential.

## Decisions log

- [x] **Framework**: Astro (TypeScript strict) — ships ~0KB JS, static output for GitHub Pages.
- [x] **License**: MIT (switched from GPL-3.0, 2026-07-07) — copyleft was a poor fit for a portfolio.
- [ ] **Domain**: shipping on `bobbymuljono.github.io` for now. Namecheap custom domain cutover is independent and can happen anytime: A records (185.199.108/109/110/111.153) + `www` CNAME + `public/CNAME` file + update `site` in `astro.config.mjs`.
- [x] **Chatbot backend (Phase 2)**: Supabase Edge Function, not Cloudflare Workers — one account handles both the Claude Haiku proxy (API key as a secret) and conversation logging in Postgres.
- [x] **Layout redesign (2026-07-07)**: original design read as "plain and uninviting." Reworked to a side-by-side photo hero (placeholder avatar for now), card/bento-grid content sections (Now card, Background timeline, Stack pill-grid, Contact card), and subtle CSS-only hover reveals (animated underline on links, lift + image zoom on project cards) — still zero shipped JS.

## Phase 2 (not built yet)

- **Blog**: second content collection under `src/content/blog`, frontmatter `{ title, description, date, tags, draft }`.
- **Chatbot**: a single interactive island (vanilla TS Web Component, not a UI framework, to keep shipped JS near zero) calling a Supabase Edge Function (`supabase/functions/chat/index.ts`) that:
  1. Prepends a static persona system prompt server-side.
  2. Calls Claude Haiku with a capped max-token budget.
  3. Inserts a row into a `conversations` table (`id`, `created_at`, `session_id`/IP hash, `question`, `answer`, `input_tokens`, `output_tokens`, `flagged`, `model`) before returning the reply.
  4. Does a naive recent-row-count check per session as a first-pass rate limit.

## Repo setup reminders

- Local: `.obsidian/` and `.claude/` are intentionally kept on disk but gitignored — don't expect them on a fresh clone.
- GitHub: **Settings → Pages → Source** must be set to **GitHub Actions** for `.github/workflows/deploy.yml` to publish.

## Working agreements

- [ ] **Design inspiration**: for future design/layout changes, Bobby will supply reference sites/samples directly. Don't web-search for inspiration and design independently — wait for the samples first.
