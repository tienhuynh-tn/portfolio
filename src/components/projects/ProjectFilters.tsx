import { FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type ProjectSortOption = 'newest' | 'oldest' | 'az'

type ProjectFiltersProps = {
  tags: string[]
  activeTags: string[]
  searchValue: string
  sortValue: ProjectSortOption
  resultCount: number
  onTagsChange: (tags: string[]) => void
  onSearchChange: (value: string) => void
  onSortChange: (sort: ProjectSortOption) => void
}

function ProjectFilters({
  tags,
  activeTags,
  searchValue,
  sortValue,
  resultCount,
  onTagsChange,
  onSearchChange,
  onSortChange,
}: ProjectFiltersProps) {
  const [openPopover, setOpenPopover] = useState<'search' | 'filter' | null>(null)
  const [tagSearchValue, setTagSearchValue] = useState('')
  const containerRef = useRef<HTMLElement | null>(null)
  const hasActiveFilters = activeTags.length > 0 || searchValue.trim().length > 0
  const resultLabel = `${resultCount} project${resultCount === 1 ? '' : 's'}`
  const visibleTags = useMemo(() => {
    const normalizedQuery = tagSearchValue.trim().toLowerCase()

    if (!normalizedQuery) return tags

    return tags.filter((tag) => tag.toLowerCase().includes(normalizedQuery))
  }, [tagSearchValue, tags])

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
    onTagsChange([])
    onSearchChange('')
    setTagSearchValue('')
  }

  const toggleTag = (tag: string) => {
    onTagsChange(
      activeTags.includes(tag)
        ? activeTags.filter((activeTag) => activeTag !== tag)
        : [...activeTags, tag],
    )
  }

  return (
    <section
      ref={containerRef}
      className="listingFilter reveal"
      aria-label="Project filters"
    >
      <div className="listingFilterTopRow">
        <p className="listingFilterCount" aria-live="polite">
          <span>Showing:</span>
          <strong>{resultLabel}</strong>
        </p>

        <div className="listingFilterActions">
          <label className="listingFilterSort">
            <span className="sr-only">Sort projects</span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value as ProjectSortOption)}
              className="listingFilterSortSelect"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
            </select>
          </label>

          <button
            type="button"
            className={`listingFilterIconButton ${activeTags.length > 0 || openPopover === 'filter' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'filter' ? null : 'filter'))}
            aria-label="Filter projects"
            aria-expanded={openPopover === 'filter'}
          >
            <FunnelSimple size={16} weight="bold" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`listingFilterIconButton ${searchValue.trim() || openPopover === 'search' ? 'is-active' : ''}`.trim()}
            onClick={() => setOpenPopover((current) => (current === 'search' ? null : 'search'))}
            aria-label="Search projects"
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
                placeholder="Search title, organization, role, or tech"
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
            <span className="listingFilterControl">
              <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
              <input
                type="search"
                value={tagSearchValue}
                onChange={(event) => setTagSearchValue(event.target.value)}
                className="listingFilterInput"
                placeholder="Type to search tags"
              />
            </span>
          </label>

          <div
            className="listingFilterOptionList"
            role="listbox"
            aria-label="Project tags"
            aria-multiselectable="true"
          >
            <button
              type="button"
              className={`listingFilterOptionButton ${activeTags.length === 0 ? 'is-active' : ''}`.trim()}
              onClick={() => onTagsChange([])}
              role="option"
              aria-selected={activeTags.length === 0}
            >
              <span>All tags</span>
            </button>

            {visibleTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`listingFilterOptionButton ${activeTags.includes(tag) ? 'is-active' : ''}`.trim()}
                onClick={() => toggleTag(tag)}
                role="option"
              aria-selected={activeTags.includes(tag)}
            >
              <span>{tag}</span>
            </button>
          ))}

            {!visibleTags.length ? (
              <p className="listingFilterEmptyOption">No tags found.</p>
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

export default ProjectFilters
