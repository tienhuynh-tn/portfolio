import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import SmartImage from './shared/SmartImage'
import {
  getCertificationIssuerText,
  type CertificationItem,
} from '../data/certifications'

type CertificationBadgeTileProps = {
  certification: CertificationItem
  onSelect: (certification: CertificationItem) => void
  listingIndex?: number
}

function CertificationBadgeTile({
  certification,
  onSelect,
  listingIndex,
}: CertificationBadgeTileProps) {
  const [failedIssuerLogoIds, setFailedIssuerLogoIds] = useState<string[]>([])
  const issuerLogoOk =
    Boolean(certification.issuerLogoSrc) && !failedIssuerLogoIds.includes(certification.id)

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
              <SmartImage
                src={certification.issuerLogoSrc}
                alt={`${certification.issuer} logo`}
                width={40}
                height={40}
                className="certificationIssuerLogo"
                loading="lazy"
                priority={listingIndex === 0}
                eagerWhen={listingIndex === 1 ? '(min-width: 587px)' : listingIndex === 2 ? '(min-width: 892px)' : listingIndex === 3 ? '(min-width: 1196px)' : undefined}
                sizes="30px"
                onError={() =>
                  setFailedIssuerLogoIds((current) =>
                    current.includes(certification.id)
                      ? current
                      : [...current, certification.id],
                  )
                }
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
