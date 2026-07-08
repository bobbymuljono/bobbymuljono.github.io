# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Bobby Muljono's personal portfolio site (`bobbymuljono.github.io`) — About/bio and selected project write-ups today, with a blog and an AI persona chatbot planned as Phase 2 (see `TODO.md`).

## Commands

Requires Node >=22.12.0.

- `npm install` — install dependencies
- `npm run dev` — start the dev server at `localhost:4321` (Astro 7 runs this as a detached daemon; `npm run astro -- dev stop` stops it)
- `npm run build` — type-checks content collections and builds the static site to `./dist/`
- `npm run preview` — serve the production build locally
- `npm run astro -- check` — type-check `.astro` files and content collection schemas without a full build

There is no test suite and no separate lint script configured.

## Architecture

This is an Astro (TypeScript strict) static site deployed to GitHub Pages via GitHub Actions. It intentionally ships near-zero JavaScript — there is no UI or animation library, and any future interactive feature (e.g. the planned chatbot) should stay a vanilla JS/Web Component island rather than pulling in a framework. Verify after any change that `dist/` still contains no `.js` files unless one was deliberately added (small inline `<script>` blocks in `.astro` files are fine — Astro inlines anything tiny directly into the HTML rather than emitting a separate file). The scroll-reveal script in `BaseLayout.astro` (an `IntersectionObserver` that toggles a `.js-reveal`/`data-reveal` class pair, see `DESIGN_NOTES.md`) is the reference pattern for this: always progressive enhancement, content fully visible with no JS or `prefers-reduced-motion` set.

**Content collections**: `src/content.config.ts` (repo convention for Astro 5+'s Content Layer API — not the older `src/content/config.ts` path) defines the `projects` collection via a `glob` loader with pattern `**/[^_]*.md`. Files prefixed with `_` (e.g. `src/content/projects/_template.md`) are intentionally excluded by that pattern and serve as copy-paste templates for new entries, not published content. `src/pages/projects/[slug].astro` renders individual entries via `getStaticPaths()` + the `render()` helper from `astro:content`; `src/pages/projects/index.astro` lists non-draft entries sorted by `date`.

**Layout/components**: every page renders through `src/layouts/BaseLayout.astro`, which owns the `<head>` (meta, canonical URL, OG/Twitter tags — `og:image` is only emitted when a page passes an `image` prop) plus the shared `Header`/`Footer`. `ProjectCard.astro` is the only reusable content component. There is no client-side routing or hydration — everything is static HTML.

**Design tokens**: all colors, type scale, and spacing are CSS custom properties in `src/styles/global.css`, imported once by `BaseLayout`. Reusable utility classes (`.button`/`.button--primary`/`.button--secondary`, `.card`, `.pill-list`, `.timeline`, `.avatar-placeholder`, `.wrapper`) live there too and are composed in page-level `<style>` blocks rather than duplicated. The reasoning behind the current palette and layout choices (and the named reference sites they're drawn from) is recorded in `DESIGN_NOTES.md` — read and update it when changing visual design, don't just change tokens in isolation. **Standing rule**: for design/layout changes, wait for the user to supply reference sites/samples rather than sourcing inspiration via web search independently.

**Deployment**: `.github/workflows/deploy.yml` builds with the official `withastro/action` and deploys via `actions/deploy-pages` on every push to `main`. This requires the repo's Settings → Pages → Source to be set to "GitHub Actions" (a one-time manual step not encoded anywhere in the repo).

**Project status**: Home + Work are built out on the imported editorial design system — bio/hero copy, the four project write-ups, contact links, and the real hero headshot (`public/bobby-headshot.png`) are all in place. Remaining gaps are a résumé PDF, optional visual assets (per-project covers, a default OG image), a confidentiality pass on the project copy, and the not-yet-built Phase 2 (a `blog` content collection plus a chatbot backed by a Supabase Edge Function calling Claude Haiku). `TODO.md` is the living checklist and decisions log (framework, license, domain, chatbot backend) — check it for current state before assuming what's done.
