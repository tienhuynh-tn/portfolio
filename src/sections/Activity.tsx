import Section from '../components/layout/Section'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { featuredActivities } from '../data/activities'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Activity() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="activities" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Activities
        </h2>

        <div className="skillsIntro certificationsIntro reveal">
          <p className="skillsSubtitle">
            Community impact, competitions, and extracurricular contributions.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <ul className="certificationsGrid" aria-label="Featured activities">
          {featuredActivities.map((activity, index) => (
            <li
              key={activity.id}
              className="certificationGridItem activityGridItem reveal"
              style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
            >
              <div className="certificationCardInner activityCardInner">
                {activity.imageUrl ? (
                  <img
                    src={activity.imageUrl}
                    alt={`${activity.title} activity`}
                    className="activityCardImage"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="activityCardImagePlaceholder"
                    role="img"
                    aria-label={`${activity.title} activity placeholder`}
                  />
                )}

                <div className="activityCardContent">
                  <h3 className="certificationLinkedName">{activity.title}</h3>
                  <p className="itemMeta certificationLinkedMeta">
                    {activity.orgEvent} · {activity.role}
                  </p>
                  <p className="itemDates activityDates">{activity.dateRange}</p>
                  {activity.description ? (
                    <p className="itemMeta activityDescription">{activity.description}</p>
                  ) : null}
                </div>

                <ul className="skillsBadges" aria-label={`${activity.title} tags`}>
                  {activity.tags.slice(0, 4).map((tag) => (
                    <li key={tag} className="skillBadge">
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>

                <div className="activityLinks">
                  {activity.links?.details ? (
                    <a
                      href={activity.links.details}
                      className="cardLink certificationInlineLink"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span>Details</span>
                      <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                    </a>
                  ) : null}
                  {activity.links?.proof ? (
                    <a
                      href={activity.links.proof}
                      className="cardLink certificationInlineLink"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span>Proof</span>
                      <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="certificationsCtaRow reveal">
          <a href="/activities" className="cardLink" aria-label="View all activities">
            View all activities &#8594;
          </a>
        </div>
      </div>
    </Section>
  )
}

export default Activity
