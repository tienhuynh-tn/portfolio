import { Link } from 'react-router-dom'

type BackLinkProps = {
  to: string
  ariaLabel: string
}

function BackLink({ to, ariaLabel }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="cardLink certificationsBackLink reveal"
      aria-label={ariaLabel}
    >
      ← Back
    </Link>
  )
}

export default BackLink
