import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getProjectBySlug, getProjectSlugs } from '@/lib/content';
import { archComponents } from '@/components/arch';
import CopilotChatDemo from '@/components/demos/CopilotChatDemo';
import '@/styles/arch.css';
import './detail.css';

// Components made available to every write-up's MDX body. The demo is only used by
// the copilot write-up; other entries simply never reference it.
const mdxComponents = { ...archComponents, CopilotChatDemo };

type Params = { slug: string };

// Published slugs only (drafts get no route) — ports the Astro getStaticPaths filter.
export function generateStaticParams(): Params[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.frontmatter.title, // → "<title> — Bobby Muljono" via the root template
    description: project.frontmatter.description,
    alternates: { canonical: `/projects/${slug}/` },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.frontmatter.draft) notFound();

  const { title, techStack, liveUrl, repoUrl, date } = project.frontmatter;
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="detail">
      <a href="/projects/" className="back-link">
        ← Work
      </a>
      <h1>{title}</h1>
      <p className="detail__date">{formattedDate}</p>

      <ul className="meta">
        <li>
          <span className="meta__label">Stack</span> {techStack.join(', ')}
        </li>
      </ul>

      <p className="links">
        {liveUrl && <a href={liveUrl}>Live site →</a>}
        {repoUrl && <a href={repoUrl}>Source →</a>}
      </p>

      <div className="prose">
        <MDXRemote source={project.body} components={mdxComponents} />
      </div>
    </div>
  );
}
