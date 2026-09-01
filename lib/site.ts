/**
 * Canonical site origin. Drives `metadataBase`, canonical URLs, absolute OG/Twitter
 * image URLs, and the sitemap. Custom domain, `www` canonical (live 2026-07-16).
 * Mirrors the old Astro `site:` value in astro.config.mjs.
 */
export const SITE_URL = 'https://www.bobbymuljono.com';

/** Default social share image (1200×630, on-brand). Pages can override. */
export const DEFAULT_OG_IMAGE = '/og-default.png';
