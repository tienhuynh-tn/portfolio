import Section from '../components/layout/Section'
import { featuredCredentials } from '../data/credentials'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Credentials() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="credentials" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
          Certifications &amp; Awards
        </h2>

        <div className="skillsIntro reveal">
          <p className="skillsSubtitle">
            Selected credentials and recognitions.
          </p>
          <span className="skillsDivider" aria-hidden="true" />
        </div>

        <div className="credentialsListShell reveal">
          <ul className="credentialsList" aria-label="Top certifications and awards">
            {featuredCredentials.map((credential) => (
              <li key={credential.id} className="credentialItemBlock">
                <h3 className="itemTitle credentialTitle">{credential.name}</h3>
                <p className="itemMeta credentialMeta">
                  {credential.issuer} · {credential.year}
                </p>
              </li>
            ))}
          </ul>

          <div className="ctaRow credentialsCta">
            <a
              href="/credentials"
              className="btn btnSecondary"
              aria-label="View all certifications and awards"
            >
              View all certifications &amp; awards
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Credentials
