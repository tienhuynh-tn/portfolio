export type ActivityTag =
  | 'Volunteer'
  | 'Organizer'
  | 'Competition'
  | 'Speaker'
  | 'Mentor'
  | 'Community'
  | 'Backend'

export type ActivityLink = {
  label: 'Details' | 'Proof' | 'Post'
  url: string
}

export type ActivityItem = {
  id: string
  title: string
  org: string
  role: string
  date: string
  location?: string
  summary: string
  description: string
  tags: ActivityTag[]
  links?: ActivityLink[]
  images: string[]
  featured: boolean
}

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

function parseActivityDatePoint(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 0

  if (trimmed.toLowerCase() === 'present') {
    return Number.MAX_SAFE_INTEGER
  }

  const [monthText, yearText] = trimmed.split(/\s+/)
  const month = MONTH_INDEX[monthText.slice(0, 3).toLowerCase()] ?? 0
  const year = Number.parseInt(yearText, 10)

  if (Number.isNaN(year)) return 0

  return Date.UTC(year, month, 1)
}

function getActivityDateRangeParts(date: string) {
  const [startText, endText] = date.split(/\s+[–-]\s+/)

  return {
    start: parseActivityDatePoint(startText ?? ''),
    end: parseActivityDatePoint(endText ?? startText ?? ''),
  }
}

export function compareActivitiesByDateDesc(a: ActivityItem, b: ActivityItem) {
  const aRange = getActivityDateRangeParts(a.date)
  const bRange = getActivityDateRangeParts(b.date)

  if (bRange.end !== aRange.end) {
    return bRange.end - aRange.end
  }

  if (bRange.start !== aRange.start) {
    return bRange.start - aRange.start
  }

  return a.title.localeCompare(b.title)
}

export function compareActivitiesByDateAsc(a: ActivityItem, b: ActivityItem) {
  return compareActivitiesByDateDesc(b, a)
}

export const activities: ActivityItem[] = [
  {
    id: 'gdg-backend-mentor',
    title: 'Backend Mentorship Program',
    org: 'Google Developer Group HCMC',
    role: 'Mentor',
    date: 'Jan 2025 – Present',
    location: 'Ho Chi Minh City, Vietnam',
    summary: 'Mentor engineers through backend architecture reviews and production debugging practice.',
    description: `Mentor a small backend cohort through architecture reviews, API design critiques, and incident walkthroughs.

- Designed weekly problem sets around Java, SQL, and service resiliency.
- Reviewed project milestones and debugging notes to tighten delivery quality.
- Helped mentees turn messy runtime failures into repeatable troubleshooting playbooks.`,
    tags: ['Mentor', 'Volunteer', 'Backend', 'Community'],
    links: [
      {
        label: 'Details',
        url: 'https://developers.google.com/community/gdg',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
  },
  {
    id: 'hackathon-fintech-api-challenge',
    title: 'Fintech API Reliability Challenge',
    org: 'VietTech Hackathon 2024',
    role: 'Competition Finalist',
    date: 'Nov 2024',
    location: 'Ho Chi Minh City, Vietnam',
    summary: 'Built a resilient payments API prototype with observability-first failure handling.',
    description: `Reached the finalist round with a payments API concept designed around graceful degradation and operational visibility.

- Modeled failure paths before feature polish to keep the demo stable under load.
- Added request tracing and health diagnostics to shorten issue isolation.
- Presented tradeoffs between delivery speed, auditability, and reliability.`,
    tags: ['Competition', 'Backend', 'Community'],
    links: [
      {
        label: 'Proof',
        url: 'https://github.com/tienhuynh-tn',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
  },
  {
    id: 'java-vietnam-meetup-talk',
    title: 'Practical API Hardening in Spring Boot',
    org: 'Java Vietnam Community Meetup',
    role: 'Speaker',
    date: 'Aug 2024',
    location: 'Ho Chi Minh City, Vietnam',
    summary: 'Shared a concise checklist for raising API stability before release.',
    description: `Delivered a practical session on improving release confidence for Spring Boot services.

- Covered authentication hardening, timeout strategy, and defensive validation.
- Converted common production incidents into a checklist teams could adopt immediately.
- Answered audience questions around rollout safety, logging, and post-release verification.`,
    tags: ['Speaker', 'Volunteer', 'Backend', 'Community'],
    links: [
      {
        label: 'Post',
        url: 'https://www.meetup.com',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: true,
  },
  {
    id: 'student-dev-bootcamp-organizer',
    title: 'Student Backend Bootcamp',
    org: 'Local University Engineering Club',
    role: 'Organizer',
    date: 'Jun 2023 – Dec 2023',
    location: 'Ho Chi Minh City, Vietnam',
    summary: 'Coordinated a hands-on backend bootcamp with weekly labs and mentor support.',
    description: `Planned and ran a student bootcamp focused on backend fundamentals and project delivery rhythm.

- Built the curriculum around Java, SQL, REST design, and debugging practice.
- Coordinated volunteer mentors and weekly lab reviews.
- Standardized the workshop materials so each session could run consistently.`,
    tags: ['Organizer', 'Volunteer', 'Community'],
    links: [
      {
        label: 'Details',
        url: 'https://github.com/tienhuynh-tn',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
  },
  {
    id: 'career-night-qa-panel',
    title: 'Career Night Engineering Q&A',
    org: 'Tech Career Circle',
    role: 'Panel Mentor',
    date: 'Mar 2023',
    location: 'Remote',
    summary: 'Advised students on backend learning priorities, interviews, and first-job readiness.',
    description: `Joined a remote panel for students preparing for backend internships and junior roles.

- Shared a learning path focused on fundamentals, not resume padding.
- Walked through interview preparation and project storytelling.
- Answered questions about teamwork, code review expectations, and growth habits.`,
    tags: ['Mentor', 'Speaker', 'Community'],
    links: [
      {
        label: 'Details',
        url: 'https://github.com/tienhuynh-tn',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80',
    ],
    featured: false,
  },
]

export const allActivityTags = Array.from(
  new Set(activities.flatMap((activity) => activity.tags)),
)

export const featuredActivities = activities
  .filter((item) => item.featured)
  .sort(compareActivitiesByDateDesc)
  .slice(0, 3)

export const allActivities = [...activities].sort(compareActivitiesByDateDesc)
