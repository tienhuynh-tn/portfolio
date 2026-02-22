import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from '@phosphor-icons/react'
import Container from './Container'

const FOOTER_LINKS = [
  {
    href: 'https://www.linkedin.com/in/tienhuynh-tn/',
    label: 'LinkedIn',
    Icon: LinkedinLogo,
  },
  {
    href: 'https://github.com/tienhuynh-tn',
    label: 'GitHub',
    Icon: GithubLogo,
  },
  {
    href: 'mailto:tien.huynhlt.tn@gmail.com',
    label: 'Email',
    Icon: EnvelopeSimple,
  },
] as const

function Footer() {
  return (
    <footer>
      <Container>
        <div className="mt-10 border-t border-[color:var(--border)] pb-2 pt-6">
          <div className="flex items-center justify-center gap-3">
            {FOOTER_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={item.label}
                className="inline-flex h-10 w-10 items-center justify-center text-[color:var(--muted)] transition hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:text-[color:var(--primary)]"
              >
                <item.Icon size={20} weight="regular" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="mt-3 text-center text-sm text-[color:var(--muted)]">
            © 2026 Tien Huynh (Fairy). Built with 💚 using React, TypeScript, Tailwind CSS, and late-night learning + milk tea.
            <br />
            Assisted by ChatGPT &amp; Codex.
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
