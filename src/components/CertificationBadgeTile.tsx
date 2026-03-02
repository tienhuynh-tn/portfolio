import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { type CertificationItem } from '../data/certifications'

type CertificationBadgeTileProps = {
  certification: CertificationItem
  onSelect: (certification: CertificationItem) => void
}

function CertificationBadgeTile({
  certification,
  onSelect,
}: CertificationBadgeTileProps) {
  const [certImageOk, setCertImageOk] = useState(Boolean(certification.certBadgeSrc))

  useEffect(() => {
    setCertImageOk(Boolean(certification.certBadgeSrc))
  }, [certification.certBadgeSrc, certification.id])

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
        {certification.certBadgeSrc && certImageOk ? (
          <div className="certificationBadgeCertImageWrap">
            <img
              src={certification.certBadgeSrc}
              alt={`${certification.name} certification badge`}
              width={60}
              height={60}
              className="certificationBadgeCertImage"
              loading="lazy"
              onError={() => setCertImageOk(false)}
            />
          </div>
        ) : null}

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
