import { useMemo, useState } from 'react'
import ActivityCard from '../components/activities/ActivityCard'
import ActivityModal from '../components/activities/ActivityModal'
import BackLink from '../components/layout/BackLink'
import Section from '../components/layout/Section'
import {
  allActivities,
  type ActivityItem,
} from '../data/activities'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function ActivitiesPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

  const visibleActivities = useMemo(() => allActivities, [])

  return (
    <Section id="all-activities" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <BackLink
          to="/#activities"
          ariaLabel="Back to activities section"
        />

        <h1 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          All Activities
        </h1>

        <div className="skillsIntro certificationsIntro reveal max-w-none">
          <p className="skillsSubtitle whitespace-normal lg:whitespace-nowrap">
            Volunteer, community, speaking, and competition highlights beyond core project work.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        {visibleActivities.length ? (
          <ul className="activityCardsGrid activityCardsGridAll" aria-label="All activities">
            {visibleActivities.map((activity, index) => (
              <li
                key={activity.id}
                className="certificationGridItem activityGridItem reveal"
                style={{ ['--reveal-delay' as string]: `${index * 50}ms` }}
              >
                <ActivityCard activity={activity} onSelect={setSelectedActivity} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="activityEmptyState reveal">
            <h2 className="itemTitle">No activities available right now.</h2>
            <p className="cardDesc">
              Check back later for more updates.
            </p>
          </div>
        )}
      </div>

      {selectedActivity ? (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      ) : null}
    </Section>
  )
}

export default ActivitiesPage
