# Design notes

Concrete decisions this site's design is drawing from, and why — kept here so token/component choices are traceable instead of arbitrary defaults.

## Current system: Bobby Muljono editorial design system (2026-07-08)

The site now runs on the **Claude Design handoff bundle** ("Bobby Muljono Design System"),
imported 2026-07-08. This supersedes the warm-clay/system-font direction described in the
"References" and "Decisions taken" sections below — those are kept for history, but the
tokens, type, and palette they describe are no longer in `global.css`.

**What the design system fixes (non-negotiable — do not substitute):**

- **Palette — one accent only.** Warm stone background `#E9E8E2`, forest-black text
  `#23291F`, muted `#5E655A`, and forest green `#2E5E43` as the single accent (`#234A34`
  for text on tint). Layered stone surfaces (`#F3F1EA` raised, `#DEDCD3` sunk, `#E4EBDF`
  sage wash) give depth. No second accent, no gradients, no glassmorphism.
- **Type.** Newsreader (serif) for display/headings, Hanken Grotesk (warm humanist
  grotesque) for body/UI at a 17px base, IBM Plex Mono for **code & data only**.
  Eyebrows/kickers, tags, and badges are set in **italic Newsreader** at 14px, sentence
  case, no tracking — an editorial byline (`--font-label`), no longer uppercase mono.
  Two font updates landed 2026-07-08 to match the updated design-system handoff bundle:
  Hanken Grotesk replaced Source Sans 3 (`tokens/fonts.css` calls for a characterful
  grotesque over a neutral default sans), and the label/kicker treatment moved from mono
  UPPERCASE to italic-serif (`tokens/typography.css` + the "Labels & kickers" type card).
  **Self-hosted (2026-07-08).** The fonts previously loaded from the Google Fonts CDN via a
  `<link>` in `BaseLayout`; they are now self-hosted from `public/fonts/` (latin + latin-ext
  `woff2` subsets) via `@font-face` in `src/styles/fonts.css`. This closes the one deliberate
  departure from the "no webfont request" rule and restores near-zero-network — no third-party
  request, no CDN privacy/reliability dependency, same fonts. Two above-the-fold latin faces
  (Hanken 400 body, Newsreader 600 hero) are `preload`ed in `BaseLayout` to avoid FOUT.
  Regenerate the files + CSS with `scripts/fetch-fonts.ps1` if the weights/axes change.
- **Layout.** Left-aligned, generous whitespace, 1120px container (`--container`), prose
  capped ~68ch. Structure comes from hairline `1px` borders (`#D6D2C4`), not shadows.
- **Cards.** Raised oat surface + hairline border + restrained 6px radius — deliberately
  NOT bubbly SaaS cards and never a colored-left-border accent card. Interactive cards
  lift 2px with an accent border + soft shadow on hover.
- **Radii.** 3px inputs/tags · 6px buttons/cards · 10px dialogs/chat · pill for tags.
- **Motion.** Quiet and quick (120–320ms, ease-out); fades + small `translateY` lifts.
  No bounces, no infinite decorative loops.
- **No emoji.** Warmth comes from type, color, and copy. Unicode middot (`·`) and arrows
  (`→`) are used lightly for editorial flourish.

**Adaptations / flagged gaps (things the bundle left open):**

- **Deferred screens.** The bundle ships four screens — Home, Work, Writing, Chat.
  **Home + Work** were implemented in the first pass; **Chat** (the AI persona) shipped
  2026-07-10 but as a **dialog island launched from a hero CTA button** ("Chat with Bobby AI"),
  not as its own screen. The nav still wires only real destinations (Work) with a "Get in touch"
  CTA — the bundle's signature "Chat with my AI" *nav* CTA was deliberately not restored (the
  chat launches from the hero instead). **Writing** (blog) remains Phase 2 (see `TODO.md`).
- **Header — sticky + de-duplicated (2026-07-08).** The top bar is `position: sticky; top: 0`
  with a **solid** stone background (`--color-bg`) and the hairline bottom rule — deliberately
  not a translucent/blurred bar, since the system bans glassmorphism. The old `Contact` text
  link was removed: the `Get in touch` primary button already targets `#contact`, so a second
  control to the same anchor was redundant. Nav is now `Work · [Get in touch]`, with the CTA
  pinned and reachable on scroll (the site's whole job is "make it easy to connect").
- **Footer — minimal (2026-07-08).** Dropped the `Site`/`Elsewhere` two-column block, which
  duplicated the header nav (Work/Contact) and the contact section's GitHub/LinkedIn buttons.
  The footer is now just brand + tagline + `©` on the left and a single `GitHub · LinkedIn`
  line on the right — no repeated site nav (a 2-page site doesn't need nav-in-footer).
- **Portrait (2026-07-08).** The hero now carries a real headshot (`public/bobby-headshot.png`)
  in the design's rectangular 320×400 sage-wash slot, replacing the `.avatar-placeholder` ("BM")
  monogram (the class is kept in `global.css` as the documented fallback). The photo fills the
  panel (`object-fit: cover`, `object-position: center top` so the face is never cropped) and
  dissolves gently into the sage at the bottom via a non-destructive CSS `mask-image` linear
  gradient (opaque to 80%, transparent at 100%); the panel's bottom border is dropped so the
  fade reads clean. On mobile the hero stacks via CSS grid areas so the photo lands directly
  after the intro paragraph and before the CTAs (not pushed to the bottom), capped at 320×380
  and centered. Image file is untouched — all treatment is CSS.
- **Experience list (2026-07-08).** The Home page carries an Experience section directly below
  the hero (`.experience` / `.exp-list` in `src/pages/index.astro`, page-scoped styles). It's a
  deliberately **minimalist progression list**, styled after the henrylin.io reference Bobby
  supplied: each entry is the company (serif `h3`) with the year range right-aligned and muted on
  the same line, an italic-serif role kicker (`--font-label`, accent), and a one-line description
  in muted body. Reverse-chronological, whitespace-separated (no hairline dividers — the one place
  on the site that leans on space rather than rules, matching the reference's restraint); on mobile
  the year range drops below the company. Composed from existing tokens only. The bundle didn't ship
  an Experience screen — this follows the supplied reference, per the standing "wait for samples"
  rule. Copy is short one-liners (no résumé metrics), so no confidentiality concern; Education is
  intentionally omitted to keep the list minimal.
- **No logo.** The wordmark is type-set (Newsreader) with a forest-green period accent, per
  the bundle's guidance. Never fabricate a logo.
- **Contact links.** GitHub is real; LinkedIn + public email are still placeholders
  (`href="#"`) — the bundle left these as `#` and no real values were provided.
- **Project copy.** The write-ups started as the bundle's `site-data` sample copy. As of
  2026-07-10 the first is a real rewrite (`data-analyst-ai-agent.md`); the other three remain
  representative placeholders and are now `draft: true`. Run the confidentiality check in
  `TODO.md` before treating any as final. See `TODO.md` for status.
- **Project detail header (2026-07-10).** The `[slug].astro` header leads with the title and a
  muted, formatted `date` beneath it. The `kind` eyebrow and the "Status" meta line were removed
  there (they read as clutter above a title, and the back-link already sat awkwardly beside the
  eyebrow); `kind` still labels the Work listing cards. Only the `Stack` meta line remains under
  the date.
- **In-write-up diagrams (2026-07-10).** Architecture diagrams inside a project write-up are
  built as self-contained inline HTML/CSS, namespaced under `.arch`, and styled entirely from the
  design tokens (hairline borders, one forest-green accent, sage-wash for a highlighted node,
  `--font-*`, `--radius-md`, `--space-*`). No image-generator output (it can't match the palette
  or type), no shadows or gradients, and only gentle glyphs (`·`, `→`, `↓`; no heavy symbols like
  a big X). `data-analyst-ai-agent.md` is the reference; the `portfolio-writeup` skill documents
  the pattern. Prose in write-ups also avoids em-dashes and en-dashes (a standing content rule).

The tokens/components live in `src/styles/global.css` (single file consumed by
`BaseLayout`). Utility classes mirror the bundle's React primitives: `.button`
(`--primary`/`--secondary`/`--ghost`/`--sm`), `.card` (`--interactive`/`--wash`), `.tag`
(`--outline`/`--solid`), `.badge`, `.eyebrow`, `.avatar-placeholder`.

---

## History — original warm-clay direction (pre-2026-07-08)

_Kept for provenance. The tokens described below were replaced by the design system above._

## References

- **[joshwcomeau.com](https://www.joshwcomeau.com)** — personality lives in the *copy and accents* (confident headlines, conversational asides like "pretty friggin' cool"), not in flashy animation. Interactive flourishes are restrained and purposeful, not everywhere.
- **[leerob.com](https://leerob.com)** — top-down narrative structure (identity → role → context → work → contact), typographic-first minimalism, links embedded in prose rather than a heavy nav, and framing work as "favorite writing/work" (selective) rather than an exhaustive portfolio grid.
- **Claude/Anthropic's product tone** — warm-neutral, professional-but-friendly, not corporate-cold and not pastel/feminine. Reference for *feel* only: warm off-white over pure white, warm dark-brown text over pure black, one confident warm accent, generous whitespace. Not a literal copy of Anthropic's brand assets.

## Decisions taken

1. **Information architecture**: About page reads top-down as a narrative (intro → now → background → stack → contact), per leerob — not a dashboard of cards. Projects get their own listing page since this site has more structured project write-ups than leerob's link list, but the projects section is titled "Selected work," not "Portfolio," to keep the same selective framing (3-5 real entries, not an exhaustive grid).
2. **Navigation**: a minimal top nav (wordmark, Work, and a `Get in touch` CTA). As of 2026-07-08 it is **sticky** (pinned on scroll) but still has **no shrink/hide behavior** — it just stays put so the CTA is always reachable. No repeated nav-in-footer-and-body pattern like joshwcomeau's content site (that pattern suits a large content library; unnecessary complexity for this small site — the footer intentionally carries only off-site links now).
3. **Type pairing**: a warm serif/slab stack for display headings (name, page titles, project titles) paired with a clean humanist sans for body copy — borrows joshwcomeau's "confidence in headings" while keeping leerob's readable, typographic-first body text. Both stacks are system-font based (no webfont network request), preserving near-zero-JS/near-zero-network performance.
4. **Color**: warm off-white background (not pure white, not gray), warm dark-brown/charcoal body text (not pure black), one confident warm clay/terracotta accent used sparingly for links and CTAs, a soft warm-neutral border/divider tone. Single light theme for v1; token structure leaves room for a dark variant later without rework.
5. **Hover/interactive treatment**: underline-on-hover for text links; project cards lift, deepen their shadow, and zoom their cover image slightly on hover. Cards rest on a soft ambient shadow (`--shadow-sm`) rather than a flat border alone, for a lightweight "elevated" feel — borrowed from the Supercharged Design reference (2026-07-07) but kept subtle, not the full agency-site treatment (no gradients, no marquees, no lead-gen chrome).
6. **Project framing**: each entry is a real write-up (Problem/Approach/Technical decisions/What I learned), not a card-only grid — matches leerob's "selective, narrative" work presentation over a generic portfolio tile wall.
7. **Scroll reveal (2026-07-07)**: About-page sections and project cards fade/slide in on scroll via a small vanilla-JS `IntersectionObserver` (inlined by Astro, no separate `.js` file). Strictly progressive enhancement — a `.js-reveal` class is only added when JS runs and the visitor hasn't set `prefers-reduced-motion`; otherwise every section is immediately visible. This is the reference pattern for any future interactive island (e.g. the Phase 2 chatbot) — enhance, never gate content on JS.
