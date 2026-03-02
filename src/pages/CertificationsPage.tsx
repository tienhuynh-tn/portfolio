import { useState } from 'react'
import BackLink from '../components/layout/BackLink'
import Section from '../components/layout/Section'
import CertificationBadgeTile from '../components/CertificationBadgeTile'
import CertificationModal from '../components/certifications/CertificationModal'
import {
  allCertifications,
  type CertificationItem,
} from '../data/certifications'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function CertificationsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedCertification, setSelectedCertification] = useState<CertificationItem | null>(null)

  return (
    <Section id="all-certifications" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <BackLink
          to="/#certifications"
          ariaLabel="Back to certifications section"
        />

        <h1 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          All Certifications
        </h1>

        <div className="skillsIntro certificationsIntro reveal max-w-none">
          <p className="skillsSubtitle whitespace-normal lg:whitespace-nowrap">
            Explore the full credential set across cloud, backend engineering, and delivery platforms.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="certificationBadgeGridCenter">
          <ul className="certificationBadgeGrid" aria-label="All certifications">
            {allCertifications.map((certification, index) => (
              <li
                key={certification.id}
                className="certificationBadgeGridItem reveal"
                style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
              >
                <CertificationBadgeTile
                  certification={certification}
                  onSelect={setSelectedCertification}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedCertification ? (
        <CertificationModal
          certification={selectedCertification}
          onClose={() => setSelectedCertification(null)}
        />
      ) : null}
    </Section>
  )
}

export default CertificationsPage
