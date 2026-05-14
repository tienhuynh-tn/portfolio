import { useMemo, useState } from 'react'
import BackLink from '../components/layout/BackLink'
import Section from '../components/layout/Section'
import CertificationBadgeTile from '../components/CertificationBadgeTile'
import CertificationFilters, {
  type CertificationSortOption,
} from '../components/certifications/CertificationFilters'
import CertificationModal from '../components/certifications/CertificationModal'
import {
  allCertifications,
  type CertificationItem,
} from '../data/certifications'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function getCertificationSortTime(issued: string) {
  const timestamp = Date.parse(issued)

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function CertificationsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedCertification, setSelectedCertification] = useState<CertificationItem | null>(null)
  const [activeIssuers, setActiveIssuers] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState<CertificationSortOption>('newest')
  const certificationIssuers = useMemo(
    () => Array.from(new Set(allCertifications.map((certification) => certification.issuer))).sort(),
    [],
  )
  const filteredCertifications = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()

    return [...allCertifications
      .filter((certification) => {
        const tags = certification.tags ?? []
        const matchesIssuers =
          activeIssuers.length === 0 || activeIssuers.includes(certification.issuer)
        const matchesSearch =
          normalizedQuery.length === 0 ||
          certification.name.toLowerCase().includes(normalizedQuery) ||
          certification.issuer.toLowerCase().includes(normalizedQuery) ||
          certification.issued.toLowerCase().includes(normalizedQuery) ||
          certification.summary?.toLowerCase().includes(normalizedQuery) ||
          certification.fullDescription?.toLowerCase().includes(normalizedQuery) ||
          tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))

        return matchesIssuers && matchesSearch
      })]
      .sort((left, right) => {
        if (sortValue === 'az') {
          return left.name.localeCompare(right.name)
        }

        const leftTime = getCertificationSortTime(left.issued)
        const rightTime = getCertificationSortTime(right.issued)

        if (leftTime === rightTime) {
          return left.name.localeCompare(right.name)
        }

        return sortValue === 'newest' ? rightTime - leftTime : leftTime - rightTime
      })
  }, [activeIssuers, searchValue, sortValue])

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

        <div className="certificationsPageContent">
          <div className="skillsIntro certificationsIntro reveal max-w-none">
            <p className="skillsSubtitle whitespace-normal lg:whitespace-nowrap">
              Explore the full credential set across cloud, backend engineering, and delivery platforms.
            </p>
            <span className="skillsDivider" aria-hidden="true" />
          </div>

          <CertificationFilters
            issuers={certificationIssuers}
            activeIssuers={activeIssuers}
            searchValue={searchValue}
            sortValue={sortValue}
            resultCount={filteredCertifications.length}
            onIssuersChange={setActiveIssuers}
            onSearchChange={setSearchValue}
            onSortChange={setSortValue}
          />

          <div className="certificationBadgeGridCenter">
            <ul
              className="certificationBadgeGrid certificationBadgeGridAll"
              aria-label="All certifications"
            >
              {filteredCertifications.map((certification, index) => (
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

          {!filteredCertifications.length ? (
            <div className="activityEmptyState reveal">
              <h2 className="itemTitle">No matching certifications found.</h2>
              <p className="cardDesc">
                Try a different issuer or search term.
              </p>
            </div>
          ) : null}
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
