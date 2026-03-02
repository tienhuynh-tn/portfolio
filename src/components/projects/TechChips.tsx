type TechChipsProps = {
  tech: string[]
  label: string
  className?: string
}

function TechChips({ tech, label, className = '' }: TechChipsProps) {
  return (
    <ul className={`skillsBadges ${className}`.trim()} aria-label={label}>
      {tech.map((item) => (
        <li key={item} className="skillBadge">
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default TechChips
