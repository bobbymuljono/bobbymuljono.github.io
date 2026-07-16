// @ts-check
import { defineConfig } from 'astro/config';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Canonical site is the custom domain (live 2026-07-16). Drives canonical URLs,
  // the sitemap, and absolute OG/Twitter image URLs. Apex should 301 to www in Vercel.
  site: 'https://www.bobbymuljono.com',
  base: '/',
  // Vercel adapter: static pages stay static; only routes with `prerender = false`
  // (currently just /api/chat) become serverless functions.
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [codeInspectorPlugin({ bundler: 'vite' })],
  },
});