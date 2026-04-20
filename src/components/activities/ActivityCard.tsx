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
const PREVIEW_TAG_LIMIT = 3
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}
const PREVIEW_TAG_PRIORITY: Record<string, number> = {
  Leadership: 0,
  Operations: 1,
  Logistics: 2,
  Organizer: 3,
  Speaker: 4,
  Mentor: 5,
  'Human Resources': 6,
  Backend: 7,
  Competition: 8,
  Volunteer: 20,
  Community: 21,
}

function formatPreviewDatePoint(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.toLowerCase() === 'present') return 'Present'

  const exactDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (exactDateMatch) {
    const [, day, month, year] = exactDateMatch
    const exactDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(exactDate)
  }

  const monthYearMatch = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{4})$/)
  if (!monthYearMatch) return trimmed

  const [, monthText, yearText] = monthYearMatch
  const monthIndex = MONTH_INDEX[monthText.slice(0, 3).toLowerCase()]
  if (monthIndex === undefined) return trimmed

  return `${MONTH_LABELS[monthIndex]} ${yearText}`
}

function getPreviewDate(date: string) {
  const previewDate = date
    .split('·')
    .map((part) => part.trim())[0] ?? ''

  if (!previewDate) return ''

  return previewDate
    .split(/\s+[–-]\s+/)
    .map((part) => formatPreviewDatePoint(part))
    .filter(Boolean)
    .join(' - ')
}

function getPreviewTags(tags: ActivityItem['tags']) {
  return [...tags]
    .sort((left, right) => {
      const leftPriority = PREVIEW_TAG_PRIORITY[left] ?? 10
      const rightPriority = PREVIEW_TAG_PRIORITY[right] ?? 10

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority
      }

      return left.localeCompare(right)
    })
    .slice(0, PREVIEW_TAG_LIMIT)
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
  const previewDate = getPreviewDate(activity.date)
  const previewTags = getPreviewTags(activity.tags)

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
        {previewDate ? <p className="itemDates activityCardDates">{previewDate}</p> : null}
        <p className="activityCardSummary">{activity.summary}</p>
      </div>

      <ul className="skillsBadges activityCardTags" aria-label={`${activity.title} tags`}>
        {previewTags.map((tag) => (
          <li key={tag} className="skillBadge">
            <span>{tag}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default ActivityCard
