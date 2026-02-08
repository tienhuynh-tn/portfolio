export type ActivityTag =
  | 'Volunteer'
  | 'Organizer'
  | 'Competition'
  | 'Speaker'
  | 'Mentor'

export type ActivityItem = {
  id: string
  title: string
  orgEvent: string
  role: string
  dateRange: string
  imageUrl?: string
  description?: string
  tags: ActivityTag[]
  links?: {
    details?: string
    proof?: string
  }
  featured: boolean
}

export const activities: ActivityItem[] = [
  {
    id: 'gdg-backend-mentor',
    title: 'Backend Mentorship Program',
    orgEvent: 'Google Developer Group HCMC',
    role: 'Mentor',
    dateRange: 'Jan 2025 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Guiding early-career engineers through backend architecture and production debugging drills.',
    tags: ['Mentor', 'Volunteer'],
    links: {
      details: 'https://developers.google.com/community/gdg',
    },
    featured: true,
  },
  {
    id: 'hackathon-fintech-api-challenge',
    title: 'Fintech API Reliability Challenge',
    orgEvent: 'VietTech Hackathon 2024',
    role: 'Competition Finalist',
    dateRange: 'Nov 2024',
    imageUrl:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Built a resilient payments API prototype with observability-first incident handling.',
    tags: ['Competition', 'Organizer'],
    links: {
      proof: 'https://github.com/tienhuynh-tn',
    },
    featured: true,
  },
  {
    id: 'java-vietnam-meetup-talk',
    title: 'Practical API Hardening in Spring Boot',
    orgEvent: 'Java Vietnam Community Meetup',
    role: 'Speaker',
    dateRange: 'Aug 2024',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    description:
      'Presented a field-tested checklist for improving API stability and release confidence.',
    tags: ['Speaker', 'Volunteer'],
    links: {
      details: 'https://www.meetup.com',
    },
    featured: true,
  },
  {
    id: 'student-dev-bootcamp-organizer',
    title: 'Student Backend Bootcamp',
    orgEvent: 'Local University Engineering Club',
    role: 'Organizer',
    dateRange: 'Jun 2023 – Dec 2023',
    description:
      'Coordinated curriculum and weekly labs on Java, SQL, and REST service design.',
    tags: ['Organizer', 'Volunteer'],
    links: {
      details: 'https://github.com/tienhuynh-tn',
    },
    featured: false,
  },
]

export const featuredActivities = activities.filter((item) => item.featured).slice(0, 3)
export const allActivities = [
  ...activities.filter((item) => item.featured),
  ...activities.filter((item) => !item.featured),
]
