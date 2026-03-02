import { ArrowSquareOut } from '@phosphor-icons/react'
import type { CertificationItem } from '../data/certifications'

type CertificationBadgeTileProps = {
  certification: CertificationItem
}

function getBadgeFallback(certification: CertificationItem) {
  if (certification.badgeLabel) {
    return certification.badgeLabel
  }

  const issuerToken = (certification.issuedBy ?? '')
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return issuerToken || certification.name.slice(0, 3).toUpperCase()
}

function CertificationBadgeTile({
  certification,
}: CertificationBadgeTileProps) {
  const badgeFallback = getBadgeFallback(certification)
  const credentialUrl =
    typeof certification.credentialUrl === 'string' &&
    certification.credentialUrl.trim().length > 0
      ? certification.credentialUrl.trim()
      : 'https://www.linkedin.com/in/tienhuynh-tn/'

  return (
    <div className="certificationBadgeTile">
      <a
        href={credentialUrl}
        className="certificationBadgeAction"
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open credential: ${certification.name}`}
      >
        <ArrowSquareOut size={12} weight="regular" aria-hidden="true" />
      </a>

      <span className="certificationBadgeTileInner">
        <span className="certificationBadgeRow">
          <span className="certificationBadgeMark" aria-hidden="true">
            {certification.badgeImage ? (
              <img
                src={certification.badgeImage}
                alt={`${certification.name} badge`}
                width={40}
                height={40}
                className="certificationBadgeImage"
                loading="lazy"
              />
            ) : (
              <span className="certificationBadgeMonogram">{badgeFallback}</span>
            )}
          </span>
        </span>

        <span className="certificationBadgeBody">
          <span className="certificationBadgeTitle">{certification.name}</span>
          <span className="certificationBadgeIssuer">{certification.issuedBy}</span>
          <span className="certificationBadgeIssued">{certification.issuedDate}</span>
        </span>
      </span>
    </div>
  )
}

export default CertificationBadgeTile
