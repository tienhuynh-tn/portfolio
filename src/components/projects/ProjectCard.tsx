import { useState, type MouseEvent } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import webImg from '../../assets/projects/web.svg'
import { getProjectCategoryLabel, type Project } from '../../data/projects'
import TechChips from './TechChips'

type ProjectCardProps = {
  project: Project
  onSelect: (project: Project) => void
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const fallbackImage = webImg
  const [failedProjectImageIds, setFailedProjectImageIds] = useState<string[]>([])
  const imageSrc =
    project.image?.src && !failedProjectImageIds.includes(project.id)
      ? project.image.src
      : fallbackImage
  const previewTech = project.tech.slice(0, 3)
  const categoryLabel = getProjectCategoryLabel(project)

  const actionLinks = [
    { label: 'Live project', href: project.links?.live, Icon: ArrowSquareOut },
  ].filter((link): link is { label: string; href: string; Icon: typeof ArrowSquareOut } => Boolean(link.href))

  const handleActionClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation()
  }

  return (
    <article className="skillsGroup projectCard">
      <div className="skillsGroupInner projectCardInner relative">
        <button
          type="button"
          onClick={() => onSelect(project)}
          aria-label={`Open details for ${project.title}`}
          className="absolute inset-0 z-10 rounded-[calc(var(--radius-lg)-1.5px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
        >
          <span className="sr-only">Open project details</span>
        </button>

        <div className="projectCardMedia relative z-0" aria-hidden="true">
          <img
            src={imageSrc}
            alt={project.image?.alt ?? `${project.title} preview`}
            className="projectCardImage h-44 w-full rounded-2xl object-cover"
            loading="lazy"
            onError={() =>
              setFailedProjectImageIds((current) =>
                current.includes(project.id) ? current : [...current, project.id],
              )
            }
          />
        </div>

        <div className="projectCardBody relative z-0">
          <div className="projectCardMetaRow">
            <span className="projectCardCategory">{categoryLabel}</span>
            <span className="itemDates">{project.timeframe}</span>
          </div>

          <h3 className="itemTitle projectCardTitle">{project.title}</h3>
          <p className="cardDesc projectCardTagline">{project.tagline}</p>

          <TechChips
            tech={previewTech}
            label={`${project.title} technology stack`}
            className="projectCardTech"
          />
        </div>

        {actionLinks.length ? (
          <div className="projectCardActions relative z-20">
            {actionLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                className="projectCardAction"
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                onClick={handleActionClick}
              >
                <Icon size={18} weight="regular" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProjectCard
