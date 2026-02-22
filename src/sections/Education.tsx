import Section from '../components/layout/Section'
import { educationItems } from '../data/education'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Education() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="education" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Education
        </h2>

        <div className="skillsIntro reveal">
          <p className="skillsSubtitle">Academic background and formal education milestones.</p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="experienceTimeline">
          {educationItems.map((item, index) => (
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
                  </div>

                  <h3 className="itemTitle">{item.degree}</h3>
                  <p className="itemMeta">{item.institution}</p>

                  {item.description ? (
                    <ul className="bullets experienceBullets">
                      <li>{item.description}</li>
                    </ul>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default Education
