import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

// Project write-ups live as markdown/MDX under content/projects. Ports the Astro
// content-collection setup (src/content.config.ts): same Zod schema, same
// underscore-prefix exclusion (`_template.md` is a copy-paste template, not a
// published entry), same draft filtering + date-desc sort at the call site.

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

export const projectSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  // Editorial eyebrow shown above the title, e.g. "AI agent · case study".
  kind: z.string().optional(),
  date: z.coerce.date(),
  techStack: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['live', 'archived', 'wip']).default('live'),
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export interface Project {
  /** Slug = filename without extension; matches the old Content Layer entry id. */
  slug: string;
  frontmatter: ProjectFrontmatter;
  /** Raw markdown/MDX body (compiled by the [slug] page). */
  body: string;
}

function listProjectFiles(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => !f.startsWith('_')); // exclude _template.md (matches glob `[^_]`)
}

function readProjectFile(fileName: string): Project {
  const slug = fileName.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = projectSchema.parse(data);
  return { slug, frontmatter, body: content };
}

/**
 * Published projects (drafts excluded), newest first. Mirrors the Astro idiom
 * `getCollection('projects', ({ data }) => !data.draft).sort(byDateDesc)`.
 */
export function getAllProjects({ includeDrafts = false } = {}): Project[] {
  return listProjectFiles()
    .map(readProjectFile)
    .filter((p) => includeDrafts || !p.frontmatter.draft)
    .sort(
      (a, b) => b.frontmatter.date.valueOf() - a.frontmatter.date.valueOf(),
    );
}

/** Slugs for `generateStaticParams` — published only, so drafts get no route. */
export function getProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}

/** One project by slug (published or draft). Returns null if not found. */
export function getProjectBySlug(slug: string): Project | null {
  const match = listProjectFiles().find(
    (f) => f.replace(/\.mdx?$/, '') === slug,
  );
  return match ? readProjectFile(match) : null;
}
