import { getActivityMedia } from './activityMedia'

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
  image?: string
  tags: ActivityTag[]
  links?: ActivityLink[]
  images: string[]
  featured: boolean
}

type ActivityDescriptionInput = {
  description?: string
  responsibilities?: string[]
  highlights?: string[]
}

function buildActivityDescription({
  description,
  responsibilities,
  highlights,
}: ActivityDescriptionInput) {
  const blocks: string[] = []

  if (description?.trim()) {
    blocks.push(description.trim())
  }

  if (responsibilities?.length) {
    blocks.push(['Responsibilities:', ...responsibilities.map((item) => `- ${item}`)].join('\n'))
  }

  if (highlights?.length) {
    blocks.push(['Highlights:', ...highlights.map((item) => `- ${item}`)].join('\n'))
  }

  return blocks.join('\n\n')
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
    id: 'gdg-cloud-hcm-core-team-organizer',
    title: 'Core Team Member – Organizer',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: 'May 2025 - Nov 2025 · 7 mos',
    location: 'Ho Chi Minh City, Vietnam · Remote',
    summary:
      'Organized and supported GDG Cloud HCM events, workshops, and community programs focused on Google Cloud.',
    description: buildActivityDescription({
      description:
        'Core Team Member at GDG Cloud HCM: Driving impactful community events and workshops, connecting developers with the latest Google Cloud innovations and hands-on learning experiences. Google for Developers Profile: https://g.dev/tienhuynh-tn',
      responsibilities: [
        'Event Planning & Execution: Organize meetups, workshops, and flagship events like Google Cloud Next Extended.',
        'Content Curation: Coordinate with speakers to define topics, create agendas, and ensure high-quality content delivery.',
        'Community Engagement: Build and grow the local developer community through networking, social media campaigns, and interactive activities.',
        'Partnership & Sponsorship: Collaborate with sponsors, partners, and other tech communities for event support and collaboration.',
        'Logistics Management: Oversee venue arrangements, catering, technical setups, and on-site operations.',
        'Marketing & Promotion: Manage event promotion via social platforms, email campaigns, and community groups.',
        'Volunteer Coordination: Recruit and train event volunteers and facilitators to ensure smooth operations.',
        'Feedback & Reporting: Collect attendee feedback, analyze event outcomes, and report results to the GDG global team.',
        'Innovation & Trends: Stay updated on Google Cloud technologies to introduce relevant sessions and codelabs.',
      ],
      highlights: [
        '2025.07.26: Google Cloud Next Extended Ho Chi Minh 2025 Organizer (https://gdg.community.dev/e/mrgdh2/)',
        '2025.09.27: #QuanQuanGCP Season 7 Code Along Session in Ho Chi Minh City 2025 - Organizer, Speaker, Facilitator',
        '2025.11.28: DevFest Cloud Ho Chi Minh 2025 - Organizer',
      ],
    }),
    tags: ['Organizer', 'Volunteer', 'Community'],
    links: [
      {
        label: 'Details',
        url: 'https://g.dev/tienhuynh-tn',
      },
    ],
    ...getActivityMedia('gdg-cloud-core-team'),
    featured: true,
  },
  {
    id: 'gdg-sea-summit-2025-participant',
    title: 'Google Developer Groups Southeast Asia Summit 2025 – Participant',
    org: 'Google Developer Groups',
    role: 'Community / Tech',
    date: '12/09/2025 - 14/09/2025 · 3 days',
    location: 'Bangkok, Thailand',
    summary:
      'Joined regional GDG knowledge-sharing sessions, community activities, and networking in Bangkok.',
    description: buildActivityDescription({
      description:
        'Participated in Google Developer Groups Southeast Asia Summit 2025 in Bangkok, Thailand. Joined knowledge-sharing sessions, community activities, and networking opportunities with developers and organizers across Southeast Asia.',
      highlights: [
        'Day 1 (12 Sep 2025): Joined the Google Office tour at Google Bangkok and team activities.',
        'Day 1 (12 Sep 2025): Team 2 won the top prize in the team challenge.',
        'Day 2 (13 Sep 2025): Attended talks and sharing sessions covering tech, community stories, and personal experiences.',
        'Day 2 (13 Sep 2025): Participated in the event party and social activities.',
        'Day 3 (14 Sep 2025): Wrapped up the summit with farewell activities, gifts, and networking.',
        'Built meaningful connections with organizers, speakers, and community members across the region.',
      ],
    }),
    tags: ['Community', 'Volunteer'],
    ...getActivityMedia('gdg-sea-summit-2025'),
    featured: true,
  },
  {
    id: 'she-codes-hackathon-2023-participant',
    title: 'She Codes Hackathon 2023 – Participant',
    org: 'SheCodes Vietnam',
    role: 'Hackathon / Tech',
    date: '14/10/2023 - 15/10/2023 · 2 days',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Participated in a 36-hour hackathon to design and code a platform connecting small and medium enterprises.',
    description: buildActivityDescription({
      description:
        'Participated in She Codes Hackathon 2023 and worked with the team to design and code a platform that connects small and medium enterprises. The event was an intensive 36-hour experience focused on collaboration, learning, and innovation under pressure.',
      highlights: [
        'Joined a 36-hour hackathon and collaborated closely with teammates, mentors, and participants.',
        'Learned from designers, coders, engineers, and mentors from GFT Technologies, Katalon, and Netcompany.',
        "Worked on the HCM topic 'Connect' by proposing a platform to connect small and medium enterprises.",
        'Contributed to designing a solution that helps clients find agencies and helps agencies find new and suitable clients.',
        'Received guidance and mentorship throughout the competition.',
        'Valued the teamwork, collaboration, and shared effort that made the project possible.',
      ],
    }),
    tags: ['Competition', 'Community'],
    ...getActivityMedia('shecodes-hackathon-2023'),
    featured: true,
  },
  {
    id: 'sitigroup-leader-human-resources-logistics-team',
    title: 'Leader of Human Resources – Logistics Team',
    org: 'Cộng đồng Sinh viên Tình nguyện SiTiGroup - Student Volunteer Community SiTiGroup',
    role: 'Volunteer / Student Community',
    date: 'Nov 2020 - May 2021 · 7 mos',
    summary: 'Led human resources and logistics support for student volunteer community activities.',
    description:
      'Served as Leader of Human Resources in the Logistics Team for the SiTiGroup student volunteer community.',
    tags: ['Organizer', 'Volunteer', 'Community'],
    ...getActivityMedia('sitigroup-human-resources-logistics-team-leader'),
    featured: false,
  },
  {
    id: 'sitigroup-member-logistics-team',
    title: 'Member of the Logistics Team',
    org: 'Cộng đồng Sinh viên Tình nguyện SiTiGroup - Student Volunteer Community SiTiGroup',
    role: 'Volunteer / Student Community',
    date: 'Nov 2019 - Nov 2020 · 1 yr 1 mo',
    summary: 'Supported logistics operations for student volunteer community programs.',
    description:
      'Contributed as a member of the Logistics Team for the SiTiGroup student volunteer community.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('sitigroup-logistics-team-member'),
    featured: false,
  },
  {
    id: 'sitigroup-member-human-resource-team',
    title: 'Member of the Human Resource Team',
    org: 'Cộng đồng Sinh viên Tình nguyện SiTiGroup - Student Volunteer Community SiTiGroup',
    role: 'Volunteer / Student Community',
    date: 'May 2021 - Sep 2022 · 1 yr 5 mos',
    summary: 'Supported human resource activities in the student volunteer community.',
    description:
      'Contributed as a member of the Human Resource Team for the SiTiGroup student volunteer community.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('sitigroup-human-resource-team-member'),
    featured: false,
  },
  {
    id: 'big-steps-member-event-department',
    title: 'Member of the Event Department',
    org: 'Big Steps Organization',
    role: 'Volunteer / Events',
    date: 'Nov 2018 - Dec 2020 · 2 yrs 2 mos',
    summary: 'Contributed to event department operations for community programs.',
    description: 'Served as a member of the Event Department at Big Steps Organization.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('big-steps-event-department'),
    featured: false,
  },
  {
    id: 'gdg-devfest-cloud-hcm-2023-logistics-collaborator',
    title: 'Logistics Collaborator – DevFest Cloud HCM 2023',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: 'Dec 2023 · 1 mo',
    summary: 'Supported logistics operations for DevFest Cloud HCM 2023.',
    description:
      'Contributed as a Logistics Collaborator for DevFest Cloud HCM 2023 with GDG Cloud HCM.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('devfest-cloud-hcm-2023'),
    featured: false,
  },
  {
    id: 'gdg-google-io-extended-cloud-hcm-2024-logistics-collaborator',
    title: 'Logistics Collaborator – Google I/O Extended Cloud HCM 2024',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: 'Jul 2024 · 1 mo',
    summary: 'Supported logistics operations for Google I/O Extended Cloud HCM 2024.',
    description:
      'Contributed as a Logistics Collaborator for Google I/O Extended Cloud HCM 2024 with GDG Cloud HCM.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('google-io-extended-cloud-hcm-2024'),
    featured: false,
  },
  {
    id: 'gdg-build-with-ai-2025-facilitator',
    title: 'Facilitator – Build with AI 2025',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: 'May 2025 · 1 mo',
    summary: 'Facilitated activities and participant support for Build with AI 2025.',
    description: 'Served as a facilitator for Build with AI 2025 with GDG Cloud HCM.',
    tags: ['Mentor', 'Volunteer', 'Community'],
    ...getActivityMedia('build-with-ai-2025'),
    featured: false,
  },
  {
    id: 'bcnv-hair-donation-volunteer',
    title: 'Hair Donation Volunteer',
    org: 'Breast Cancer Network Vietnam (BCNV)',
    role: 'Health / Community',
    date: 'May 2022 · 1 mo',
    summary: 'Donated hair to support cancer patients through BCNV.',
    description: 'Donating hair for the benefit of cancer patients.',
    tags: ['Volunteer'],
    ...getActivityMedia('hair-donation-volunteer'),
    featured: false,
  },
  {
    id: 'blood-donation-volunteer',
    title: 'Blood Donation Volunteer',
    org: 'Blood Donation Organization',
    role: 'Health',
    date: 'Dec 2019 - Present · 6 yrs 4 mos',
    summary: 'Recurring blood donation volunteer participation since December 2019.',
    description: buildActivityDescription({
      description: 'Blood donation volunteer with recurring participation.',
      highlights: [
        '1st: 19/12/2019',
        '2nd: 23/06/2020',
        '3rd: 30/01/2021',
        '4th: 23/04/2022',
        '5th: 30/08/2022',
        '6th: 16/07/2023',
        '7th: 31/01/2024',
        '8th: 08/06/2024',
        '9th: 29/10/2025',
      ],
    }),
    tags: ['Volunteer'],
    ...getActivityMedia('blood-donation-volunteer'),
    featured: false,
  },
  {
    id: 'entera-countdown-2024-fanszone-volunteer',
    title: 'Fanszone Volunteer - Entera Countdown 2024',
    org: 'Entera Music Festival',
    role: 'Events',
    date: 'Dec 2023 · 1 mo',
    summary: 'Supported fanszone operations for Entera Countdown 2024.',
    description: 'Served as a fanszone volunteer for Entera Countdown 2024.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('entera-countdown-2024-fanszone'),
    featured: false,
  },
  {
    id: 'vpbank-vnexpress-marathon-finish-race-volunteer',
    title: 'Finish Race Volunteer',
    org: 'VPBank VnExpress Marathon Ho Chi Minh City Midnight',
    role: 'Sports Event',
    date: 'Mar 2024 · 1 mo',
    summary:
      'Supported finish-line volunteer activities for VPBank VnExpress Marathon Ho Chi Minh City Midnight.',
    description:
      'Served as a finish race volunteer at VPBank VnExpress Marathon Ho Chi Minh City Midnight.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('vpbank-vnexpress-marathon-finish-race'),
    featured: false,
  },
  {
    id: 'run-to-live-water-zone-volunteer',
    title: 'Water Zone Volunteer',
    org: 'Run To Live',
    role: 'Sports Event',
    date: 'Mar 2024 · 1 mo',
    summary: 'Supported Water Zone operations at Run To Live.',
    description: 'Served as a Water Zone volunteer at Run To Live.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('run-to-live-water-zone'),
    featured: false,
  },
  {
    id: 'green-summer-project-member-logistic-department',
    title: 'Member of the Logistic Department',
    org: 'Green Summer Project',
    role: 'Environment',
    date: 'Jun 2019 - Jul 2019 · 2 mos',
    summary: 'Supported logistics activities for the Green Summer Project.',
    description: 'Served as a member of the Logistic Department for the Green Summer Project.',
    tags: ['Volunteer', 'Community'],
    ...getActivityMedia('green-summer-project-logistic-department'),
    featured: false,
  },
]

export const allActivityTags = Array.from(
  new Set(activities.flatMap((activity) => activity.tags)),
)

export const featuredActivities = activities.filter((item) => item.featured).slice(0, 3)

export const allActivities = [...activities]
