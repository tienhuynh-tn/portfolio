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

        <ol className="experienceCenterTimeline" aria-label="Professional experience timeline">
          {experienceItems.map((item, index) => (
            <li
              key={item.id}
              className={`experienceCenterItem experienceCenterItem--${index % 2 === 0 ? 'left' : 'right'} reveal`}
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <div className="experienceCenterRail" aria-hidden="true">
                <span className="experienceCenterNode">
                  <span className="experienceCenterNodeInner" />
                </span>
              </div>

              <article
                className="skillsGroup experienceCenterCard"
                aria-labelledby={`${item.id}-title`}
                aria-label={`${item.role} at ${item.company}`}
              >
                <div className="skillsGroupInner experienceCenterCardInner">
                  <div className="experienceCenterMeta">
                    <p className="itemMeta experienceCompany">{item.company}</p>
                    <div className="experienceMetaRow">
                      <span className="itemDates">{item.period}</span>
                      {item.location ? (
                        <span className="experienceLocation">{item.location}</span>
                      ) : null}
                    </div>
                  </div>

                  <h3 id={`${item.id}-title`} className="itemTitle">
                    {item.role}
                  </h3>

                  <ul className="skillsBadges experienceTechList" aria-label={`${item.role} technology stack`}>
                    {item.tech.map((tech) => (
                      <li key={tech} className="skillBadge">
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

export default Experience
