import { ArrowSquareOut, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ActivityItem } from '../../data/activities'
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

function ActivityModal({ activity, onClose }: ActivityModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const images = useMemo(
    () =>
      activity.images.filter(
        (image) => image.trim().length > 0 && !failedImages.includes(image),
      ),
    [activity.images, failedImages],
  )
  const primaryLink = activity.links?.[0]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (lightboxImage) {
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
  }, [lightboxImage, onClose])

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
                <h2
                  id={`activity-modal-title-${activity.id}`}
                  className="itemTitle activityModalTitle"
                >
                  {activity.title}
                </h2>
                <p className="itemMeta activityModalMeta">
                  {[activity.org, activity.role, activity.location].filter(Boolean).join(' · ')}
                </p>
                <p className="itemDates activityModalDates">{activity.date}</p>
              </header>

              <section className="activityModalSection">
                <div className="activityModalDescription">{activity.description}</div>
              </section>

              <section className="activityModalSection">
                <div className="activityModalGalleryHeader">
                  <h3 className="itemTitle">Gallery</h3>
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

              <section className="activityModalFooter">
                <ul className="skillsBadges activityModalTags" aria-label={`${activity.title} tags`}>
                  {activity.tags.map((tag) => (
                    <li key={tag} className="skillBadge">
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>

                {primaryLink ? (
                  <a
                    href={primaryLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="activityModalPrimaryLink"
                    aria-label={`Open link for ${activity.title}`}
                  >
                    <span>Open link ↗</span>
                    <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                  </a>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </article>

      {lightboxImage ? (
        <ImageLightbox
          src={lightboxImage}
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
