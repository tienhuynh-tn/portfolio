import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  getCertificationIssuerText,
  type CertificationItem,
} from '../data/certifications'

type CertificationBadgeTileProps = {
  certification: CertificationItem
  onSelect: (certification: CertificationItem) => void
}

function CertificationBadgeTile({
  certification,
  onSelect,
}: CertificationBadgeTileProps) {
  const [issuerLogoOk, setIssuerLogoOk] = useState(Boolean(certification.issuerLogoSrc))

  useEffect(() => {
    setIssuerLogoOk(Boolean(certification.issuerLogoSrc))
  }, [certification.issuerLogoSrc, certification.id])

  const handleActivate = () => {
    onSelect(certification)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleActivate()
    }
  }

  return (
    <article
      className="certificationBadgeTile certificationBadgeTileTrigger"
      role="button"
      tabIndex={0}
      aria-label={`Open ${certification.name} details`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <div className="certificationBadgeTileInner">
        <div className="certificationBadgeCertImageWrap">
          <div className="certificationBadgeMark">
            {certification.issuerLogoSrc && issuerLogoOk ? (
              <img
                src={certification.issuerLogoSrc}
                alt={`${certification.issuer} logo`}
                width={40}
                height={40}
                className="certificationIssuerLogo"
                loading="lazy"
                onError={() => setIssuerLogoOk(false)}
              />
            ) : (
              <span className="certificationBadgeMonogram">
                {getCertificationIssuerText(certification)}
              </span>
            )}
          </div>
        </div>

        <div className="certificationBadgeBody certTileContent">
          <h3 className="certificationBadgeTitle certTitle">{certification.name}</h3>
          <p className="certificationBadgeIssuer certMeta">{certification.issuer}</p>
          <p className="certificationBadgeIssued certMeta">{`Issued ${certification.issued}`}</p>
        </div>
      </div>
    </article>
  )
}

export default CertificationBadgeTile
