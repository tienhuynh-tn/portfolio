import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { ActivityItem } from '../../data/activities'

type ActivityCardProps = {
  activity: ActivityItem
  onSelect: (activity: ActivityItem) => void
}

const AUTOPLAY_DELAY_MS = 4200
const WORK_MODE_TOKENS = new Set(['remote', 'hybrid', 'on-site', 'onsite'])

function getPreviewLocation(location?: string) {
  if (!location?.trim()) return ''

  return location
    .split('·')
    .map((part) => part.trim())
    .filter((part) => part && !WORK_MODE_TOKENS.has(part.toLowerCase()))
    .join(' · ')
}

function getPreviewDate(date: string) {
  return date
    .split('·')
    .map((part) => part.trim())[0] ?? ''
}

function ActivityCard({ activity, onSelect }: ActivityCardProps) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const images = useMemo(
    () => {
      const previewImages =
        activity.image?.trim().length
          ? [activity.image]
          : activity.images.slice(0, 1)

      return previewImages.filter(
        (image) => image.trim().length > 0 && !failedImages.includes(image),
      )
    },
    [activity.image, activity.images, failedImages],
  )
  const hasMultipleImages = images.length > 1
  const previewLocation = getPreviewLocation(activity.location)
  const previewDate = getPreviewDate(activity.date)
  const supportingDetails = [previewLocation, previewDate].filter(Boolean).join(' • ')

  useEffect(() => {
    setFailedImages([])
    setCurrentIndex(0)
  }, [activity.id])

  useEffect(() => {
    if (currentIndex < images.length) return
    setCurrentIndex(0)
  }, [currentIndex, images.length])

  useEffect(() => {
    const node = cardRef.current
    if (!node || !hasMultipleImages) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false)
      },
      {
        root: null,
        threshold: 0.35,
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [hasMultipleImages])

  useEffect(() => {
    if (!hasMultipleImages || !isInView || isHovered || isFocused) return

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length)
    }, AUTOPLAY_DELAY_MS)

    return () => window.clearInterval(intervalId)
  }, [hasMultipleImages, images.length, isFocused, isHovered, isInView])

  const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(activity)
    }
  }

  const handleImageError = (image: string) => {
    setFailedImages((current) => (current.includes(image) ? current : [...current, image]))
  }

  const showPreviousImage = () => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length)
  }

  const showNextImage = () => {
    setCurrentIndex((index) => (index + 1) % images.length)
  }

  return (
    <article
      ref={cardRef}
      className="certificationCardInner activityCardInner activityCardButton"
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${activity.title}`}
      onClick={() => onSelect(activity)}
      onKeyDown={handleCardKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        setIsFocused(false)
      }}
    >
      <div className="activityCardMedia">
        {images.length ? (
          <div
            className="activityCardMediaTrack"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={`${activity.id}-${image}-${index}`} className="activityCardMediaSlide">
                <img
                  src={image}
                  alt={`${activity.title} preview ${index + 1}`}
                  className="activityCardImage"
                  loading="lazy"
                  onError={() => handleImageError(image)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="activityCardImagePlaceholder"
            role="img"
            aria-label={`${activity.title} image unavailable`}
          >
            <span>Activity preview unavailable</span>
          </div>
        )}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              className="activityCardArrow activityCardArrowPrev"
              onClick={(event) => {
                event.stopPropagation()
                showPreviousImage()
              }}
              aria-label={`Show previous image for ${activity.title}`}
            >
              <CaretLeft size={16} weight="bold" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="activityCardArrow activityCardArrowNext"
              onClick={(event) => {
                event.stopPropagation()
                showNextImage()
              }}
              aria-label={`Show next image for ${activity.title}`}
            >
              <CaretRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      <div className="activityCardBody">
        <p className="activityCardOrg">{activity.org}</p>
        <h3 className="activityCardTitle">{activity.title}</h3>
        {supportingDetails ? (
          <p className="itemDates activityCardDates">{supportingDetails}</p>
        ) : null}
        <p className="activityCardSummary">{activity.summary}</p>
      </div>

      <ul className="skillsBadges activityCardTags" aria-label={`${activity.title} tags`}>
        {activity.tags.map((tag) => (
          <li key={tag} className="skillBadge">
            <span>{tag}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default ActivityCard
