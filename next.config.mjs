// @ts-check

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ESM (`.mjs`) has neither `require` nor `__dirname`; reconstruct both for the
// dev-inspector webpack wiring below (require.resolve + an absolute shim path).
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  webpack: (config, { dev, isServer }) => {
    // Dev-only click-to-source (see dev/jsx-dev-runtime.js and
    // components/DevInspector.tsx). React 19 dropped fiber._debugSource, so we
    // route the browser build's JSX dev runtime through a shim that stamps each
    // DOM element's source location as a `data-inspect` attribute. Gated on
    // `dev && !isServer`: never in a production build, and never in the server
    // bundle (RSC uses its own react-server runtime, left untouched).
    // NOTE: this is webpack-only. If `next dev` ever gains `--turbopack`, this
    // block is ignored and the inspector silently stops working.
    if (dev && !isServer) {
      const shim = path.resolve(__dirname, 'dev/jsx-dev-runtime.js');
      // In the App Router client build, Next rewrites `react` to its own vendored
      // copy, so the JSX dev runtime the app actually imports is
      // `next/dist/compiled/react/jsx-dev-runtime` -- NOT `react/jsx-dev-runtime`.
      // Alias that (and the plain specifier, for any lib that uses it) to our
      // shim, and give the shim a non-recursive handle to the real vendored
      // runtime under a private name so a single React identity is preserved.
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/compiled/react/jsx-dev-runtime$': shim,
        'react/jsx-dev-runtime$': shim,
        '@real/jsx-dev-runtime$': require.resolve('next/dist/compiled/react/jsx-dev-runtime'),
      };
    }
    return config;
  },
};

export default nextConfig;
