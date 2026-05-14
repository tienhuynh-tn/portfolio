import { FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type CertificationSortOption = 'newest' | 'oldest' | 'az'

type CertificationFiltersProps = {
  issuers: string[]
  activeIssuers: string[]
  searchValue: string
  sortValue: CertificationSortOption
  resultCount: number
  onIssuersChange: (issuers: string[]) => void
  onSearchChange: (value: string) => void
  onSortChange: (sort: CertificationSortOption) => void
}

function CertificationFilters({
  issuers,
  activeIssuers,
  searchValue,
  sortValue,
  resultCount,
  onIssuersChange,
  onSearchChange,
  onSortChange,
}: CertificationFiltersProps) {
  const [openPopover, setOpenPopover] = useState<'search' | 'filter' | null>(null)
  const [issuerSearchValue, setIssuerSearchValue] = useState('')
  const containerRef = useRef<HTMLElement | null>(null)
  const hasActiveFilters = activeIssuers.length > 0 || searchValue.trim().length > 0
  const resultLabel = `${resultCount} certification${resultCount === 1 ? '' : 's'}`
  const visibleIssuers = useMemo(() => {
    const normalizedQuery = issuerSearchValue.trim().toLowerCase()

    if (!normalizedQuery) return issuers

    return issuers.filter((issuer) => issuer.toLowerCase().includes(normalizedQuery))
  }, [issuerSearchValue, issuers])

  useEffect(() => {
    if (!openPopover) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenPopover(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [openPopover])

  const resetFilters = () => {
    onIssuersChange([])
    onSearchChange('')
    setIssuerSearchValue('')
  }

  const toggleIssuer = (issuer: string) => {
    onIssuersChange(
      activeIssuers.includes(issuer)
        ? activeIssuers.filter((activeIssuer) => activeIssuer !== issuer)
        : [...activeIssuers, issuer],
    )
  }

  return (
    <section
      ref={containerRef}
      className="listingFilter reveal"
      aria-label="Certification filters"
    >
      <div className="listingFilterTopRow">
        <p className="listingFilterCount" aria-live="polite">
          <span>Showing:</span>
          <strong>{resultLabel}</strong>
        </p>

        <div className="listingFilterActions">
          <label className="listingFilterSort">
            <span className="sr-only">Sort certifications</span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value as CertificationSortOption)}
              className="listingFilterSortSelect"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
            </select>
          </label>

          <button
            type="button"
            className={`listingFilterIconButton ${activeIssuers.length > 0 || openPopover === 'filter' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'filter' ? null : 'filter'))}
            aria-label="Filter certifications"
            aria-expanded={openPopover === 'filter'}
          >
            <FunnelSimple size={16} weight="bold" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`listingFilterIconButton ${searchValue.trim() || openPopover === 'search' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'search' ? null : 'search'))}
            aria-label="Search certifications"
            aria-expanded={openPopover === 'search'}
          >
            <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      {openPopover === 'search' ? (
        <div className="listingFilterPopover listingFilterPopoverSearch">
          <label className="listingFilterField">
            <span className="activityFilterLabel">Search</span>
            <span className="listingFilterControl">
              <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="listingFilterInput"
                placeholder="Search title, issuer, or skill"
              />
            </span>
          </label>

          {hasActiveFilters ? (
            <button type="button" className="listingFilterReset" onClick={resetFilters}>
              <X size={14} weight="bold" aria-hidden="true" />
              <span>Clear filters</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {openPopover === 'filter' ? (
        <div className="listingFilterPopover listingFilterPopoverFilter">
          <label className="listingFilterField">
            <span className="activityFilterLabel">Issuer</span>
            <span className="listingFilterControl">
              <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
              <input
                type="search"
                value={issuerSearchValue}
                onChange={(event) => setIssuerSearchValue(event.target.value)}
                className="listingFilterInput"
                placeholder="Type to search issuers"
              />
            </span>
          </label>

          <div
            className="listingFilterOptionList"
            role="listbox"
            aria-label="Certification issuers"
            aria-multiselectable="true"
          >
            <button
              type="button"
              className={`listingFilterOptionButton ${activeIssuers.length === 0 ? 'is-active' : ''}`.trim()}
              onClick={() => onIssuersChange([])}
              role="option"
              aria-selected={activeIssuers.length === 0}
            >
              <span>All issuers</span>
            </button>

            {visibleIssuers.map((issuer) => (
              <button
                key={issuer}
                type="button"
                className={`listingFilterOptionButton ${activeIssuers.includes(issuer) ? 'is-active' : ''}`.trim()}
                onClick={() => toggleIssuer(issuer)}
                role="option"
                aria-selected={activeIssuers.includes(issuer)}
              >
                <span>{issuer}</span>
              </button>
            ))}

            {!visibleIssuers.length ? (
              <p className="listingFilterEmptyOption">No issuers found.</p>
            ) : null}
          </div>

          {hasActiveFilters ? (
            <button type="button" className="listingFilterReset" onClick={resetFilters}>
              <X size={14} weight="bold" aria-hidden="true" />
              <span>Clear filters</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default CertificationFilters
