import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectModal from '../components/projects/ProjectModal'
import Section from '../components/layout/Section'
import ProjectCard from '../components/projects/ProjectCard'
import { projects, type Project } from '../data/projects'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Projects() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const featuredProjects = projects.filter((project) => project.featured)

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
          {featuredProjects.map((project, index) => (
            <div
              key={project.slug}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <ProjectCard project={project} onSelect={setSelectedProject} />
            </div>
          ))}
        </div>

        <div className="reveal">
          <Link to="/projects" className="cardLink" aria-label="View all projects">
            View all projects →
          </Link>
        </div>
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

export default Projects
