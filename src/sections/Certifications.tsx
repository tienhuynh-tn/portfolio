import Section from '../components/layout/Section'
import CertificationBadgeTile from '../components/CertificationBadgeTile'
import { featuredCertifications } from '../data/certifications'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Certifications() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="certifications" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Certifications
        </h2>

        <div className="certificationsContent">
          <div className="skillsIntro certificationsIntro reveal">
            <p className="skillsSubtitle">
              Professional certifications and verified credentials.
            </p>
            <span className="skillsDivider" aria-hidden="true" />
          </div>

          <div className="certificationBadgeGridCenter">
            <ul className="certificationBadgeGrid" aria-label="Certifications">
              {featuredCertifications.map((certification, index) => (
                <li
                  key={certification.id}
                  className="certificationBadgeGridItem reveal"
                  style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
                >
                  <CertificationBadgeTile certification={certification} />
                </li>
              ))}
            </ul>
          </div>

          <div className="certificationsCtaRow reveal">
            <a
              href="/certifications"
              className="cardLink"
              aria-label="View all certifications"
            >
              View all certifications &#8594;
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Certifications
