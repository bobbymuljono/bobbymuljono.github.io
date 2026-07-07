# Design notes

Concrete decisions this site's design is drawing from, and why — kept here so token/component choices are traceable instead of arbitrary defaults.

## References

- **[joshwcomeau.com](https://www.joshwcomeau.com)** — personality lives in the *copy and accents* (confident headlines, conversational asides like "pretty friggin' cool"), not in flashy animation. Interactive flourishes are restrained and purposeful, not everywhere.
- **[leerob.com](https://leerob.com)** — top-down narrative structure (identity → role → context → work → contact), typographic-first minimalism, links embedded in prose rather than a heavy nav, and framing work as "favorite writing/work" (selective) rather than an exhaustive portfolio grid.
- **Claude/Anthropic's product tone** — warm-neutral, professional-but-friendly, not corporate-cold and not pastel/feminine. Reference for *feel* only: warm off-white over pure white, warm dark-brown text over pure black, one confident warm accent, generous whitespace. Not a literal copy of Anthropic's brand assets.

## Decisions taken

1. **Information architecture**: About page reads top-down as a narrative (intro → now → background → stack → contact), per leerob — not a dashboard of cards. Projects get their own listing page since this site has more structured project write-ups than leerob's link list, but the projects section is titled "Selected work," not "Portfolio," to keep the same selective framing (3-5 real entries, not an exhaustive grid).
2. **Navigation**: a minimal static top nav (Home, Selected work, Contact) — no scroll-hide/shrink behavior, no repeated nav-in-footer-and-body pattern like joshwcomeau's content site (that pattern suits a large content library; unnecessary complexity for a 3-page site).
3. **Type pairing**: a warm serif/slab stack for display headings (name, page titles, project titles) paired with a clean humanist sans for body copy — borrows joshwcomeau's "confidence in headings" while keeping leerob's readable, typographic-first body text. Both stacks are system-font based (no webfont network request), preserving near-zero-JS/near-zero-network performance.
4. **Color**: warm off-white background (not pure white, not gray), warm dark-brown/charcoal body text (not pure black), one confident warm clay/terracotta accent used sparingly for links and CTAs, a soft warm-neutral border/divider tone. Single light theme for v1; token structure leaves room for a dark variant later without rework.
5. **Hover/interactive treatment**: restrained — underline-on-hover for text links, a gentle border-color/lift shift on project cards. No scale transforms, no shadow-heavy "card pop" effects.
6. **Project framing**: each entry is a real write-up (Problem/Approach/Technical decisions/What I learned), not a card-only grid — matches leerob's "selective, narrative" work presentation over a generic portfolio tile wall.
