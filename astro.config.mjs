// @ts-check
import { defineConfig } from 'astro/config';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bobbymuljono.github.io',
  base: '/',
  integrations: [sitemap()],
  vite: {
    plugins: [codeInspectorPlugin({ bundler: 'vite' })],
  },
});