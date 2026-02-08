import ScrollToTop from '../components/layout/ScrollToTop'
import { ArrowSquareOut } from '@phosphor-icons/react'
import Section from '../components/layout/Section'
import { allActivities } from '../data/activities'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function ActivitiesPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <>
      <main>
        <Section id="all-activities" className="skillsSection">
          <div className="skillsBody" ref={revealRef}>
            <h2 className="mb-8 text-center text-5xl font-bold tracking-tight text-[color:var(--primary)] reveal">
              All Activities
            </h2>

            <div className="skillsIntro certificationsIntro reveal">
              <p className="skillsSubtitle">
                Volunteer, community, and competition highlights beyond core work.
              </p>
              <span className="skillsDivider" aria-hidden="true" />
            </div>

            <ul className="certificationsGrid" aria-label="All activities">
              {allActivities.map((activity, index) => (
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
          </div>
        </Section>
      </main>
      <ScrollToTop />
    </>
  )
}

export default ActivitiesPage
