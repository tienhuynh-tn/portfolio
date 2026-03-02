import type { ProjectCategory } from '../../data/projects'

type ProjectFiltersProps = {
  categories: ProjectCategory[]
  activeCategory: ProjectCategory | 'All'
  searchValue: string
  resultCount: number
  onCategoryChange: (category: ProjectCategory | 'All') => void
  onSearchChange: (value: string) => void
}

function ProjectFilters({
  categories,
  activeCategory,
  searchValue,
  resultCount,
  onCategoryChange,
  onSearchChange,
}: ProjectFiltersProps) {
  return (
    <section className="projectFiltersPanel reveal" aria-label="Project filters">
      <div className="projectFiltersTopRow">
        <label className="projectSearchField">
          <span className="activityFilterLabel">Search projects</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="projectSearchInput"
            placeholder="Search by title or tech"
            aria-label="Search projects by title or tech"
          />
        </label>
      </div>

      <div className="projectCategoryRow" role="group" aria-label="Filter projects by category">
        <button
          type="button"
          className={`projectCategoryFilter ${activeCategory === 'All' ? 'is-active' : ''}`.trim()}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`projectCategoryFilter ${activeCategory === category ? 'is-active' : ''}`.trim()}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="activityResultsCount" aria-live="polite">
        {resultCount} project{resultCount === 1 ? '' : 's'}
      </p>
    </section>
  )
}

export default ProjectFilters
