import type { ReactNode } from 'react'

type TagBadgeProps = {
  label: string
  icon?: ReactNode
  className?: string
}

function TagBadge({ label, icon, className }: TagBadgeProps) {
  return (
    <li className={`skillBadge tagBadge${className ? ` ${className}` : ''}`}>
      {icon}
      <span>{label}</span>
    </li>
  )
}

export default TagBadge
