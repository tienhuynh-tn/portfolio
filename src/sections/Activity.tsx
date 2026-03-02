import { useState } from 'react'
import { Link } from 'react-router-dom'
import ActivityCard from '../components/activities/ActivityCard'
import ActivityModal from '../components/activities/ActivityModal'
import Section from '../components/layout/Section'
import { featuredActivities, type ActivityItem } from '../data/activities'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Activity() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

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

        <ul className="activityCardsGrid" aria-label="Featured activities">
          {featuredActivities.map((activity, index) => (
            <li
              key={activity.id}
              className="certificationGridItem activityGridItem reveal"
              style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
            >
              <ActivityCard activity={activity} onSelect={setSelectedActivity} />
            </li>
          ))}
        </ul>

        <div className="certificationsCtaRow reveal">
          <Link to="/activities" className="cardLink" aria-label="View all activities">
            View all activities &#8594;
          </Link>
        </div>
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

export default Activity
