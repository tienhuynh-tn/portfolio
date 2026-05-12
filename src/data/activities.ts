import { getActivityMedia } from './activityMedia'

export type ActivityTag =
  | 'Volunteer'
  | 'Organizer'
  | 'Competition'
  | 'Speaker'
  | 'Mentor'
  | 'Community'
  | 'Backend'
  | 'Leadership'
  | 'Operations'
  | 'Human Resources'
  | 'Logistics'
  | 'Environment'
  | 'Youth Project'
  | 'Event'
  | 'Marathon'
  | 'Sports Event'
  | 'Event Operations'
  | 'Google Cloud'
  | 'AI'
  | 'Event Support'
  | 'Workshop'
  | 'Facilitator'
  | 'Health'
  | 'Donation'
  | 'Non-profit'
  | 'Event Organization'
  | 'Social Impact'
  | 'Teamwork'
  | 'GDG Cloud HCM'
  | 'DevFest'
  | 'Vertex AI'
  | 'Gemini'
  | 'Codelab'
  | 'Developer Community'
  | 'Hackathon'
  | 'AI for Education'
  | 'EdTech'
  | 'Vietnam Impact'
  | 'Next.js'
  | 'Nx'
  | 'Supabase'
  | 'CSV Analysis'
  | 'Bilingual App'
  | 'Teacher Support'
  | 'Lumi AI'

export type ActivityLink = {
  label:
    | 'Details'
    | 'Proof'
    | 'Post'
    | 'Codelab resource'
    | 'Live demo'
    | 'Website'
    | 'GitHub'
    | 'Pitch deck'
    | 'Judge result'
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
  rolesProgression?: string[]
  responsibilities?: string[]
  highlights?: string[]
  sections?: Array<{
    title: string
    paragraphs?: string[]
    bullets?: string[]
  }>
}

function buildActivityDescription({
  description,
  rolesProgression,
  responsibilities,
  highlights,
  sections,
}: ActivityDescriptionInput) {
  const blocks: string[] = []

  if (description?.trim()) {
    blocks.push(description.trim())
  }

  if (rolesProgression?.length) {
    blocks.push(['Roles & Progression:', ...rolesProgression.map((item) => `- ${item}`)].join('\n'))
  }

  if (responsibilities?.length) {
    blocks.push(['Responsibilities:', ...responsibilities.map((item) => `- ${item}`)].join('\n'))
  }

  if (highlights?.length) {
    blocks.push(['Highlights:', ...highlights.map((item) => `- ${item}`)].join('\n'))
  }

  sections?.forEach(({ title, paragraphs, bullets }) => {
    const sectionLines = [
      `${title}:`,
      ...(paragraphs?.map((item) => item.trim()).filter(Boolean) ?? []),
      ...(bullets?.map((item) => `- ${item.trim()}`).filter(Boolean) ?? []),
    ]

    if (sectionLines.length > 1) {
      blocks.push(sectionLines.join('\n'))
    }
  })

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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseActivityExactDate(value: string) {
  const exactDateMatch = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!exactDateMatch) return null

  const [, dayText, monthText, yearText] = exactDateMatch
  const day = Number.parseInt(dayText, 10)
  const month = Number.parseInt(monthText, 10) - 1
  const year = Number.parseInt(yearText, 10)

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    month < 0 ||
    month > 11
  ) {
    return null
  }

  return { day, month, year }
}

function formatActivityDatePoint(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.toLowerCase() === 'present') return 'Present'

  const exactDate = parseActivityExactDate(trimmed)
  if (exactDate) {
    return `${MONTH_LABELS[exactDate.month]} ${exactDate.day}, ${exactDate.year}`
  }

  const [monthText, yearText] = trimmed.split(/\s+/)
  const month = MONTH_INDEX[monthText?.slice(0, 3).toLowerCase()] ?? -1

  if (month >= 0 && /^\d{4}$/.test(yearText ?? '')) {
    return `${MONTH_LABELS[month]} ${yearText}`
  }

  return trimmed
}

export function formatActivityDateRangeForDisplay(date: string) {
  const dateRange = date
    .split('·')
    .map((part) => part.trim())[0] ?? ''

  if (!dateRange) return ''

  const [startText = '', endText = ''] = dateRange.split(/\s+[–-]\s+/)
  const startExact = parseActivityExactDate(startText)
  const endExact = parseActivityExactDate(endText)

  if (startExact && endExact) {
    if (startExact.year === endExact.year && startExact.month === endExact.month) {
      return `${MONTH_LABELS[startExact.month]} ${startExact.day} – ${MONTH_LABELS[endExact.month]} ${endExact.day}, ${startExact.year}`
    }

    if (startExact.year === endExact.year) {
      return `${MONTH_LABELS[startExact.month]} ${startExact.day} – ${MONTH_LABELS[endExact.month]} ${endExact.day}, ${startExact.year}`
    }

    return `${MONTH_LABELS[startExact.month]} ${startExact.day}, ${startExact.year} – ${MONTH_LABELS[endExact.month]} ${endExact.day}, ${endExact.year}`
  }

  if (!endText) {
    return formatActivityDatePoint(startText)
  }

  return [formatActivityDatePoint(startText), formatActivityDatePoint(endText)]
    .filter(Boolean)
    .join(' – ')
}

function parseActivityDatePoint(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 0

  if (trimmed.toLowerCase() === 'present') {
    return Number.MAX_SAFE_INTEGER
  }

  const exactDate = parseActivityExactDate(trimmed)
  if (exactDate) {
    return Date.UTC(exactDate.year, exactDate.month, exactDate.day)
  }

  const [monthText, yearText] = trimmed.split(/\s+/)
  const month = MONTH_INDEX[monthText.slice(0, 3).toLowerCase()] ?? 0
  const year = Number.parseInt(yearText, 10)

  if (Number.isNaN(year)) return 0

  return Date.UTC(year, month, 1)
}

function getActivityDateRangeParts(date: string) {
  const dateRange = date
    .split('·')
    .map((part) => part.trim())[0] ?? ''
  const [startText, endText] = dateRange.split(/\s+[–-]\s+/)

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

const activityIdsPinnedToEnd = new Set(['blood-donation-volunteer'])

function compareActivitiesForDisplay(a: ActivityItem, b: ActivityItem) {
  const aPinnedToEnd = activityIdsPinnedToEnd.has(a.id)
  const bPinnedToEnd = activityIdsPinnedToEnd.has(b.id)

  if (aPinnedToEnd !== bPinnedToEnd) {
    return aPinnedToEnd ? 1 : -1
  }

  return compareActivitiesByDateDesc(a, b)
}

export const activities: ActivityItem[] = [
  {
    id: 'weekend-build-with-codex-hcmc-viteach',
    title: 'Weekend Build With Codex - HCMC – ViTeach',
    org: 'Codex Hackathon Track 3 Vietnam Impact',
    role: 'Product Owner / Researcher / Team Leader',
    date: '09/05/2026 · 1 day',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Led a 4-member team building ViTeach, a bilingual EdTech MVP that analyzes LMS score CSVs and helps teachers identify class risk, trends, and interventions.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'ViTeach is a hackathon MVP for Track 3 Vietnam Impact, built for Vietnam education context where the government is accelerating AI adoption in education and large-scale student assessment programs continue to expand.',
            '"Digital transformation is no longer an option, but an inevitable requirement" captures the urgency behind the project and the role of Educational Technology (EdTech) in national development.',
            'The workspace was generated with Nx using a Next.js app in apps/web.',
          ],
        },
        {
          title: 'Problem',
          bullets: [
            'Classes are often too large for teachers to personalize learning and manage student progress effectively',
            'Teachers are overloaded with student evaluations and manual assessment workflows',
            'Manual evaluation makes it harder to identify risk patterns quickly',
            'Teachers lack practical tools to optimize lesson planning and student support at scale',
          ],
        },
        {
          title: 'Existing Solution & Gap',
          bullets: [
            'The MVP currently requires manual CSV upload',
            'Personalized learning remains challenging when teachers do not have enough structured student learning data',
            'The product is new and still needs time, usage, and validation to build trust',
          ],
        },
        {
          title: 'Our Solution',
          bullets: [
            'From a CSV of student scores, AI analyzes class performance instantly',
            'Visualizes charts, statistics, and dashboards for faster classroom insight',
            'Provides Lumi, an evaluation AI assistant for interpreting risks and trends',
            'Suggests lesson planning ideas and personalized student support plans',
          ],
        },
        {
          title: 'My Role',
          bullets: [
            'Served as Product Owner, Researcher, and Team Leader',
            'Led a 4-member team through product framing, research, prioritization, and demo readiness',
            'Focused the MVP around practical teacher workflows and classroom intervention support',
          ],
        },
        {
          title: 'Team',
          bullets: [
            'Team size: 4 members',
            'Tien Huynh: Product Owner, Researcher, and Team Leader',
            'Đặng Việt Tuân: Senior Developer',
            'Nguyễn Nguyên: Software Developer',
            'Trần Phước Lộc: Front-end Developer',
          ],
        },
        {
          title: 'Main Features',
          bullets: [
            'Multilingual Dashboard: Full English/Vietnamese support across the UI',
            'Supabase Auth: Teacher login and profile management',
            'CSV Upload & Analysis: Import class data and get instant risk analysis',
            'KPI Dashboard: View total students, risk distribution, and potential students at a glance',
            'Floating Chat Widget: Ask Lumi, the AI assistant, for support plans and teaching suggestions',
            'Risk Distribution: Donut chart showing high/medium/low risk breakdowns',
            'Student Insights: Separate panels for students requiring attention and potential students ready for enrichment',
            'Trend Analysis: Per-student score trend charts with risk reasons and Lumi-generated suggestions',
            'Demo Data: 5 example CSV files pre-configured with Vietnam high school classes',
          ],
        },
        {
          title: 'Result',
          bullets: ['Judge result: #5/9 total teams'],
        },
      ],
    }),
    tags: [
      'Hackathon',
      'AI for Education',
      'EdTech',
      'Vietnam Impact',
      'Next.js',
      'Nx',
      'Supabase',
      'CSV Analysis',
      'Bilingual App',
      'Teacher Support',
      'Lumi AI',
    ],
    links: [
      {
        label: 'Live demo',
        url: 'https://youtu.be/8sGdwr-E70U',
      },
      {
        label: 'Website',
        url: 'https://project-7yms1.vercel.app/',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/tienhuynh-tn/vi-teach',
      },
      {
        label: 'Pitch deck',
        url: 'https://canva.link/uwiekraef8yjz1b',
      },
      {
        label: 'Judge result',
        url: 'https://codex-hackathon-track3.pages.dev/',
      },
    ],
    ...getActivityMedia('vi-teach'),
    featured: true,
  },
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
        'Core Team Member at GDG Cloud HCM: Driving impactful community events and workshops, connecting developers with the latest Google Cloud innovations and hands-on learning experiences.',
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
        '2025.09.27: #QuanQuanGCP Season 7 Code Along Session in Ho Chi Minh City 2025 - Organizer, Speaker, Facilitator https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-quanquangcp-season-7-code-along-session-in-ho-chi-minh-city/',
        '2025.11.28: DevFest Cloud Ho Chi Minh 2025 - Organizer https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-devfest-cloud-hcm-2025/',
      ],
    }),
    tags: ['Organizer', 'Community', 'Google Cloud', 'Event Organization', 'Volunteer'],
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
        'Participated in Google Developer Groups Southeast Asia Summit 2025 in Bangkok, Thailand, joining developers, community organizers, and speakers from across Southeast Asia for three days of learning, collaboration, and community exchange.',
      highlights: [
        'Day 1 (12 Sep 2025): Started with a Google Bangkok office tour and team-building activities with a randomly assigned group.',
        'Day 1 (12 Sep 2025): Team 2 won the top prize in the team challenge.',
        'Day 2 (13 Sep 2025): Joined intensive sharing sessions covering technology, community stories, and personal experiences from GDG leaders and members across the region.',
        'Day 2 (13 Sep 2025): Continued networking through the summit party and community social activities.',
        'Day 3 (14 Sep 2025): Closed the summit with farewells, small gifts, and meaningful connections with participants and organizers.',
        'Appreciated the support and effort of the organizing team, including local hosts, regional community leaders, and the GDG Cloud HCM team.',
      ],
    }),
    tags: ['Community', 'Developer Community', 'Google Cloud', 'Teamwork'],
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
      'Participated in a 36-hour hackathon to build Partner Up / SheCodes H2O, a web application for discovering and connecting with service agencies.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Partner Up / SheCodes H2O is a full-stack web application for discovering and connecting with service agencies. The project combines a React + Vite frontend, a Spring Boot backend, and a Microsoft SQL Server database schema.',
            'The current product is oriented around a Vietnamese agency directory experience, helping users browse, search, and evaluate service companies more easily.',
          ],
        },
        {
          title: 'Product Experience',
          bullets: [
            'Browse featured companies on the home page',
            'Search and filter agencies by province, category, service, and budget',
            'View company detail information',
            'Explore service data exposed by the backend API',
          ],
        },
        {
          title: 'Team',
          bullets: [
            'Vo Hoang Vy: UI/UX Designer',
            'Huynh Le Thuy Tien: Back-End Developer',
            'Le Mai Khanh: Front-End Developer',
            'Dao Nhu Quynh: Front-End Designer',
            'Vo Thi Thanh Mai: Business Analyst',
          ],
        },
        {
          title: 'Hackathon Experience',
          bullets: [
            'Joined a 36-hour hackathon and collaborated closely with teammates, mentors, and participants',
            'Worked on the HCM topic "Connect" by proposing a platform to connect small and medium enterprises with suitable agencies',
            'Received guidance and mentorship throughout the competition',
            'Valued the teamwork, collaboration, and shared effort that made the project possible',
          ],
        },
      ],
    }),
    tags: ['Competition', 'Community'],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/tienhuynh-tn/shecodes_H2O',
      },
    ],
    ...getActivityMedia('shecodes-hackathon-2023'),
    featured: true,
  },
  {
    id: 'sitigroup-human-resources-logistics-journey',
    title: 'Human Resources & Logistics Team',
    org: 'Cộng đồng Sinh viên Tình nguyện SiTiGroup – Student Volunteer Community SiTiGroup',
    role: 'Volunteer / Student Community',
    date: 'Nov 2019 – Sep 2022',
    summary:
      'Contributed to logistics and human resource operations within the SiTiGroup student volunteer community, supporting the organization and execution of community initiatives while progressing from team member to a leadership role.',
    description: buildActivityDescription({
      description:
        'Contributed to logistics and human resource operations within the SiTiGroup student volunteer community, supporting the organization and execution of community initiatives. Progressed from team member to a leadership role, coordinating people, planning operations, and ensuring smooth on-the-ground execution.',
      rolesProgression: [
        'Member of the Logistics Team (Nov 2019 – Nov 2020)',
        'Leader of Human Resources – Logistics Team (Nov 2020 – May 2021)',
        'Member of the Human Resource Team (May 2021 – Sep 2022)',
      ],
    }),
    tags: ['Leadership', 'Operations', 'Human Resources', 'Logistics', 'Volunteer', 'Community'],
    ...getActivityMedia('sitigroup-human-resources-logistics-journey'),
    featured: false,
  },
  {
    id: 'big-steps-member-event-department',
    title: 'Member of the Event Department',
    org: 'Big Steps Organization',
    role: 'Volunteer / Events',
    date: 'Nov 2018 - Dec 2020 · 2 yrs 2 mos',
    summary:
      'Contributed to organizing and supporting community-driven volunteer events across education, environment, and social impact initiatives.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Big Steps Organization (BSO – Tinh nguyen tre) is a volunteer-driven community focused on developing and supporting social impact initiatives across multiple areas, including education, environmental activities, and community support programs for children, youth, the elderly, and underserved communities.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a member of the Event Department, I contributed to organizing and supporting volunteer activities, coordinating event logistics, and participating in community-focused initiatives.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'This experience provided hands-on involvement in planning and executing volunteer events while working closely with a team. It involved collaboration, communication, and adaptability in dynamic environments focused on community impact.',
          ],
        },
        {
          title: 'Skills Developed',
          paragraphs: [
            'Through this role, I strengthened essential soft skills such as teamwork, time management, communication, and coordination, while also gaining exposure to real-world community project execution.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity allowed me to contribute to meaningful community initiatives while developing a stronger sense of responsibility, collaboration, and long-term commitment to social impact.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Participated in organizing and supporting multiple volunteer events',
            'Contributed to community initiatives in education and environmental activities',
            'Collaborated with team members to execute event logistics',
            'Developed teamwork, communication, and time management skills',
          ],
        },
      ],
    }),
    tags: [
      'Volunteer',
      'Community',
      'Non-profit',
      'Event Organization',
      'Social Impact',
      'Teamwork',
    ],
    links: [
      {
        label: 'Details',
        url: 'https://www.facebook.com/Bigstep2017',
      },
    ],
    ...getActivityMedia('big-steps-event-department'),
    featured: false,
  },
  {
    id: 'gdg-devfest-cloud-hcm-2023-logistics-collaborator',
    title: 'Logistics Collaborator – DevFest Cloud HCM 2023',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: '16/12/2023 · 1 day',
    summary:
      'Supported logistics and on-site coordination for DevFest Cloud HCM 2023, ensuring smooth event operations and a seamless experience for attendees and speakers.',
    description: '',
    tags: [
      'Logistics',
      'Event Operations',
      'Google Cloud',
      'DevFest',
      'GDG Cloud HCM',
      'Community',
    ],
    links: [
      {
        label: 'Details',
        url: 'https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-devfest-cloud-hcm-2023/',
      },
    ],
    ...getActivityMedia('devfest-cloud-hcm-2023'),
    featured: false,
  },
  {
    id: 'gdg-google-io-extended-cloud-hcm-2024-logistics-collaborator',
    title: 'Logistics Collaborator – Google I/O Extended Cloud HCM 2024',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: '27/07/2024 · 1 day',
    summary:
      'Supported logistics and on-site coordination for Google I/O Extended Cloud HCM 2024, helping ensure a smooth experience for attendees and the developer community.',
    description: '',
    tags: ['Logistics', 'Event Support', 'Google Cloud', 'GDG Cloud HCM', 'Community'],
    links: [
      {
        label: 'Details',
        url: 'https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-google-io-extended-cloud-hcm-2024/',
      },
    ],
    ...getActivityMedia('google-io-extended-cloud-hcm-2024'),
    featured: false,
  },
  {
    id: 'gdg-build-with-ai-2025-facilitator',
    title: 'Facilitator – Build with AI 2025',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: '10/05/2025 · 1 day',
    summary:
      'Supported attendee check-in and event preparation while assisting participants during the Vertex AI Gemini multi-agent codelab session.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Build with AI 2025 was a community tech event organized by GDG Cloud HCM, bringing developers together to explore hands-on AI tools, cloud platforms, and practical learning experiences.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'I contributed as both a Check-in Collaborator and Codelab Facilitator. I supported attendee check-in, helped prepare event logistics, and assisted participants throughout the hands-on workshop session.',
          ],
        },
        {
          title: 'Facilitator Responsibilities',
          paragraphs: [
            'As a Codelab Facilitator, I supported participants during the hands-on lab.',
            'Codelab: "Vertex AI Gemini Research Multi-Agent Demo - Research Agent for EV Industry" https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/agents/research-multi-agents/intro_research_multi_agents_gemini_2_0.ipynb',
          ],
          bullets: [
            'Helped participants claim Google Cloud Credits',
            'Assisted with troubleshooting during the codelab',
            'Answered questions related to AI tools and workflows',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'This role involved direct on-site support during an offline event in Ho Chi Minh City, including participant coordination, workshop assistance, and collaboration with the organizing team. It provided hands-on experience supporting developers in a real AI-focused learning environment.',
          ],
        },
        {
          title: 'Requirements / Context',
          paragraphs: ['The facilitator role required:'],
          bullets: [
            'Basic knowledge of AI / Machine Learning concepts',
            'Familiarity with Google Cloud and tools such as Gemini and Vertex AI',
            'Strong communication and teamwork skills',
            'Participation in pre-event guidance and preparation sessions',
          ],
        },
        {
          title: 'Impact',
          paragraphs: ['This experience strengthened my:'],
          bullets: [
            'Technical communication skills',
            'Real-time problem-solving ability',
            'Community engagement and collaboration while contributing to a smoother and more effective learning experience for participants.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported attendee check-in and on-site event preparation',
            'Assisted participants in claiming Google Cloud Credits',
            'Helped answer questions and support hands-on workshop execution',
            'Contributed to a developer community AI event organized by GDG Cloud HCM',
          ],
        },
      ],
    }),
    tags: [
      'Facilitator',
      'AI',
      'Vertex AI',
      'Gemini',
      'Google Cloud',
      'Codelab',
      'Developer Community',
    ],
    links: [
      {
        label: 'Details',
        url: 'https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-build-with-ai-2025-ai-in-action/',
      },
    ],
    ...getActivityMedia('build-with-ai-2025'),
    featured: false,
  },
  {
    id: 'gdg-build-with-ai-2026-check-in-collaborator-facilitator',
    title: 'Check-in Collaborator & Facilitator – Build with AI 2026',
    org: 'Google Developer Group - GDG Cloud HCM',
    role: 'Community / Tech',
    date: '18/04/2026 · 1 day',
    summary:
      'Supported attendee check-in and event preparation while also assisting participants during the Build with AI 2026 codelab session.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Build with AI 2026 was a community tech event organized by GDG Cloud HCM, bringing developers together to explore hands-on AI tools, cloud platforms, and practical learning experiences.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'I contributed as both a Check-in Collaborator and Codelab Facilitator. I supported attendee check-in, helped prepare event logistics, and assisted participants throughout the hands-on workshop session.',
          ],
        },
        {
          title: 'Facilitator Responsibilities',
          paragraphs: [
            'As a Codelab Facilitator, I helped participants claim Google Cloud Credits and answered questions during the practical lab. The role required basic knowledge of Google Cloud and familiarity with AI-related tools and concepts to support developers effectively during the workshop. Codelab resource: https://codelabs.developers.google.com/building-with-google-antigravity#0',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'This role involved direct on-site support during an offline event in Ho Chi Minh City, including participant coordination, workshop assistance, and collaboration with the organizing team. It was a valuable opportunity to contribute to a developer community event focused on AI, learning, and hands-on practice.',
          ],
        },
        {
          title: 'Requirements / Context',
          paragraphs: [
            'The facilitator role required basic knowledge or hands-on experience with AI, Machine Learning, or tools such as Gemini, Vertex AI, AI Studio, and NotebookLM. It also required active support for workshop participants, strong communication, teamwork, and readiness to join event guidance sessions before the event.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This experience strengthened my event support, technical communication, and community collaboration skills, while allowing me to help create a smoother and more supportive learning environment for developers attending the workshop.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported attendee check-in and on-site event preparation for Build with AI 2026',
            'Assisted participants in claiming Google Cloud Credits during the codelab session',
            'Helped answer participant questions and provided hands-on workshop support',
            'Contributed to a community AI event organized by GDG Cloud HCM',
          ],
        },
      ],
    }),
    tags: [
      'Volunteer',
      'Community',
      'Google Cloud',
      'AI',
      'Event Support',
      'Workshop',
      'Facilitator',
    ],
    links: [
      {
        label: 'Details',
        url: 'https://gdg.community.dev/events/details/google-gdg-cloud-hcmc-presents-build-with-ai-2026-hands-on-exploration-with-google-ai/',
      },
    ],
    ...getActivityMedia('build-with-ai-2026'),
    featured: false,
  },
  {
    id: 'bcnv-hair-donation-volunteer',
    title: 'Hair Donation Volunteer',
    org: 'Breast Cancer Network Vietnam (BCNV)',
    role: 'Health / Community',
    date: '13/05/2022 · 1 day',
    summary: 'Donated hair to support cancer patients through BCNV.',
    description: '',
    tags: ['Volunteer', 'Community', 'Health', 'Donation'],
    links: [
      {
        label: 'Details',
        url: 'https://www.facebook.com/bcnvietnam',
      },
    ],
    ...getActivityMedia('hair-donation-volunteer'),
    featured: false,
  },
  {
    id: 'blood-donation-volunteer',
    title: 'Blood Donation Volunteer',
    org: 'Blood Donation Organization',
    role: 'Volunteer',
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
    tags: ['Volunteer', 'Community', 'Health', 'Donation'],
    ...getActivityMedia('blood-donation-volunteer'),
    featured: false,
  },
  {
    id: 'entera-countdown-2024-fanszone-volunteer',
    title: 'Fanszone Volunteer - Entera Countdown 2024',
    org: 'Entera Music Festival',
    role: 'Event Volunteer',
    date: 'Dec 2023 · 1 mo',
    summary:
      'Supported fanszone operations for Entera Countdown 2024, helping guide attendees, coordinate activity flow, and keep the festival experience organized and welcoming.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Entera Countdown 2024 was a live music and year-end entertainment event that brought together a large audience for performances, crowd activities, and fan engagement.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a Fanszone Volunteer, I supported attendee guidance, queue coordination, and on-site assistance around the fanszone area. I helped maintain smooth movement, answered participant questions, and supported the event team in keeping the space organized during peak crowd periods.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'Working in a fast-paced event environment required quick communication, attention to detail, and teamwork. The role involved staying responsive to crowd needs while helping preserve a positive and energetic experience for attendees.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity strengthened my coordination, communication, and event support skills, while giving me more practical experience in working with large public events.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported attendee guidance and queue coordination in the fanszone area',
            'Assisted on-site operations during Entera Countdown 2024',
            'Helped maintain an organized and welcoming experience for participants',
            'Strengthened teamwork and communication in a high-energy event environment',
          ],
        },
      ],
    }),
    tags: ['Volunteer', 'Community', 'Event'],
    ...getActivityMedia('entera-countdown-2024-fanszone'),
    featured: false,
  },
  {
    id: 'vpbank-vnexpress-marathon-finish-race-volunteer',
    title: 'Finish Race Volunteer',
    org: 'VPBank VnExpress Marathon Ho Chi Minh City Midnight',
    role: 'Sports Event',
    date: '02/03/2024 - 03/03/2024 · 2 days',
    summary:
      'Supported finish-zone operations during VPBank VnExpress Marathon Ho Chi Minh City Midnight 2024, helping runners complete the race smoothly and safely at the final stage.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'VPBank VnExpress Marathon Ho Chi Minh City Midnight 2024 was a large-scale night running event that brought together runners, organizers, and volunteers in an energetic city race atmosphere.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a Finish Race Volunteer, I supported finish-zone operations by guiding runners, assisting post-race flow, and helping maintain an organized handoff area at the end of the course. The role required attentiveness, quick coordination, and steady support during busy race moments.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'Working at the finish area meant responding to a constant flow of runners completing the race with different levels of fatigue and emotion. It was a fast-paced environment that required teamwork, situational awareness, and a calm approach while contributing to a positive end-of-race experience.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity strengthened my event coordination, teamwork, and on-ground support skills. It was a meaningful opportunity to contribute to a community sports event that celebrated endurance, discipline, and shared energy.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported finish-zone operations for VPBank VnExpress Marathon Ho Chi Minh City Midnight 2024',
            'Assisted runner flow and coordination at the final stage of the race',
            'Contributed to smooth on-ground event operations in a high-energy environment',
            'Participated in a large-scale community marathon event as a volunteer',
          ],
        },
      ],
    }),
    tags: ['Volunteer', 'Community', 'Marathon', 'Sports Event', 'Event Operations'],
    ...getActivityMedia('vpbank-vnexpress-marathon-finish-race'),
    featured: false,
  },
  {
    id: 'run-to-live-water-zone-volunteer',
    title: 'Water Zone Volunteer',
    org: 'Run To Live',
    role: 'Sports Event',
    date: '09/03/2024 - 10/03/2024 · 2 days',
    summary:
      'Supported Water Zone operations during Run To Live Half Marathon 2024, ensuring hydration support and smooth runner experience throughout the race.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Run To Live Half Marathon 2024 marked its first season as a large-scale community running event, bringing together athletes, organizers, and volunteers to create an energetic and memorable race experience.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a Water Zone Volunteer, I supported hydration stations along the race route, ensuring runners received water efficiently and safely during their run. The role required coordination, responsiveness, and high energy throughout the event.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'The success of the first Run To Live season was strongly supported by a passionate volunteer team. Working in a fast-paced environment, I contributed to maintaining smooth operations while directly supporting runners on their journey. The experience was physically engaging, highly interactive, and filled with positive energy from both participants and the organizing team.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity strengthened my ability to work under pressure, collaborate in large-scale events, and contribute to community-driven initiatives. It was a meaningful experience being part of an event that promoted health, endurance, and connection.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported Water Zone operations for Run To Live Half Marathon 2024',
            'Assisted runners with hydration during race execution',
            'Contributed to smooth on-ground coordination in a high-energy environment',
            'Participated in a large-scale community sports event as a volunteer',
          ],
        },
      ],
    }),
    tags: ['Volunteer', 'Community', 'Marathon', 'Sports Event', 'Event Operations'],
    links: [
      {
        label: 'Details',
        url: 'https://www.facebook.com/share/p/1B5ga63DnP/',
      },
    ],
    ...getActivityMedia('run-to-live-water-zone'),
    featured: false,
  },
  {
    id: 'vnexpress-marathon-hcmc-midnight-2026-course-marshal-volunteer',
    title: 'Course Marshal Volunteer',
    org: 'VnExpress Marathon Ho Chi Minh City Midnight 2026',
    role: 'Sports Event',
    date: '21/03/2026 - 22/03/2026 · 2 days',
    summary:
      'Supported course operations during VnExpress Marathon Ho Chi Minh City Midnight 2026, helping guide runners, maintain route order, and contribute to a safe race experience.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'VnExpress Marathon Ho Chi Minh City Midnight 2026 was a large-scale night running event that gathered runners, organizers, and volunteers for an energetic community race across the city.',
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a Course Marshal Volunteer, I supported route guidance, on-ground coordination, and runner direction along the race course. The role focused on helping participants stay on track while supporting smooth movement and safety in active race areas.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'Working on the course required focus, quick communication, and steady coordination in a fast-moving environment. It was a highly engaging experience that combined teamwork, public support, and the shared energy of a large city marathon.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity strengthened my event operations, coordination, and teamwork skills while giving me more practical experience in supporting large-scale community sports events.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported route guidance and on-ground coordination for VnExpress Marathon Ho Chi Minh City Midnight 2026',
            'Helped direct runners and maintain course flow during race execution',
            'Contributed to safe and organized operations in an active marathon environment',
            'Participated in a large-scale community marathon event as a volunteer',
          ],
        },
      ],
    }),
    tags: ['Volunteer', 'Community', 'Marathon', 'Sports Event', 'Event Operations'],
    links: [
      {
        label: 'Details',
        url: 'https://www.facebook.com/share/p/1DfgWPgQqb/',
      },
    ],
    ...getActivityMedia('vnexpress-marathon-hcmc-midnight-2026-course-marshal'),
    featured: false,
  },
  {
    id: 'green-summer-project-member-logistic-department',
    title: 'Member of the Logistic Department',
    org: 'Green Summer Project',
    role: 'Environment',
    date: 'Jun 2019 – Jul 2019',
    summary:
      'Contributed to logistics and on-ground operations for Green Summer Project 2019 in Tay Ninh, supporting environmental activities, community engagement, and project coordination during a 3-day experiential campaign.',
    description: buildActivityDescription({
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Green Summer Project (GSP) is a student-led interprovincial initiative for high school students across Vietnam. In 2019, the program was organized in five locations: Nghe An, Da Nang, Binh Phuoc, Tay Ninh, and Vinh Long, with a shared goal of inspiring young people to take action for the environment.',
          ],
        },
        {
          title: 'Mission',
          paragraphs: [
            "GSP focused on environmental protection through waste reduction, cleaner living spaces, reduced plastic use, recycling, and the promotion of eco-friendly habits. With the message 'I do, you do, and we will make a change,' the project encouraged collective action through small but meaningful everyday choices.",
          ],
        },
        {
          title: 'My Contribution',
          paragraphs: [
            'As a member of the Logistic Department, I supported activity preparation, coordination, and on-site logistics for the Tay Ninh branch. My role helped ensure the project’s environmental and community activities ran smoothly throughout the campaign.',
          ],
        },
        {
          title: 'Highlights / Experience',
          paragraphs: [
            'The 3-day experience was not only about volunteering, but also about directly facing the realities of environmental issues. It involved hands-on cleanup work, exposure to waste and pollution, working under hot weather, and stepping outside everyday comfort zones. The experience made the message of environmental responsibility much more personal and memorable.',
          ],
        },
        {
          title: 'Impact',
          paragraphs: [
            'This activity strengthened my sense of responsibility, teamwork, and community engagement. It also reinforced the belief that meaningful change starts from action, even in small steps.',
          ],
        },
        {
          title: 'Milestones',
          bullets: [
            'Supported logistics and coordination for Green Summer Project 2019 in Tay Ninh',
            'Contributed to environmental and community-focused activities during a 3-day campaign',
            'Participated in hands-on cleanup and awareness efforts promoting greener habits',
            'Strengthened teamwork, responsibility, and community service mindset through real-world volunteering',
          ],
        },
      ],
    }),
    tags: ['Volunteer', 'Community', 'Environment', 'Logistics', 'Youth Project'],
    links: [
      {
        label: 'Details',
        url: 'https://www.facebook.com/greenyouthprojectvn',
      },
    ],
    ...getActivityMedia('green-summer-project-logistic-department'),
    featured: false,
  },
]

export const allActivityTags = Array.from(
  new Set(activities.flatMap((activity) => activity.tags)),
)

export const allActivities = [...activities].sort(compareActivitiesForDisplay)

export const featuredActivities = allActivities.slice(0, 3)
