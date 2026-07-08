# bobbymuljono.github.io

Personal portfolio site — About/bio and selected project write-ups, built with [Astro](https://astro.build).

> **Hosting is migrating to Vercel.** The site is currently deployed to **both** GitHub Pages
> (via GitHub Actions) and Vercel. The plan is to make **Vercel the canonical home** and attach
> the custom domain there, then retire the GitHub Pages deploy. See [Deployment](#deployment).

Design decisions and their reasoning live in [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Stack

- [Astro](https://astro.build) (TypeScript strict) — static output, ships ~0KB JS
- Content collections for project write-ups (`src/content/projects`)
- No component/animation library — hand-written CSS tokens in `src/styles/global.css`
- Self-hosted webfonts (Newsreader / Hanken Grotesk / IBM Plex Mono) in `src/styles/fonts.css` — no third-party font requests

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build the production site to `./dist/`       |
| `npm run preview`  | Preview the production build locally         |

## Adding a project

Copy `src/content/projects/_template.md` to a new file in the same folder (filename becomes the URL slug), fill in the frontmatter, and set `draft: false` once it's ready to publish.

## Deployment

**Current (GitHub Pages):** pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages at `https://bobbymuljono.github.io`. Repo setting required: **Settings → Pages → Source → GitHub Actions**.

**Planned (Vercel, canonical):** the site is also connected to Vercel, which auto-builds Astro on push and gives per-PR preview deploys plus simpler custom-domain + SSL management. The migration plan:

1. Point the custom domain's DNS at Vercel (Vercel dashboard → Project → Domains walks through the exact records — this differs from the GitHub Pages A-record setup).
2. Update `site` in [`astro.config.mjs`](./astro.config.mjs) from `https://bobbymuljono.github.io` to the final domain — it drives canonical URLs, the sitemap, and absolute OG image URLs.
3. Once Vercel is serving the domain, **retire GitHub Pages** (delete or disable `.github/workflows/deploy.yml`, or set Pages Source back to "None") so there aren't two public copies competing for SEO.

Until step 3, treat `github.io` as the live URL. _TODO: record the Vercel project URL here once confirmed._

## License

Code is licensed under [LICENSE](./LICENSE). Written content and images are not covered by the code license — all rights reserved unless stated otherwise.
