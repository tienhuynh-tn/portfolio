import ScrollToTop from '../components/layout/ScrollToTop'
import { ArrowSquareOut } from '@phosphor-icons/react'
import Section from '../components/layout/Section'
import { allCertifications } from '../data/certifications'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

function CertificationsPage() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <>
      <main>
        <Section id="all-certifications" className="skillsSection">
          <div className="skillsBody" ref={revealRef}>
            <h2 className="mb-8 text-center text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[color:var(--primary)] reveal">
              All Certifications
            </h2>

            <div className="certificationsContent">
              <div className="skillsIntro certificationsIntro reveal">
                <p className="skillsSubtitle">
                  Complete list of active certifications and issued credentials.
                </p>
                <span className="skillsDivider" aria-hidden="true" />
              </div>

              <ul className="certificationsGrid" aria-label="All certifications">
                {allCertifications.map((certification, index) => (
                  (() => {
                    const normalizedCredentialUrl =
                      typeof certification.credentialUrl === 'string' &&
                      certification.credentialUrl.trim().length > 0
                        ? certification.credentialUrl.trim()
                        : undefined
                    const metaParts = [
                      certification.issuedBy?.trim(),
                      certification.issuedDate?.trim(),
                    ].filter((part): part is string => Boolean(part))
                    const metaText = metaParts.join(' · ')

                    return (
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
                                {metaText}
                              </p>
                            </div>
                          </div>

                          {normalizedCredentialUrl ? (
                            <a
                              href={normalizedCredentialUrl}
                              className="cardLink certificationInlineLink"
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label={`Show credential for ${certification.name}`}
                            >
                              <span>Show credential</span>
                              <ArrowSquareOut size={14} weight="regular" aria-hidden="true" />
                            </a>
                          ) : null}
                        </div>
                      </li>
                    )
                  })()
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </main>
      <ScrollToTop />
    </>
  )
}

export default CertificationsPage
