import type { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/content';
import './projects.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'AI agents, RAG systems, and the analytics and experimentation work underneath them.',
  alternates: { canonical: '/projects/' },
};

export default function ProjectsIndex() {
  const projects = getAllProjects();

  return (
    <>
      <section className="work-intro" data-reveal>
        <span className="eyebrow">Selected work · 2021—2026</span>
        <h1>Things I&apos;ve shipped</h1>
        <p>
          AI agents, RAG systems, and the analytics + experimentation work
          underneath them.
        </p>
      </section>

      {projects.length === 0 ? (
        <p className="empty-state">Selected work is coming soon.</p>
      ) : (
        <div className="work-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.frontmatter.title}
              description={project.frontmatter.description}
              techStack={project.frontmatter.techStack}
              kind={project.frontmatter.kind}
            />
          ))}
        </div>
      )}
    </>
  );
}
