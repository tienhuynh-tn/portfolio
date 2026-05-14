import { ArrowSquareOut, X } from '@phosphor-icons/react'
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

function renderMetaLine(items: string[], secondary = false) {
  const visibleItems = items.filter(Boolean)

  if (!visibleItems.length) return null

  return (
    <p className={secondary ? 'detailModalMetaLine detailModalMetaLineSecondary' : 'detailModalMetaLine'}>
      {visibleItems.map((item, index) => (
        <span key={`${secondary ? 'secondary' : 'primary'}-${item}-${index}`} className="detailModalMetaFragment">
          {index > 0 ? <span className="detailModalMetaSeparator" aria-hidden="true">•</span> : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  )
}

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
      kind: 'primary' as const,
    },
    {
      label: 'Source',
      href: project.links?.source,
      kind: 'secondary' as const,
    },
    {
      label: 'Case Study',
      href: project.links?.caseStudy,
      kind: 'secondary' as const,
    },
  ].filter(
    (link): link is {
      label: string
      href: string
      kind: 'primary' | 'secondary'
    } => Boolean(link.href),
  )
  const primaryMetaLine = renderMetaLine([project.role, project.category, project.teamSize])
  const secondaryMetaLine = renderMetaLine([project.timeframe], true)

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
                    <div className="detailModalHeaderTop">
                      <div className="detailModalHeaderCopy">
                        <p className="detailModalEyebrow">{project.org}</p>

                        <h2
                          id={`project-modal-title-${project.id}`}
                          className="itemTitle projectModalTitle text-2xl font-semibold text-[color:var(--text)] sm:text-3xl"
                        >
                          {project.title}
                        </h2>

                        <div className="detailModalMetaStack">
                          {primaryMetaLine}
                          {secondaryMetaLine}
                        </div>

                        <div className="detailModalIntroSection">
                          <p className="projectModalTagline detailModalLead">
                            {project.tagline}
                          </p>

                          {actionLinks.length ? (
                            <div className="detailModalHeaderActions">
                              {actionLinks.map(({ label, href, kind }) => (
                                <a
                                  key={label}
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={kind === 'primary' ? 'detailModalInlineAction detailModalInlineActionPrimary' : 'detailModalInlineAction'}
                                  aria-label={`${label} for ${project.title}`}
                                >
                                  <span>{label}</span>
                                  <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </header>

                  <section className="modalSection mt-10">
                    <h3 className="itemTitle detailModalSectionTitle">Impact</h3>
                    <BulletList items={project.highlights} className="projectModalList" />
                  </section>

                  {project.responsibilities?.length ? (
                    <section className="modalSection mt-10">
                      <h3 className="itemTitle detailModalSectionTitle">Responsibilities</h3>
                      <BulletList
                        items={project.responsibilities}
                        className="projectModalList"
                      />
                    </section>
                  ) : null}

                  {project.metrics?.length ? (
                    <section className="modalSection mt-10">
                      <h3 className="itemTitle detailModalSectionTitle">Metrics</h3>
                      <BulletList items={project.metrics} className="projectModalList" />
                    </section>
                  ) : null}

                  <section className="modalSection mt-10">
                    <h3 className="itemTitle detailModalSectionTitle">Tech Stack</h3>
                    <TechChips
                      tech={project.tech}
                      label={`${project.title} technology stack`}
                      className="projectModalTech projectModalChips"
                    />
                  </section>
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
