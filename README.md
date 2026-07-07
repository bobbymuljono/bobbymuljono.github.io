# bobbymuljono.github.io

Personal portfolio site — About/bio and selected project write-ups, built with [Astro](https://astro.build). Deploys to GitHub Pages via GitHub Actions on every push to `main`.

Design decisions and their reasoning live in [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Stack

- [Astro](https://astro.build) (TypeScript strict) — static output, ships ~0KB JS
- Content collections for project write-ups (`src/content/projects`)
- No component/animation library — hand-written CSS tokens in `src/styles/global.css`

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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. Repo setting required: **Settings → Pages → Source → GitHub Actions**.

## License

Code is licensed under [LICENSE](./LICENSE). Written content and images are not covered by the code license — all rights reserved unless stated otherwise.
