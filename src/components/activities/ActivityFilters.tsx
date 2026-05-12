import { FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { ActivityTag } from '../../data/activities'

export type ActivitySortOption = 'newest' | 'oldest' | 'az'

type ActivityFiltersProps = {
  tags: ActivityTag[]
  activeTag: ActivityTag | 'All'
  searchValue: string
  sortValue: ActivitySortOption
  resultCount: number
  onTagChange: (tag: ActivityTag | 'All') => void
  onSearchChange: (value: string) => void
  onSortChange: (sort: ActivitySortOption) => void
}

function ActivityFilters({
  tags,
  activeTag,
  searchValue,
  sortValue,
  resultCount,
  onTagChange,
  onSearchChange,
  onSortChange,
}: ActivityFiltersProps) {
  const [openPopover, setOpenPopover] = useState<'search' | 'filter' | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const hasActiveFilters = activeTag !== 'All' || searchValue.trim().length > 0
  const resultLabel = `${resultCount} activit${resultCount === 1 ? 'y' : 'ies'}`

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
    onTagChange('All')
    onSearchChange('')
  }

  return (
    <section
      ref={containerRef}
      className="listingFilter reveal"
      aria-label="Activity filters"
    >
      <div className="listingFilterTopRow">
        <p className="listingFilterCount" aria-live="polite">
          <span>Showing:</span>
          <strong>{resultLabel}</strong>
        </p>

        <div className="listingFilterActions">
          <label className="listingFilterSort">
            <span className="sr-only">Sort activities</span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value as ActivitySortOption)}
              className="listingFilterSortSelect"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
            </select>
          </label>

          <button
            type="button"
            className={`listingFilterIconButton ${activeTag !== 'All' || openPopover === 'filter' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'filter' ? null : 'filter'))}
            aria-label="Filter activities"
            aria-expanded={openPopover === 'filter'}
          >
            <FunnelSimple size={16} weight="bold" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`listingFilterIconButton ${searchValue.trim() || openPopover === 'search' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'search' ? null : 'search'))}
            aria-label="Search activities"
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
                placeholder="Search title, role, organization, or tag"
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
            <span className="activityFilterLabel">Tag</span>
            <span className="listingFilterControl listingFilterSelectControl">
              <FunnelSimple size={16} weight="bold" aria-hidden="true" />
              <select
                value={activeTag}
                onChange={(event) => onTagChange(event.target.value as ActivityTag | 'All')}
                className="listingFilterSelect"
              >
                <option value="All">All tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
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
    </section>
  )
}

export default ActivityFilters
