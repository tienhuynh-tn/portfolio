import Section from '../components/layout/Section'
import ProjectCard from '../components/projects/ProjectCard'
import { allProjects } from '../data/projects'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function ProjectsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="all-projects" className="skillsSection pt-[var(--navbar-height)]">
      <div className="skillsBody" ref={revealRef}>
        <h1 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          All Projects
        </h1>

        <div className="skillsIntro reveal">
          <p className="skillsSubtitle">
            Featured work first, followed by additional projects across backend,
            data, and frontend delivery.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="projectsGrid">
          {allProjects.map((project, index) => (
            <div
              key={project.slug}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default ProjectsPage
