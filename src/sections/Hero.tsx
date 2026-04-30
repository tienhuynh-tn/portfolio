import {
  ArrowDown,
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import Section from '../components/layout/Section'

const RESUME_PATH = `${import.meta.env.BASE_URL}resume.pdf`
const GITHUB_URL = 'https://github.com/tienhuynh-tn'
const LINKEDIN_URL = 'https://www.linkedin.com/in/tienhuynh-tn/'

const TAGLINE = '3+ years • Java • Spring Boot • SQL • AWS'
const DISPLAY_NAME = 'Tien Huynh (Fairy)'
const HOVER_PALETTE = ['#2563EB', '#06B6D4', '#7C3AED', '#10B981', '#F59E0B']

function Hero() {
  const [hoverColors, setHoverColors] = useState<Record<number, string>>({})
  const leaveTimeoutsRef = useRef<Record<number, number>>({})

  const pickRandomHoverColor = () =>
    HOVER_PALETTE[Math.floor(Math.random() * HOVER_PALETTE.length)]

  const handleCharMouseEnter = (index: number) => {
    const timeoutId = leaveTimeoutsRef.current[index]
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      delete leaveTimeoutsRef.current[index]
    }

    setHoverColors((prev) =>
      prev[index] ? prev : { ...prev, [index]: pickRandomHoverColor() }
    )
  }

  const handleCharMouseLeave = (index: number) => {
    const timeoutId = window.setTimeout(() => {
      setHoverColors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      delete leaveTimeoutsRef.current[index]
    }, 160)

    leaveTimeoutsRef.current[index] = timeoutId
  }

  useEffect(() => {
    const timeouts = leaveTimeoutsRef.current
    return () => {
      Object.values(timeouts).forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    }
  }, [])

  return (
    <Section id="home" variant="hero" className="touch-pan-y">
      <div className="relative isolate overflow-hidden touch-pan-y">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[color:var(--primary)]/10 blur-3xl sm:h-80 sm:w-80" />

        <div className="homeAnchor mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <p className="inline-flex items-center rounded-full border border-[color:var(--border)] px-4 py-1.5 text-sm font-medium text-[color:var(--muted)]">
            {TAGLINE}
          </p>

          <div className="space-y-3">
            <p className="mb-2 text-2xl font-semibold tracking-wide text-[color:var(--muted)] md:text-3xl">
              Hi, I&apos;m
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-none text-[color:var(--text)] sm:text-5xl md:text-6xl">
              {DISPLAY_NAME.split('').map((char, index) => (
                char === ' ' ? (
                  <span key={`space-${index}`} className="inline-block w-[0.3em]" aria-hidden="true">
                    &nbsp;
                  </span>
                ) : (
                  <span
                    key={`${char}-${index}`}
                    className={`inline-block origin-bottom [will-change:transform] transition-transform transition-colors ease-out ${
                      hoverColors[index]
                        ? '-translate-y-0.5 scale-[1.25] duration-150'
                        : 'translate-y-0 scale-100 duration-700'
                    }`}
                    onMouseEnter={() => handleCharMouseEnter(index)}
                    onMouseLeave={() => handleCharMouseLeave(index)}
                    style={
                      hoverColors[index]
                        ? { color: hoverColors[index] }
                        : undefined
                    }
                  >
                    {char}
                  </span>
                )
              ))}
            </h1>
            <h2 className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--text)] bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
              Senior Java Backend Developer
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            A developer who loves building things that stay simple as they grow
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-transparent bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[color:var(--primary)] hover:text-white hover:shadow-lg active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 sm:px-6 sm:py-3 sm:text-base"
            >
              View Projects
            </a>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[color:var(--text)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-600/60 hover:text-[color:var(--primary)] hover:shadow-lg active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 dark:hover:border-blue-400/60 sm:px-6 sm:py-3 sm:text-base"
            >
              View Resume
            </a>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)]/90 text-[color:var(--muted)] transition hover:scale-105 hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              <GithubLogo size={20} weight="regular" aria-hidden="true" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)]/90 text-[color:var(--muted)] transition hover:scale-105 hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              <LinkedinLogo size={20} weight="regular" aria-hidden="true" />
            </a>
            <a
              href="mailto:tien.huynhlt.tn@gmail.com"
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)]/90 text-[color:var(--muted)] transition hover:scale-105 hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              <EnvelopeSimple size={20} weight="regular" aria-hidden="true" />
            </a>
          </div>

          <a
            href="#about"
            aria-label="Scroll to About"
            className="pointer-events-auto mt-4 inline-flex items-center justify-center rounded-full p-2 text-[color:var(--muted)] transition hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          >
            <ArrowDown
              size={22}
              weight="regular"
              aria-hidden="true"
              className="animate-bounce"
            />
          </a>
        </div>
      </div>
    </Section>
  )
}

export default Hero
