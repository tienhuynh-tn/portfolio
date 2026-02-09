import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import Section from '../components/layout/Section'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

type ContactFormState = {
  fullName: string
  email: string
  subject: string
  message: string
}

const INITIAL_STATE: ContactFormState = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
}

function Contact() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_STATE)
  const [submittedEmpty, setSubmittedEmpty] = useState(false)

  const isComplete = useMemo(
    () =>
      Object.values(formState)
        .map((value) => value.trim())
        .every(Boolean),
    [formState]
  )

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (submittedEmpty) setSubmittedEmpty(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isComplete) {
      setSubmittedEmpty(true)
      return
    }

    const body = `Name: ${formState.fullName}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    const mailto = `mailto:tien.huynhlt.tn@gmail.com?subject=${encodeURIComponent(
      formState.subject
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
  }

  return (
    <Section id="contact" className="pb-0">
      <div className="reveal" ref={revealRef}>
        <h2 className="mb-8 text-center text-5xl font-bold tracking-tight text-[color:var(--primary)]">
          Get in touch
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[color:var(--text)]">
                Let’s work together
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-[color:var(--muted)]">
                I’d love to learn about your goals and see how I can help turn
                ideas into reliable, well-crafted products. Whether you’re
                planning a new build, refining an existing system, or just
                exploring options, feel free to reach out.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="group flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--primary)]">
                  <EnvelopeSimple size={20} weight="regular" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-[color:var(--muted)]">
                    Email
                  </span>
                  <a
                    href="mailto:tien.huynhlt.tn@gmail.com"
                    className="font-semibold text-[color:var(--primary)] hover:opacity-90 focus-visible:outline-none focus-visible:text-[color:var(--primary)]"
                  >
                    tien.huynhlt.tn@gmail.com
                  </a>
                </div>
              </div>

              <div className="group flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--primary)]">
                  <MapPin size={20} weight="regular" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-[color:var(--muted)]">
                    Location
                  </span>
                  <span className="font-semibold text-[color:var(--text)]">
                    Ho Chi Minh, Vietnam
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-2xl border-2 border-[color:var(--primary)] bg-transparent p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="font-semibold text-[color:var(--text)]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  placeholder="Your full name"
                  value={formState.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-[color:var(--text)]">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  placeholder="you@email.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="font-semibold text-[color:var(--text)]">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                placeholder="Project collaboration"
                value={formState.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-semibold text-[color:var(--text)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="min-h-[160px] resize-y rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                placeholder="Tell me about your project or say hello."
                value={formState.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isComplete}
              onClick={() => setSubmittedEmpty(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] px-4 py-2 font-semibold text-white transition hover:opacity-95 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Send Message</span>
              <PaperPlaneTilt
                size={20}
                weight="regular"
                aria-hidden="true"
                className="text-current"
              />
            </button>

            <p className="text-sm text-[color:var(--muted)]" aria-live="polite">
              {!isComplete && submittedEmpty
                ? 'Please fill in all fields to enable sending.'
                : 'Your message will open in your email client.'}
            </p>
          </form>
        </div>

        <div className="mt-10 border-t border-[color:var(--border)] pt-6 pb-2">
          <div className="flex items-center justify-center gap-3">
            {[
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
            ].map((item) => (
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
            © 2026 Tien Huynh (Fairy). Built with 💚 using React, TypeScript,
            Tailwind CSS, and late-night learning + milk tea.
            <br />
            Assisted by ChatGPT &amp; Codex.
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Contact
