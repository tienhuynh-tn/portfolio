import Section from '../components/layout/Section'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { featuredCertifications } from '../data/certifications'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function Certifications() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="certifications" className="skillsSection">
      <div className="skillsBody" ref={revealRef}>
        <h2 className="mb-8 text-center text-5xl font-bold tracking-tight text-[color:var(--primary)] reveal">
          Certifications
        </h2>

        <div className="certificationsContent">
          <div className="skillsIntro certificationsIntro reveal">
            <p className="skillsSubtitle">
              Professional certifications and verified credentials.
            </p>
            <span className="skillsDivider" aria-hidden="true" />
          </div>

          <ul className="certificationsGrid" aria-label="Certifications">
            {featuredCertifications.map((certification, index) => (
              <li
                key={certification.id}
                className="certificationGridItem reveal"
                style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
              >
                <div className="certificationCardInner">
                  <div className="certificationLinkedMetaWrap">
                    {certification.issuerLogo ? (
                      <img
                        src={certification.issuerLogo}
                        alt=""
                        width={24}
                        height={24}
                        className="certificationIssuerLogo"
                        loading="lazy"
                      />
                    ) : null}
                    <div>
                      <h3 className="certificationLinkedName">
                        {certification.name}
                      </h3>
                      <p className="itemMeta certificationLinkedMeta">
                        {certification.issuedBy} · {certification.issuedDate}
                      </p>
                    </div>
                  </div>

                  <a
                    href={certification.credentialUrl}
                    className="cardLink certificationInlineLink"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Show credential for ${certification.name}`}
                  >
                    <span>Show credential</span>
                    <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>

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
