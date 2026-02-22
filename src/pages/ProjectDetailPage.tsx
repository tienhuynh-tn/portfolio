import { Link, useParams } from 'react-router-dom'
import Section from '../components/layout/Section'
import { getProjectBySlug } from '../data/projects'

function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <Section id="project-not-found" className="skillsSection pt-[var(--navbar-height)]">
        <div className="skillsBody">
          <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-[color:var(--primary)] sm:text-3xl md:text-4xl">
            Project not found
          </h1>
          <p className="skillsSubtitle">The project you requested does not exist.</p>
          <Link to="/projects" className="cardLink inline-block mt-4">
            ← All projects
          </Link>
        </div>
      </Section>
    )
  }

  const links = [
    { label: 'Live', href: project.links.live },
    { label: 'Source', href: project.links.source },
    { label: 'Case Study', href: project.links.caseStudy },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

  return (
    <Section id="project-detail" className="skillsSection pt-[var(--navbar-height)]">
      <div className="skillsBody">
        <Link to="/projects" className="cardLink inline-block mb-5">
          ← All projects
        </Link>

        <article className="skillsGroup">
          <div className="skillsGroupInner">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-[color:var(--primary)] sm:text-3xl md:text-4xl">
              {project.title}
            </h1>

            <ul className="skillsBadges" aria-label={`${project.title} technology stack`}>
              {project.tech.map((tech) => (
                <li key={tech} className="skillBadge">
                  <span>{tech}</span>
                </li>
              ))}
            </ul>

            <img
              src={project.coverImage}
              alt={`${project.title} cover`}
              className="w-full rounded-xl object-cover"
              loading="lazy"
            />

            <div className="space-y-3">
              {project.longDesc.map((paragraph) => (
                <p key={paragraph} className="cardDesc">
                  {paragraph}
                </p>
              ))}
            </div>

            {project.role ? (
              <div>
                <h2 className="itemTitle">Role</h2>
                <p className="cardDesc">{project.role}</p>
              </div>
            ) : null}

            <div>
              <h2 className="itemTitle">Highlights</h2>
              <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-strong)]">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {project.architecture?.length ? (
              <div>
                <h2 className="itemTitle">Architecture</h2>
                <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-strong)]">
                  {project.architecture.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.outcomes?.length ? (
              <div>
                <h2 className="itemTitle">Outcomes</h2>
                <ul className="list-disc space-y-2 pl-5 text-[color:var(--text-strong)]">
                  {project.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {links.length ? (
              <div className="cardLinks">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="cardLink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </Section>
  )
}

export default ProjectDetailPage
