// @ts-check
import { defineConfig } from 'astro/config';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Canonical site is now on Vercel. Update to the custom domain once it's set up.
  site: 'https://bobbymuljono-github-io.vercel.app',
  base: '/',
  // Vercel adapter: static pages stay static; only routes with `prerender = false`
  // (currently just /api/chat) become serverless functions.
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [codeInspectorPlugin({ bundler: 'vite' })],
  },
});