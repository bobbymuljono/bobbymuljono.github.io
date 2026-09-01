import './ProjectCard.css';

export interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  kind?: string;
}

export default function ProjectCard({
  slug,
  title,
  description,
  techStack,
  kind,
}: ProjectCardProps) {
  return (
    <a
      href={`/projects/${slug}/`}
      className="card card--interactive project-row"
      data-reveal
    >
      <div className="project-row__body">
        {kind && <span className="eyebrow">{kind}</span>}
        <h3>{title}</h3>
        <p>{description}</p>
        <ul className="tag-list">
          {techStack.map((tech) => (
            <li className="tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
      </div>
      <span className="project-row__cta">Read case study &rarr;</span>
    </a>
  );
}
