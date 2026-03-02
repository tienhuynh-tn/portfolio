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

        <ol className="educationTimeline" aria-label="Education timeline">
          {educationItems.map((item, index) => (
            <li
              key={item.id}
              className={`educationTimelineItem educationTimelineItem--${index % 2 === 0 ? 'left' : 'right'} reveal`}
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <div className="educationTimelineRail" aria-hidden="true">
                <span className="milestoneDot" />
              </div>

              <article
                className="skillsGroup educationCard"
                aria-labelledby={`${item.id}-title`}
                aria-label={`${item.degree} at ${item.institution}`}
              >
                <div className="skillsGroupInner educationCardInner">
                  <p className="itemMeta educationInstitution">{item.institution}</p>
                  <div className="experienceMetaRow educationMetaRow">
                    <span className="itemDates">{item.period}</span>
                    {item.grade ? <span className="educationGrade">{item.grade}</span> : null}
                  </div>

                  <h3 id={`${item.id}-title`} className="itemTitle">
                    {item.degree}
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

export default Education
