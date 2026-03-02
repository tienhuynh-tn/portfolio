type BulletListProps = {
  items: string[]
  className?: string
}

function BulletList({ items, className = '' }: BulletListProps) {
  return (
    <ul className={`space-y-2.5 ${className}`.trim()}>
      {items.map((item) => {
        const separatorIndex = item.indexOf(': ')
        if (separatorIndex > 0) {
          const heading = item.slice(0, separatorIndex)
          const body = item.slice(separatorIndex + 2)

          return (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:color-mix(in_srgb,var(--muted)_72%,transparent)]"
              />
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                <strong className="text-[color:var(--text-strong)]">{heading}:</strong> {body}
              </p>
            </li>
          )
        }

        return (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:color-mix(in_srgb,var(--muted)_72%,transparent)]"
            />
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              {item}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export default BulletList
