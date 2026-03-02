import { ArrowSquareOut, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type CertificationItem } from '../../data/certifications'
import ImageLightbox from '../shared/ImageLightbox'

type CertificationModalProps = {
  certification: CertificationItem
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

function CertificationModal({
  certification,
  onClose,
}: CertificationModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [certBadgeOk, setCertBadgeOk] = useState(Boolean(certification.certBadgeSrc))
  const [certDetailImageOk, setCertDetailImageOk] = useState(Boolean(certification.certDetailImageSrc))
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPreviewOpen) {
          setIsPreviewOpen(false)
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
  }, [isPreviewOpen, onClose])

  useEffect(() => {
    setCertBadgeOk(Boolean(certification.certBadgeSrc))
    setCertDetailImageOk(Boolean(certification.certDetailImageSrc))
    setIsPreviewOpen(false)
  }, [
    certification.certBadgeSrc,
    certification.certDetailImageSrc,
    certification.id,
  ])

  const modalContent = (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <article
        ref={dialogRef}
        className="modalContainer certificationModalContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`certification-modal-title-${certification.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="modalClose"
          aria-label="Close certification details"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>

        <div className="modalScroll">
          <div className="modalContent certificationModalContent">
            <div className="certificationModalShell">
              <div className="certificationModalMediaStack">
                {certification.certBadgeSrc && certBadgeOk ? (
                  <div className="certificationModalBadgeWrap">
                    <div className="certificationModalBadge">
                      <img
                        src={certification.certBadgeSrc}
                        alt={`${certification.name} badge`}
                        className="certificationModalBadgeImage"
                        loading="lazy"
                        onError={() => setCertBadgeOk(false)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="modalBody certificationModalBody">
                <header className="modalHeader certificationModalHeader">
                  <h2
                    id={`certification-modal-title-${certification.id}`}
                    className="itemTitle certificationModalTitle"
                  >
                    {certification.name}
                  </h2>
                  <p className="itemMeta certificationModalIssuer">
                    {certification.issuer} · {`Issued ${certification.issued}`}
                  </p>
                  {certification.summary ? (
                    <p className="cardDesc certificationModalSummary">
                      {certification.summary}
                    </p>
                  ) : null}
                </header>

                <section className="certificationPreviewSection">
                  {certification.certDetailImageSrc && certDetailImageOk ? (
                    <button
                      type="button"
                      className="certificationPreviewButton"
                      onClick={() => setIsPreviewOpen(true)}
                      aria-label={`Zoom certificate preview for ${certification.name}`}
                    >
                      <span className="certificationPreviewFrame">
                        <img
                          src={certification.certDetailImageSrc}
                          alt={`${certification.name} certificate document`}
                          className="certificationPreviewImage"
                          loading="lazy"
                          onError={() => setCertDetailImageOk(false)}
                        />
                      </span>
                    </button>
                  ) : (
                    <p className="certificationPreviewUnavailable">
                      Certificate image unavailable
                    </p>
                  )}
                </section>

                <section className="certificationModalFooter">
                  <a
                    href={certification.url}
                    target="_blank"
                    rel="noreferrer"
                    className="certificationModalInlineAction certificationModalInlineActionPrimary"
                    aria-label={`Open credential for ${certification.name}`}
                  >
                    <span>Open credential</span>
                    <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                  </a>
                </section>
              </div>
            </div>
          </div>
        </div>
      </article>

      {isPreviewOpen && certification.certDetailImageSrc && certDetailImageOk ? (
        <ImageLightbox
          src={certification.certDetailImageSrc}
          alt={`${certification.name} certificate preview`}
          onClose={() => setIsPreviewOpen(false)}
        />
      ) : null}
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modalContent, document.body)
}

export default CertificationModal
