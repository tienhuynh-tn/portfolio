import googleAiCertificate from '../assets/certificates/google-ai.jpeg'
import cloudDeveloperCertificate from '../assets/certificates/cloud-developer.pdf'
import microservicesWithSpringCertificate from '../assets/certificates/microservices-with-spring.jpg'
import vibeCodingEssentialsCertificate from '../assets/certificates/vibe-coding-essentials.pdf'

export type CertificationItem = {
  id: string
  name: string
  issuer: string
  issued: string
  url?: string | null
  badgeText: string
  issuerLogoSrc?: string
  certDetailImageSrc?: string
  summary?: string
  fullDescription?: string
  tags?: string[]
}

const GOOGLE_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png'
const COURSERA_LOGO =
  'https://images.ctfassets.net/00atxywtfxvd/2QeS5ysKMhZ3ZjiU2rGRJA/e15df94b265053ce8ded4f5e630241c8/cropped-android-chrome-512x512-1.png'
const UDACITY_LOGO = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Udacity_logo.png'
const UDEMY_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/1280px-Udemy_logo.svg.png'

export const allCertifications: CertificationItem[] = [
  {
    id: 'vibe-coding-essentials-build-apps-with-ai',
    name: 'Vibe Coding Essentials - Build Apps with AI',
    issuer: 'Coursera / Scrimba',
    issued: 'May 14, 2026',
    url: 'https://coursera.org/verify/specialization/HIY5H9B1UEWA',
    badgeText: 'AI',
    issuerLogoSrc: COURSERA_LOGO,
    certDetailImageSrc: vibeCodingEssentialsCertificate,
    summary:
      'Completed the Coursera specialization from Scrimba covering practical AI-assisted app building workflows.',
    fullDescription:
      'This 5-course specialization covered vibe coding with Cursor AI, GitHub Copilot, Claude Code, Model Context Protocol (MCP), and AI-assisted software development fundamentals.',
    tags: [
      'AI',
      'Vibe Coding',
      'Cursor AI',
      'GitHub Copilot',
      'Claude Code',
      'MCP',
    ],
  },
  {
    id: 'google-ai-professional-certificate',
    name: 'Google AI Professional Certificate',
    issuer: 'Google',
    issued: 'Mar 3, 2026',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/NMZFS6X6E4QZ',
    badgeText: 'AI',
    issuerLogoSrc: GOOGLE_LOGO,
    certDetailImageSrc: googleAiCertificate,
    summary:
      'Completed the Google AI Professional Certificate, demonstrating practical AI skills across brainstorming, research, communication, content creation, data analysis, and coding.',
    fullDescription:
      'Those who earn the Google AI Professional Certificate are fluent in AI and have completed 7 courses demonstrating their ability to apply AI to the skills where AI is transforming work: brainstorming, research, communication, content creation, data analysis, and coding. This certificate includes building a portfolio of 20+ artifacts using AI and vibe coding a custom AI solution, while practicing effective prompting, output evaluation, and responsible AI usage for real workplace challenges.',
    tags: [
      'AI',
      'Google AI',
      'Prompt Engineering',
      'Productivity',
      'Data Analysis',
      'Coding',
    ],
  },
  {
    id: 'cloud-developer-nanodegree',
    name: 'Cloud Developer Nanodegree',
    issuer: 'Udacity',
    issued: 'October 16, 2024',
    url: 'https://www.udacity.com/certificate/e/d3fe2a48-34f9-11ef-bf25-bf301fdbae61',
    badgeText: 'UD',
    issuerLogoSrc: UDACITY_LOGO,
    certDetailImageSrc: cloudDeveloperCertificate,
    summary:
      'Completed the Udacity Cloud Developer Nanodegree, focused on cloud-native application development and deployment.',
    fullDescription:
      'Verified Certificate of Nanodegree Program Completion awarded by Udacity for the Cloud Developer program. Udacity confirmed participation and completion of this program.',
    tags: [
      'Cloud Development',
      'Cloud Native',
      'Backend',
      'Deployment',
      'Udacity',
    ],
  },
  {
    id: 'building-microservices-spring-boot-spring-cloud',
    name: 'Building Microservices with Spring Boot & Spring Cloud',
    issuer: 'Udemy',
    issued: 'September 8, 2024',
    url: 'https://www.udemy.com/certificate/UC-cbb3f5b2-225c-40c9-b69d-1f28c9c2d938/',
    badgeText: 'SB',
    issuerLogoSrc: UDEMY_LOGO,
    certDetailImageSrc: microservicesWithSpringCertificate,
    summary:
      'Completed a Udemy course focused on building microservices using Spring Boot and Spring Cloud.',
    fullDescription:
      'This certificate verifies completion of the course "[NEW] Building Microservices with Spring Boot & Spring Cloud" on September 8, 2024. The course covered microservices development with Spring Boot and Spring Cloud, as validated by Udemy.',
    tags: [
      'Java',
      'Spring Boot',
      'Spring Cloud',
      'Microservices',
      'Backend',
    ],
  },
]

export const featuredCertifications = allCertifications

export function getCertificationBadgeText(certification: CertificationItem) {
  return certification.badgeText || certification.name.slice(0, 3).toUpperCase()
}

export function getCertificationIssuerText(certification: CertificationItem) {
  const normalizedIssuer = certification.issuer.trim().toLowerCase()

  if (normalizedIssuer === 'oracle') return 'ORA'
  if (normalizedIssuer === 'amazon web services') return 'AWS'
  if (normalizedIssuer === 'google') return 'GGL'
  if (normalizedIssuer === 'google cloud') return 'GCP'
  if (normalizedIssuer === 'docker') return 'DOC'
  if (normalizedIssuer === 'cloud native computing foundation') return 'CNCF'
  if (normalizedIssuer === 'github') return 'GH'
  if (normalizedIssuer === 'microsoft') return 'MS'
  if (normalizedIssuer === 'coursera / scrimba') return 'CS'

  return certification.issuer
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 4)
    .toUpperCase()
}
