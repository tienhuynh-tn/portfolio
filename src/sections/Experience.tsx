import Section from '../components/layout/Section'
import { experienceItems } from '../data/experience'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Experience() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="experience" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Experience
        </h2>

        <div className="skillsIntro reveal">
          <p className="skillsSubtitle">A timeline of roles and key milestones.</p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="experienceTimeline">
          {experienceItems.map((item, index) => (
            <article
              key={item.id}
              className="experienceMilestone reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <span className="experienceNode" aria-hidden="true" />

              <div className="skillsGroup experienceCard">
                <div className="skillsGroupInner experienceCardInner">
                  <div className="experienceMetaRow">
                    <span className="itemDates">{item.period}</span>
                    {item.location ? (
                      <span className="experienceLocation">{item.location}</span>
                    ) : null}
                  </div>

                  <h3 className="itemTitle">{item.role}</h3>
                  <p className="itemMeta">{item.company}</p>

                  <ul className="bullets experienceBullets">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>

                  <ul className="skillsBadges" aria-label={`${item.role} technology stack`}>
                    {item.tech.map((tech) => (
                      <li key={tech} className="skillBadge">
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default Experience
