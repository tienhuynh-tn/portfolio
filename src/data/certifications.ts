import googleAiCertificate from '../assets/certificates/google-ai.jpeg'
import cloudDeveloperCertificate from '../assets/certificates/cloud-developer.pdf'
import microservicesWithSpringCertificate from '../assets/certificates/microservices-with-spring.jpg'

export type CertificationItem = {
  id: string
  name: string
  issuer: string
  issued: string
  url?: string | null
  badgeText: string
  issuerLogoSrc?: string
  certBadgeSrc?: string
  certDetailImageSrc?: string
  summary?: string
  fullDescription?: string
  tags?: string[]
}

const GOOGLE_LOGO =
  'https://storage.googleapis.com/pe-portal-consumer-prod-wagtail-static/images/GoogleG_FullColor_White_RGB_1.width-1440.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=wagtail%40pe-portal-consumer-prod.iam.gserviceaccount.com%2F20260428%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260428T081645Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=9af6543ae2fffbd142c9a4bdf66f509c2bfd487e37bd2c65215a8ae62cec7beb7a078ea613ee786b0a917af9a28313bfe826dad77bc630161fb6a1b6bae4af368fcb8f6dec556d8d3067afbb5161c6ef9b7a09939688f49b8a502cae247ca96d79b973d59e08096ab7ef45406632e5290fd3148c8533f163ac54b301b8cfb290885cda10765791259ef2655accfb97c2a0ebfd8ba11df7755d77077415c98b543b41b54b7733c0fc7c0f18f46d14dddb6b0a86a6e1d2a32d276f92309e1880df6f5196332dadac3e1a4cef2762505b19288aef5c1b4df6664e5825ea2948e6869bab1be59a10ddf0ecb53b5d5729b5930c31e43c11715ce6734bbff8ac9f814e'
const UDACITY_LOGO = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Udacity_logo.png'
const UDEMY_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/1280px-Udemy_logo.svg.png'

export const allCertifications: CertificationItem[] = [
  {
    id: 'google-ai-professional-certificate',
    name: 'Google AI Professional Certificate',
    issuer: 'Google',
    issued: 'Mar 3, 2026',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/NMZFS6X6E4QZ',
    badgeText: 'AI',
    issuerLogoSrc: GOOGLE_LOGO,
    certBadgeSrc: googleAiCertificate,
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
    issued: '09/08/2024',
    url: null,
    badgeText: 'SB',
    issuerLogoSrc: UDEMY_LOGO,
    certBadgeSrc: microservicesWithSpringCertificate,
    certDetailImageSrc: microservicesWithSpringCertificate,
    summary:
      'Completed a Udemy course focused on building microservices using Spring Boot and Spring Cloud.',
    fullDescription:
      'This certificate verifies completion of the course "[NEW] Building Microservices with Spring Boot & Spring Cloud" on 09/08/2024. The course covered microservices development with Spring Boot and Spring Cloud, as validated by Udemy.',
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

  return certification.issuer
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 4)
    .toUpperCase()
}
