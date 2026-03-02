import { useMemo, useState } from 'react'
import BackLink from '../components/layout/BackLink'
import Section from '../components/layout/Section'
import ProjectModal from '../components/projects/ProjectModal'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFilters from '../components/projects/ProjectFilters'
import { allProjects, PROJECT_CATEGORIES, type Project, type ProjectCategory } from '../data/projects'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function ProjectsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All')
  const [searchValue, setSearchValue] = useState('')

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()

    return allProjects.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory
      const matchesSearch =
        normalizedQuery.length === 0 ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.tech.some((item) => item.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchValue])

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
          resultCount={filteredProjects.length}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchValue}
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
