type BulletListProps = {
  items: string[]
  className?: string
}

function renderTextWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)

  return parts.map((part, index) => {
    if (!part) return null

    if (/^https?:\/\/[^\s)]+$/.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="detailModalInlineLink"
        >
          {part}
        </a>
      )
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
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
            <li key={item} className="detailModalBulletItem">
              <span
                aria-hidden="true"
                className="detailModalBulletDot"
              />
              <p className="detailModalBodyText text-sm leading-6 text-[color:var(--muted)]">
                <strong className="text-[color:var(--text-strong)]">{heading}:</strong>{' '}
                {renderTextWithLinks(body)}
              </p>
            </li>
          )
        }

        return (
          <li key={item} className="detailModalBulletItem">
            <span
              aria-hidden="true"
              className="detailModalBulletDot"
            />
            <p className="detailModalBodyText text-sm leading-6 text-[color:var(--muted)]">
              {renderTextWithLinks(item)}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export default BulletList
