import { ArrowSquareOut, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ActivityItem } from '../../data/activities'
import BulletList from '../projects/BulletList'
import ImageLightbox from '../shared/ImageLightbox'

type ActivityModalProps = {
  activity: ActivityItem
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

const WORK_MODE_TOKENS = new Map([
  ['remote', 'Remote'],
  ['hybrid', 'Hybrid'],
  ['on-site', 'On-site'],
  ['onsite', 'On-site'],
])
const URL_PATTERN = /https?:\/\/[^\s)]+/g

function splitActivityLocation(location?: string) {
  if (!location?.trim()) {
    return {
      place: '',
      workMode: '',
    }
  }

  const parts = location
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean)

  const workModeIndex = parts.findIndex((part) => WORK_MODE_TOKENS.has(part.toLowerCase()))

  if (workModeIndex === -1) {
    return {
      place: location,
      workMode: '',
    }
  }

  return {
    place: parts.filter((_, index) => index !== workModeIndex).join(' · '),
    workMode: WORK_MODE_TOKENS.get(parts[workModeIndex].toLowerCase()) ?? parts[workModeIndex],
  }
}

function splitActivityDate(date: string) {
  const [dateRange = '', duration = ''] = date
    .split('·')
    .map((part) => part.trim())

  return { dateRange, duration }
}

function parseDescriptionBlock(block: string) {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseBulletLines(lines: string[]) {
  return lines
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
}

function extractUrls(text: string) {
  return text.match(URL_PATTERN) ?? []
}

function removeUrls(text: string) {
  return text.replace(URL_PATTERN, '').replace(/\s{2,}/g, ' ').trim()
}

function capitalizeFirst(text: string) {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function normalizeSentenceForComparison(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getWordSet(text: string) {
  return new Set(
    normalizeSentenceForComparison(text)
      .split(' ')
      .filter((word) => word.length > 2),
  )
}

function isSentenceTooSimilar(candidate: string, existing: string[]) {
  const candidateWords = getWordSet(candidate)
  if (!candidateWords.size) return true

  return existing.some((sentence) => {
    const existingWords = getWordSet(sentence)
    if (!existingWords.size) return false

    let overlapCount = 0
    candidateWords.forEach((word) => {
      if (existingWords.has(word)) overlapCount += 1
    })

    const overlapRatio = overlapCount / Math.min(candidateWords.size, existingWords.size)
    return overlapRatio >= 0.65
  })
}

function splitIntoSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function normalizeIntroText(text: string) {
  let normalized = text.trim()
  const colonIndex = normalized.indexOf(': ')

  if (colonIndex > 0 && colonIndex < 72) {
    normalized = normalized.slice(colonIndex + 2)
  }

  normalized = normalized.replace(/Google for Developers Profile:\s*/i, '')
  normalized = removeUrls(normalized)
  normalized = normalized.replace(/\s+\./g, '.').trim()

  return normalized
}

function refineSummaryContinuation(summary: string, introText: string) {
  let refined = introText

  if (
    summary &&
    /^(Driving|Leading|Organizing|Supporting)\b/i.test(refined) &&
    refined.includes(',')
  ) {
    refined = refined.slice(refined.indexOf(',') + 1).trim()
  }

  return capitalizeFirst(refined)
}

function mergeSummary(summary: string, introText: string) {
  const parts = [summary.trim()].filter(Boolean)

  if (introText) {
    const continuation = refineSummaryContinuation(summary, introText)
    splitIntoSentences(continuation).forEach((sentence) => {
      if (!isSentenceTooSimilar(sentence, parts)) {
        parts.push(sentence)
      }
    })
  }

  return parts
    .filter(Boolean)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .join(' ')
}

function cleanHighlightText(item: string) {
  return removeUrls(item.replace(/\(\s*https?:\/\/[^)]+\)/g, '')).replace(/\s+\)$/g, ')')
}

function deriveActivityTags(activity: ActivityItem, introText: string, cleanHighlights: string[]) {
  const tags = new Set<string>(activity.tags)
  const source = [activity.org, activity.summary, introText, cleanHighlights.join(' ')]
    .join(' ')
    .toLowerCase()

  if (source.includes('google cloud')) {
    tags.add('Google Cloud')
  }

  if (/\b(event|meetup|workshop|devfest|summit|hackathon)\b/.test(source)) {
    tags.add('Event')
  }

  return Array.from(tags)
}

function parseActivityDescription(description: string) {
  const blocks = description
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  const intro: string[] = []
  let rolesProgression: string[] = []
  let responsibilities: string[] = []
  let highlights: string[] = []

  blocks.forEach((block) => {
    const lines = parseDescriptionBlock(block)
    const [headingLine = ''] = lines
    const normalizedHeading = headingLine.replace(/:$/, '').toLowerCase()

    if (normalizedHeading === 'roles & progression' || normalizedHeading === 'milestones') {
      rolesProgression = parseBulletLines(lines.slice(1))
      return
    }

    if (normalizedHeading === 'responsibilities') {
      responsibilities = parseBulletLines(lines.slice(1))
      return
    }

    if (normalizedHeading === 'highlights') {
      highlights = parseBulletLines(lines.slice(1))
      return
    }

    intro.push(block)
  })

  return { intro, rolesProgression, responsibilities, highlights }
}

function renderMetaLine(items: string[], secondary = false) {
  const visibleItems = items.filter(Boolean)

  if (!visibleItems.length) return null

  return (
    <p
      className={
        secondary
          ? 'detailModalMetaLine detailModalMetaLineSecondary'
          : 'detailModalMetaLine'
      }
    >
      {visibleItems.map((item, index) => (
        <span
          key={`${secondary ? 'secondary' : 'primary'}-${item}-${index}`}
          className="detailModalMetaFragment"
        >
          {index > 0 ? (
            <span className="detailModalMetaSeparator" aria-hidden="true">
              •
            </span>
          ) : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  )
}

function ActivityModal({ activity, onClose }: ActivityModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const images = useMemo(
    () => {
      const galleryImages =
        activity.images.length > 0
          ? activity.images
          : activity.image?.trim().length
            ? [activity.image]
            : []

      return galleryImages.filter(
        (image) => image.trim().length > 0 && !failedImages.includes(image),
      )
    },
    [activity.image, activity.images, failedImages],
  )
  const primaryLink = activity.links?.[0]
  const { place } = splitActivityLocation(activity.location)
  const { dateRange } = splitActivityDate(activity.date)
  const { intro, rolesProgression, responsibilities, highlights } = parseActivityDescription(
    activity.description,
  )
  const effectiveLightboxImage =
    lightboxImage && images.includes(lightboxImage) ? lightboxImage : null
  const introUrls = extractUrls(intro[0] ?? '')
  const cleanIntroText = normalizeIntroText(intro[0] ?? '')
  const mergedSummary = mergeSummary(activity.summary, cleanIntroText)
  const cleanHighlights = highlights.map(cleanHighlightText)
  const summaryProfileLink = introUrls[0] ?? ''
  const primaryMetaLine = renderMetaLine([place, dateRange], true)
  const modalTags = deriveActivityTags(activity, cleanIntroText, cleanHighlights)
  const hasBodySections =
    rolesProgression.length > 0 ||
    responsibilities.length > 0 ||
    cleanHighlights.length > 0

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (effectiveLightboxImage) {
          setLightboxImage(null)
          return
        }

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
  }, [effectiveLightboxImage, onClose])

  useEffect(() => {
    setFailedImages([])
    setLightboxImage(null)
  }, [activity.id])

  useEffect(() => {
    if (lightboxImage && !images.includes(lightboxImage)) {
      setLightboxImage(images[0] ?? null)
    }
  }, [images, lightboxImage])

  const modalContent = (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <article
        ref={dialogRef}
        className="modalContainer activityModalContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`activity-modal-title-${activity.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="modalClose"
          aria-label="Close activity details"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>

        <div className="modalScroll">
          <div className="modalContent activityModalContent">
            <div className="modalBody activityModalBody">
              <header className="modalHeader activityModalHeader">
                <div className="detailModalHeaderTop">
                  <div className="detailModalHeaderCopy">
                    <p className="detailModalEyebrow">{activity.org}</p>
                    <h2
                      id={`activity-modal-title-${activity.id}`}
                      className="itemTitle activityModalTitle"
                    >
                      {activity.title}
                    </h2>

                    {primaryMetaLine ? (
                      <div className="detailModalMetaStack">{primaryMetaLine}</div>
                    ) : null}

                    {modalTags.length ? (
                      <ul
                        className="skillsBadges detailModalTags"
                        aria-label={`${activity.title} tags`}
                      >
                        {modalTags.map((tag) => (
                          <li key={tag} className="skillBadge">
                            <span>{tag}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="detailModalIntroSection">
                      <p className="detailModalLead activityModalLead">
                        {mergedSummary}
                        {summaryProfileLink ? (
                          <>
                            {' '}
                            <a
                              href={summaryProfileLink}
                              target="_blank"
                              rel="noreferrer"
                              className="detailModalInlineLink"
                            >
                              Google for Developers profile
                            </a>
                            .
                          </>
                        ) : null}
                      </p>

                      {primaryLink ? (
                        <div className="detailModalHeaderActions">
                          <a
                            href={primaryLink.url}
                            target="_blank"
                            rel="noreferrer"
                            className="detailModalInlineAction"
                            aria-label={`Open link for ${activity.title}`}
                          >
                            <span>Open link</span>
                            <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </header>

              {hasBodySections ? (
                <section className="activityModalSection activityModalTextSection">
                  <div className="activityModalDescription">
                    {rolesProgression.length ? (
                      <div className="activityModalContentGroup activityModalContentGroupFirst">
                        <h3 className="itemTitle detailModalSectionTitle">
                          Roles & Progression
                        </h3>
                        <BulletList items={rolesProgression} className="projectModalList" />
                      </div>
                    ) : null}

                    {responsibilities.length ? (
                      <div
                        className={
                          rolesProgression.length
                            ? 'activityModalContentGroup'
                            : 'activityModalContentGroup activityModalContentGroupFirst'
                        }
                      >
                        <h3 className="itemTitle detailModalSectionTitle">
                          Responsibilities
                        </h3>
                        <BulletList items={responsibilities} className="projectModalList" />
                      </div>
                    ) : null}

                    {cleanHighlights.length ? (
                      <div className="activityModalContentGroup">
                        <h3 className="itemTitle detailModalSectionTitle">Highlights</h3>
                        <BulletList items={cleanHighlights} className="projectModalList" />
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              <section className="activityModalSection detailModalSectionDivider">
                <div className="activityModalGalleryHeader">
                  <h3 className="itemTitle detailModalSectionTitle">Gallery</h3>
                </div>

                {images.length ? (
                  <div className="activityModalGallery" aria-label={`${activity.title} gallery`}>
                    {images.map((image, index) => (
                      <button
                        key={`${activity.id}-${image}-${index}`}
                        type="button"
                        className="activityModalGalleryItem"
                        onClick={() => setLightboxImage(image)}
                        aria-label={`Open gallery image ${index + 1} for ${activity.title}`}
                      >
                        <img
                          src={image}
                          alt={`${activity.title} gallery image ${index + 1}`}
                          className="activityModalGalleryImage"
                          loading="lazy"
                          onError={() =>
                            setFailedImages((current) =>
                              current.includes(image) ? current : [...current, image],
                            )
                          }
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className="activityModalGalleryPlaceholder"
                    role="img"
                    aria-label="No activity images available"
                  >
                    <span>Gallery unavailable</span>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </article>

      {effectiveLightboxImage ? (
        <ImageLightbox
          src={effectiveLightboxImage}
          alt={`${activity.title} enlarged gallery image`}
          onClose={() => setLightboxImage(null)}
        />
      ) : null}
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modalContent, document.body)
}

export default ActivityModal
