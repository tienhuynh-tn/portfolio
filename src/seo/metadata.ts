export const SITE_URL = 'https://tienhuynh-tn.com'

export const pages = {
  '/': {
    title: 'Tien Huynh | Software Developer — Java, Spring Boot & AWS',
    description: 'Explore Tien Huynh’s software projects, Java and Spring Boot experience, cloud certifications, and community activities. Connect for opportunities and collaboration.',
  },
  '/projects/': {
    title: 'Software Projects | Tien Huynh',
    description: 'Explore Tien Huynh’s software development projects, technologies, and contributions, with project details and links to learn more.',
  },
  '/certifications/': {
    title: 'Certifications & Credentials | Tien Huynh',
    description: 'Browse Tien Huynh’s professional certifications and credentials, including cloud and software development qualifications with supporting evidence.',
  },
  '/activities/': {
    title: 'Community & Activities | Tien Huynh',
    description: 'Discover Tien Huynh’s community involvement, volunteering, and activities beyond software development, with stories and photos.',
  },
}

export function getMetadata(pathname: string) {
  const path = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`
  const canonicalPath = path === '/credentials/' ? '/certifications/' : path
  const page = pages[canonicalPath as keyof typeof pages]
  return page
    ? { ...page, canonical: `${SITE_URL}${canonicalPath}`, indexable: true }
    : { title: 'Page Not Found | Tien Huynh', description: 'This page could not be found. Explore Tien Huynh’s portfolio.', canonical: undefined, indexable: false }
}

export const profile = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: `${SITE_URL}/`,
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Tien Huynh',
    alternateName: 'Fairy',
    jobTitle: 'Software Developer',
    url: `${SITE_URL}/`,
    sameAs: ['https://github.com/tienhuynh-tn', 'https://www.linkedin.com/in/tienhuynh-tn/'],
  },
}
