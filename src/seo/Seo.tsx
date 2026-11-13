import { useLocation } from 'react-router-dom'
import { getMetadata, profile, SITE_URL } from './metadata'

export default function Seo() {
  const { pathname } = useLocation()
  const metadata = getMetadata(pathname)
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={metadata.indexable ? 'index, follow' : 'noindex, follow'} />
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tien Huynh" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      {metadata.canonical && <meta property="og:url" content={metadata.canonical} />}
      <meta property="og:image" content={`${SITE_URL}/social-card.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Tien Huynh — Software Developer. Projects, certifications and community." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={`${SITE_URL}/social-card.png`} />
      {pathname === '/' && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, '\\u003c') }} />}
    </>
  )
}
