import { ArrowSquareOut, FileText, GithubLogo, GlobeHemisphereWest, X } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'
import BulletList from './BulletList'
import TechChips from './TechChips'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusableElements.length === 0) {
        event.preventDefault()
        closeButtonRef.current?.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.removeEventListener('keydown', handleKeydown)
      previousActiveElement?.focus()
    }
  }, [onClose])

  const actionLinks = [
    {
      label: 'Live',
      href: project.links?.live,
      Icon: GlobeHemisphereWest,
      kind: 'primary' as const,
    },
    {
      label: 'Source',
      href: project.links?.source,
      Icon: GithubLogo,
      kind: 'secondary' as const,
    },
    {
      label: 'Case Study',
      href: project.links?.caseStudy,
      Icon: FileText,
      kind: 'secondary' as const,
    },
  ].filter(
    (link): link is {
      label: string
      href: string
      Icon: typeof GlobeHemisphereWest
      kind: 'primary' | 'secondary'
    } => Boolean(link.href),
  )

  const modalContent = (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <article
        ref={dialogRef}
        className="modalContainer projectModalContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="projectModalSurface">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="modalClose"
            aria-label="Close project details"
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>

          <div className="modalScroll">
            <div className="modalContent projectModalContent">
              <div className="projectModalMedia rounded-2xl">
                {project.image?.src ? (
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    className="projectModalImage h-56 sm:h-64 md:h-72 rounded-2xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="projectModalImagePlaceholder h-56 sm:h-64 md:h-72 rounded-2xl">
                    <span className="projectCardPlaceholderEyebrow">{project.category}</span>
                    <strong>{project.title}</strong>
                    <span>Preview coming soon</span>
                  </div>
                )}
              </div>

              <div className="px-6 sm:px-7">
                <div className="modalBody projectModalBody">
                  <header className="modalHeader projectModalHeader">
                    <div className="projectCardMetaRow">
                      <span className="projectCardCategory">{project.category}</span>
                      <span className="itemDates">{project.timeframe}</span>
                    </div>

                    <h2
                      id={`project-modal-title-${project.id}`}
                      className="itemTitle projectModalTitle text-2xl font-semibold text-[color:var(--text)] sm:text-3xl"
                    >
                      {project.title}
                    </h2>
                    <p className="projectModalTagline">
                      {project.tagline}
                    </p>

                    <ul
                      className="projectMetaRow"
                      aria-label="Project quick metadata"
                    >
                      <li className="skillBadge projectMetaPill">
                        <span className="projectMetaLabel">Organization</span>
                        <span>{project.org}</span>
                      </li>
                      <li className="skillBadge projectMetaPill">
                        <span className="projectMetaLabel">Role</span>
                        <span>{project.role}</span>
                      </li>
                      <li className="skillBadge projectMetaPill">
                        <span className="projectMetaLabel">Team</span>
                        <span>{project.teamSize}</span>
                      </li>
                    </ul>
                  </header>

                  <section className="modalSection mt-10">
                    <h3 className="itemTitle projectModalSectionTitle">Impact</h3>
                    <BulletList items={project.highlights} className="projectModalList" />
                  </section>

                  {project.responsibilities?.length ? (
                    <section className="modalSection mt-10">
                      <h3 className="itemTitle projectModalSectionTitle">Responsibilities</h3>
                      <BulletList
                        items={project.responsibilities}
                        className="projectModalList"
                      />
                    </section>
                  ) : null}

                  {project.metrics?.length ? (
                    <section className="modalSection mt-10">
                      <h3 className="itemTitle projectModalSectionTitle">Metrics</h3>
                      <BulletList items={project.metrics} className="projectModalList" />
                    </section>
                  ) : null}

                  <section className="modalSection mt-10">
                    <h3 className="itemTitle projectModalSectionTitle">Tech Stack</h3>
                    <TechChips
                      tech={project.tech}
                      label={`${project.title} technology stack`}
                      className="projectModalTech projectModalChips"
                    />
                  </section>

                  {actionLinks.length ? (
                    <section className="modalSection modalActions projectModalActions mt-10">
                      <div className="projectModalActionsRow">
                        {actionLinks.map(({ label, href, Icon, kind }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className={
                              kind === 'primary'
                                ? 'modalAction modalActionPrimary'
                                : 'modalAction modalActionSecondary'
                            }
                            aria-label={`${label} for ${project.title}`}
                          >
                            <Icon size={16} weight="regular" aria-hidden="true" />
                            <span>{label}</span>
                            <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              </div>
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
