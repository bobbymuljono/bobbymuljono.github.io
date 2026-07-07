import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      // Editorial eyebrow shown above the title, e.g. "AI agent · case study".
      kind: z.string().optional(),
      date: z.coerce.date(),
      techStack: z.array(z.string()),
      liveUrl: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      status: z.enum(['live', 'archived', 'wip']).default('live'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
