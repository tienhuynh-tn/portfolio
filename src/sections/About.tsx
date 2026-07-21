import {
  Files,
  LightningSlash,
  Pulse,
  UserCircle,
} from '@phosphor-icons/react'
import Section from '../components/layout/Section'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

const TAGS = [
  { label: '3+ Years Experience', Icon: Pulse },
  { label: 'Backend Developer', Icon: Files },
  { label: 'System Design Mindset', Icon: LightningSlash },
  { label: 'Community Sharing', Icon: UserCircle },
] as const

function About() {
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  return (
    <Section id="about" className="pb-6 md:pb-8">
      <div className="reveal" ref={revealRef}>
        <h2 className="mb-7 text-center text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--primary)] to-[color:var(--primary)] sm:text-3xl md:text-4xl">
          About Me
        </h2>

        <article className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 xl:grid-cols-[minmax(0,420px)_minmax(0,760px)_minmax(0,360px)] xl:items-start">
          <div className="contents lg:flex lg:flex-col lg:gap-8 lg:self-start xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:block">
            <div className="order-1 mx-auto w-full max-w-[300px] lg:max-w-[320px] lg:self-center">
              <div className="group relative transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]">
                <div className="rounded-3xl bg-gradient-to-br from-[color:var(--primary)] via-cyan-400/75 to-fuchsia-500/70 p-[3px] shadow-lg shadow-[color:var(--primary)]/15">
                  <div className="rounded-[22px] bg-white/95 p-2 dark:bg-slate-950/88">
                    <img
                      src="https://github.com/tienhuynh-tn.png"
                      alt="Tien Huynh portrait"
                      className="aspect-square w-full rounded-[18px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <span className="absolute -right-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)] text-white shadow-lg ring-2 ring-white/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:animate-bounce dark:ring-slate-900/70">
                  <LightningSlash size={18} weight="regular" aria-hidden="true" />
                </span>

                <span className="absolute -left-3 bottom-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)] text-white shadow-lg ring-2 ring-white/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:animate-pulse dark:ring-slate-900/70">
                  <Pulse size={18} weight="regular" aria-hidden="true" />
                </span>
              </div>
            </div>

            <blockquote className="order-3 mx-auto block w-full overflow-hidden rounded-2xl border border-slate-700/35 bg-slate-900 font-mono text-sm text-slate-100 shadow-sm lg:w-[360px] lg:max-w-[360px] dark:border-slate-700/60 dark:bg-slate-950/95 xl:hidden">
              <div className="h-1 bg-gradient-to-r from-[color:var(--primary)] via-cyan-400/70 to-emerald-400/70" />
              <div className="p-3 lg:p-4">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-slate-400">
                    // QUOTE
                  </div>
                  <p className="text-base leading-6 text-slate-200 lg:text-sm">
                    <span className="text-cyan-300">System.out.println</span>
                    <span className="text-slate-100">(</span>
                    <span className="text-emerald-300">"It’s never too late - never too late to start over, never too late to be happy."</span>
                    <span className="text-slate-100">);</span>
                  </p>
                </div>
              </div>
            </blockquote>
          </div>

          <div className="order-2 flex flex-col gap-5 xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-[color:var(--text-strong)] sm:text-base md:text-lg">
                <span className="text-base font-semibold text-[color:var(--primary)] sm:text-lg md:text-xl">Software Developer</span> with{' '}
                <span className="text-base font-semibold text-[color:var(--primary)] sm:text-lg md:text-xl">3+ years of experience</span> building and maintaining backend
                services that prioritize clarity, stability, and scalability.
              </p>

              <p className="text-sm leading-relaxed text-[color:var(--text-strong)] sm:text-base md:text-lg">
                Comfortable designing APIs, working with{' '}
                <span className="font-semibold text-[color:var(--primary)]">relational and NoSQL databases</span>, and integrating backend systems
                in production environments. I focus on how services evolve over time - making sure they’re easy to maintain, adapt,
                and scale as business needs change.
              </p>
            </div>

            <div className="aboutTagGrid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:[grid-template-columns:repeat(2,minmax(280px,1fr))]">
              {TAGS.map(({ label, Icon }) => (
                <span
                  key={label}
                  className="aboutTag group relative inline-flex w-full min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-3 py-1 pl-6 pr-3 text-xs font-medium sm:px-4 sm:py-2 sm:pl-7 sm:pr-4 sm:text-sm"
                >
                  <span className="aboutTagHole shrink-0" />
                  <Icon
                    size={14}
                    weight="regular"
                    aria-hidden="true"
                    className="aboutTagIcon h-3 w-3 shrink-0 sm:h-4 sm:w-4"
                  />
                  <span className="min-w-0 truncate whitespace-nowrap font-medium xl:overflow-visible xl:text-clip xl:whitespace-nowrap">{label}</span>
                </span>
              ))}
            </div>
          </div>

          <blockquote className="hidden mx-auto w-full overflow-hidden rounded-2xl border border-slate-700/35 bg-slate-900 font-mono text-sm text-slate-100 shadow-sm dark:border-slate-700/60 dark:bg-slate-950/95 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:block xl:max-w-[360px] xl:justify-self-end">
            <div className="h-1 bg-gradient-to-r from-[color:var(--primary)] via-cyan-400/70 to-emerald-400/70" />
            <div className="p-4 xl:p-5">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-slate-400">
                  // QUOTE
                </div>
                <p className="text-base leading-6 text-slate-200 xl:text-sm">
                  <span className="text-cyan-300">System.out.println</span>
                  <span className="text-slate-100">(</span>
                  <span className="text-emerald-300">"It’s never too late - never too late to start over, never too late to be happy."</span>
                  <span className="text-slate-100">);</span>
                </p>
              </div>
            </div>
          </blockquote>
        </article>
      </div>
    </Section>
  )
}

export default About
