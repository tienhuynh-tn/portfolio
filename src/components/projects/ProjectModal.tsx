import { X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [onClose])

  const links = [
    { label: 'Live Demo', href: project.links.live, kind: 'primary' as const },
    { label: 'GitHub', href: project.links.source, kind: 'secondary' as const },
  ].filter((link): link is { label: string; href: string; kind: 'primary' | 'secondary' } =>
    Boolean(link.href),
  )

  const projectContext = project.context ?? 'Personal Project · Case Study'
  const overview = project.longDesc[0] ?? project.shortDesc
  const responsibilities = project.highlights
  const impacts =
    project.outcomes?.length
      ? project.outcomes
      : ['Improved reliability, delivery confidence, and day-to-day operability.']
  const projectMeta = [
    { label: 'Role', value: 'Backend Developer' },
    { label: 'Team', value: '1 (Solo)' },
    { label: 'Duration', value: '8-12 weeks' },
    { label: 'Architecture', value: 'Layered service design' },
  ]

  const modalContent = (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <article
        className="modalContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.slug}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="modalClose"
          aria-label="Close project details"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>

        <div className="modalScroll">
          <div className="modalContent">
            <div className="modalMedia">
              <img src={project.coverImage} alt={`${project.title} cover`} loading="lazy" />
            </div>

            <div className="modalBody">
              <header className="modalHeader">
                <h2
                  id={`project-modal-title-${project.slug}`}
                  className="itemTitle pr-10 text-2xl sm:text-3xl"
                >
                  {project.title}
                </h2>
                <p className="cardDesc">{project.shortDesc}</p>
                <p className="modalContext">{projectContext}</p>
                <ul className="projectMetaRow" aria-label="Project quick metadata">
                  {projectMeta.map((item) => (
                    <li key={item.label} className="skillBadge projectMetaPill">
                      <span className="projectMetaLabel">{item.label}</span>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </header>

              {links.length ? (
                <section className="modalSection modalActions">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={
                        link.kind === 'primary'
                          ? 'modalAction modalActionPrimary'
                          : 'modalAction modalActionSecondary'
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </section>
              ) : null}

              <hr className="modalDivider" />

              <section className="modalSection">
                <h3 className="itemTitle">Overview</h3>
                <p className="cardDesc">{overview}</p>
              </section>

              <section className="modalSection">
                <h3 className="itemTitle">Responsibilities</h3>
                <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-strong)]">
                  {responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="modalSection">
                <h3 className="itemTitle">Impact</h3>
                <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-strong)]">
                  {impacts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="modalSection">
                <h3 className="itemTitle">Tech Stack</h3>
                <ul className="skillsBadges" aria-label={`${project.title} technology stack`}>
                  {project.tech.map((tech) => (
                    <li key={tech} className="skillBadge">
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modalContent, document.body)
}

export default ProjectModal
