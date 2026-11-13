import { useState } from 'react'
import webImg from '../../assets/projects/web.svg'
import { getProjectCategoryLabel, type Project } from '../../data/projects'
import TechChips from './TechChips'
import SmartImage from '../shared/SmartImage'

// Match Tailwind's container widths, the grid's 601/901px column breakpoints,
// and the card's padding/borders. Lazy images use their actual rendered width.
const PROJECT_IMAGE_SIZES = [
  'auto',
  '(min-width: 1536px) calc((1536px - 136px) / 3 - 45px)',
  '(min-width: 1280px) calc((1280px - 136px) / 3 - 2 * clamp(16px, 1.4vw, 20px) - 5px)',
  '(min-width: 1024px) calc((1024px - 2 * clamp(16px, 4vw, 48px) - 40px) / 3 - 2 * clamp(16px, 1.4vw, 20px) - 5px)',
  '(min-width: 901px) calc((768px - 8vw - 40px) / 3 - 37px)',
  '(min-width: 768px) calc((768px - 8vw - 20px) / 2 - 37px)',
  '(min-width: 640px) calc((640px - 8vw - 20px) / 2 - 37px)',
  '(min-width: 601px) calc((100vw - 8vw - 20px) / 2 - 37px)',
  'calc(100vw - 2 * clamp(16px, 4vw, 48px) - 37px)',
].join(', ')

type ProjectCardProps = {
  project: Project
  onSelect: (project: Project) => void
  listingIndex?: number
}

function ProjectCard({ project, onSelect, listingIndex }: ProjectCardProps) {
  const fallbackImage = webImg
  const [failedProjectImageIds, setFailedProjectImageIds] = useState<string[]>([])
  const imageSrc =
    project.image?.src && !failedProjectImageIds.includes(project.id)
      ? project.image.src
      : fallbackImage
  const previewTech = project.tech.slice(0, 3)
  const categoryLabel = getProjectCategoryLabel(project)

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
          <SmartImage
            src={imageSrc}
            alt={project.image?.alt ?? `${project.title} preview`}
            className="projectCardImage h-44 w-full rounded-2xl object-cover"
            loading="lazy"
            priority={listingIndex === 0}
            eagerWhen={listingIndex === 1 ? '(min-width: 601px)' : listingIndex === 2 ? '(min-width: 901px)' : undefined}
            sizes={PROJECT_IMAGE_SIZES}
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

      </div>
    </article>
  )
}

export default ProjectCard
