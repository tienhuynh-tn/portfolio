import { type MouseEvent } from 'react'
import type { Project } from '../../data/projects'

type ProjectCardProps = {
  project: Project
  onSelect: (project: Project) => void
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const links = [
    { label: 'Live', href: project.links.live },
    { label: 'Source', href: project.links.source },
    { label: 'Case Study', href: project.links.caseStudy },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

  const handleActionClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation()
  }

  return (
    <article className="skillsGroup projectCard">
      <div className="skillsGroupInner relative">
        <button
          type="button"
          onClick={() => onSelect(project)}
          aria-label={`Open details for ${project.title}`}
          className="absolute inset-0 z-10 rounded-[calc(var(--radius-lg)-1.5px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
        >
          <span className="sr-only">Open project details</span>
        </button>

        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={`${project.title} preview`}
            className="h-44 w-full rounded-xl object-cover"
            loading="lazy"
          />
        ) : null}

        <h3 className="itemTitle relative z-0">{project.title}</h3>

        <ul className="skillsBadges relative z-0" aria-label={`${project.title} technology stack`}>
          {project.tech.map((tech) => (
            <li key={tech} className="skillBadge">
              <span>{tech}</span>
            </li>
          ))}
        </ul>

        <p className="cardDesc relative z-0">{project.shortDesc}</p>

        {links.length > 0 ? (
          <div className="cardLinks relative z-20">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cardLink"
                target="_blank"
                rel="noreferrer"
                onClick={handleActionClick}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProjectCard
