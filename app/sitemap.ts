import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllProjects } from '@/lib/content';

// Native Next sitemap (replaces the Astro @astrojs/sitemap integration). URLs
// carry trailing slashes to match the site's `trailingSlash: true` canonical form.
// Served at /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => new URL(path, SITE_URL).toString();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: abs('/'), changeFrequency: 'monthly', priority: 1 },
    { url: abs('/projects/'), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: abs(`/projects/${p.slug}/`),
    lastModified: p.frontmatter.date,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}
