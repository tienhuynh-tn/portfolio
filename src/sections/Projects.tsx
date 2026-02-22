import Section from '../components/layout/Section'
import ProjectCard from '../components/projects/ProjectCard'
import { featuredProjects } from '../data/projects'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Projects() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="projects" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Projects
        </h2>

        <div className="skillsIntro reveal">
          <p className="skillsSubtitle">
            A few highlights of what I&apos;ve built recently.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="projectsGrid">
          {featuredProjects.slice(0, 3).map((project, index) => (
            <div
              key={project.id}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="reveal">
          <a href="/projects" className="cardLink" aria-label="View all projects">
            View all projects →
          </a>
        </div>
      </div>
    </Section>
  )
}

export default Projects
