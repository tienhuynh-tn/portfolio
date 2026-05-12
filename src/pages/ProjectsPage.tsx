import { useMemo, useState } from 'react'
import BackLink from '../components/layout/BackLink'
import Section from '../components/layout/Section'
import ProjectModal from '../components/projects/ProjectModal'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFilters, { type ProjectSortOption } from '../components/projects/ProjectFilters'
import { allProjects, PROJECT_CATEGORIES, type Project, type ProjectCategory } from '../data/projects'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

const PROJECT_MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

function getProjectSortTime(timeframe: string) {
  const [startText = '', endText = ''] = timeframe.split(/\s+[–-]\s+/)
  const sortText = (endText || startText).trim()

  if (sortText.toLowerCase() === 'present') {
    return Number.MAX_SAFE_INTEGER
  }

  const [monthText = '', yearText = ''] = sortText.split(/\s+/)
  const month = PROJECT_MONTH_INDEX[monthText.slice(0, 3).toLowerCase()] ?? 0
  const year = Number.parseInt(yearText, 10)

  if (Number.isNaN(year)) return 0

  return Date.UTC(year, month, 1)
}

function ProjectsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All')
  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState<ProjectSortOption>('newest')

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()

    return [...allProjects
      .filter((project) => {
        const matchesCategory = activeCategory === 'All' || project.category === activeCategory
        const matchesSearch =
          normalizedQuery.length === 0 ||
          project.title.toLowerCase().includes(normalizedQuery) ||
          project.org.toLowerCase().includes(normalizedQuery) ||
          project.role.toLowerCase().includes(normalizedQuery) ||
          project.category.toLowerCase().includes(normalizedQuery) ||
          project.tagline.toLowerCase().includes(normalizedQuery) ||
          project.tech.some((item) => item.toLowerCase().includes(normalizedQuery))

        return matchesCategory && matchesSearch
      })]
      .sort((left, right) => {
        if (sortValue === 'az') {
          return left.title.localeCompare(right.title)
        }

        const leftTime = getProjectSortTime(left.timeframe)
        const rightTime = getProjectSortTime(right.timeframe)

        if (leftTime === rightTime) {
          return left.title.localeCompare(right.title)
        }

        return sortValue === 'newest' ? rightTime - leftTime : leftTime - rightTime
      })
  }, [activeCategory, searchValue, sortValue])

  return (
    <Section id="all-projects" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <BackLink
          to="/#projects"
          ariaLabel="Back to projects section"
        />

        <h1 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          All Projects
        </h1>

        <div className="skillsIntro reveal max-w-none">
          <p className="skillsSubtitle whitespace-normal lg:whitespace-nowrap">
            Explore all projects by category or search by title and technology stack.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <ProjectFilters
          categories={PROJECT_CATEGORIES}
          activeCategory={activeCategory}
          searchValue={searchValue}
          sortValue={sortValue}
          resultCount={filteredProjects.length}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchValue}
          onSortChange={setSortValue}
        />

        <div className="projectsGrid">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <ProjectCard project={project} onSelect={setSelectedProject} />
            </div>
          ))}
        </div>

        {!filteredProjects.length ? (
          <div className="activityEmptyState reveal">
            <h2 className="itemTitle">No matching projects found.</h2>
            <p className="cardDesc">
              Try a different category or search term.
            </p>
          </div>
        ) : null}
      </div>

      {selectedProject ? (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </Section>
  )
}

export default ProjectsPage
