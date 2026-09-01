// @ts-check

/**
 * Next.js config for the personal site (migrated from Astro).
 *
 * `trailingSlash: true` preserves the URL shape Astro emitted (`/projects/`,
 * `/projects/<slug>/`) so existing links, the sitemap, and SEO stay intact.
 *
 * MDX write-ups are compiled at request/build time via `next-mdx-remote/rsc`
 * (loaded by slug, not co-located as pages), so no MDX webpack loader is needed here.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: {
    // The chat + content routes read markdown/knowledge files at runtime; make
    // sure they're traced into the serverless bundle.
    '/api/chat': ['./knowledge/**', './content/**'],
    '/projects/[slug]': ['./content/**'],
  },
};

export default nextConfig;
