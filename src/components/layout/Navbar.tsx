import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { List } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS, type NavItemId } from '../../app/navItems'
import ThemeToggle from './ThemeToggle'

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
}

type SectionMetrics = {
  ratio: number
  top: number
  isIntersecting: boolean
}

const HASH_ACTIVE_IDS = new Set<NavItemId>([
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
])

function getRouteActiveId(pathname: string, hash: string): NavItemId {
  if (pathname.startsWith('/certifications') || pathname.startsWith('/credentials')) {
    return 'certifications'
  }

  if (pathname.startsWith('/projects')) {
    return 'projects'
  }

  if (pathname.startsWith('/activities')) {
    return 'activities'
  }

  if (pathname === '/') {
    const hashId = hash.replace('#', '') as NavItemId
    if (HASH_ACTIVE_IDS.has(hashId)) {
      return hashId
    }
  }

  return 'home'
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<NavItemId>(() =>
    getRouteActiveId(location.pathname, location.hash),
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef(0)
  const ignoreObserverUntilRef = useRef(0)
  const rafIdRef = useRef(0)
  const lockTimeoutRef = useRef<number | null>(null)
  const metricsRef = useRef<Map<NavItemId, SectionMetrics>>(new Map())

  const sectionOrder = useMemo(() => {
    const order = new Map<NavItemId, number>()
    NAV_ITEMS.forEach((item, index) => order.set(item.id, index))
    return order
  }, [])

  const getNavTarget = (id: NavItemId) => {
    if (id === 'home') return '/'
    return `/#${id}`
  }

  useEffect(() => {
    if (location.pathname !== '/') return

    const sections = NAV_ITEMS.map((item) => {
      const element = document.getElementById(item.id)
      return element ? { id: item.id, element } : null
    }).filter(Boolean) as Array<{ id: NavItemId; element: HTMLElement }>

    if (sections.length === 0) return

    metricsRef.current = new Map(
      sections.map((section) => [
        section.id,
        { ratio: 0, top: Number.POSITIVE_INFINITY, isIntersecting: false },
      ])
    )

    const pickFromObserver = (): NavItemId | null => {
      const candidates = NAV_ITEMS.map((item) => {
        const metric = metricsRef.current.get(item.id)
        return {
          id: item.id,
          ratio: metric?.ratio ?? 0,
          top: metric?.top ?? Number.POSITIVE_INFINITY,
          isIntersecting: metric?.isIntersecting ?? false,
        }
      }).filter((entry) => entry.isIntersecting && entry.ratio > 0)

      if (candidates.length === 0) return null

      candidates.sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio

        const aTop = Math.abs(a.top)
        const bTop = Math.abs(b.top)
        if (aTop !== bTop) return aTop - bTop

        return (sectionOrder.get(a.id) ?? 0) - (sectionOrder.get(b.id) ?? 0)
      })

      return candidates[0].id
    }

    const runFallback = () => {
      if (performance.now() < ignoreObserverUntilRef.current) return

      if (window.scrollY <= 4) {
        setActiveId('home')
        return
      }

      const viewportBottom = window.scrollY + window.innerHeight
      const documentBottom = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
      if (viewportBottom >= documentBottom - 2) {
        setActiveId('contact')
        return
      }

      const headerHeight = navRef.current?.getBoundingClientRect().height ?? 96
      const spyLine = headerHeight + 20

      let activeCandidate: NavItemId = 'home'
      sections.forEach((section) => {
        if (section.element.getBoundingClientRect().top <= spyLine) {
          activeCandidate = section.id
        }
      })

      setActiveId(activeCandidate)
    }

    const scheduleFallback = () => {
      if (rafIdRef.current) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = 0
        runFallback()
      })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id as NavItemId
        metricsRef.current.set(id, {
          ratio: entry.intersectionRatio,
          top: entry.boundingClientRect.top,
          isIntersecting: entry.isIntersecting,
        })
      })

      if (performance.now() < ignoreObserverUntilRef.current) return

      const nextActive = pickFromObserver()
      if (nextActive) {
        setActiveId(nextActive)
      } else {
        scheduleFallback()
      }
    }, OBSERVER_OPTIONS)

    sections.forEach((section) => observer.observe(section.element))
    window.addEventListener('scroll', scheduleFallback, { passive: true })
    window.addEventListener('resize', scheduleFallback)
    scheduleFallback()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleFallback)
      window.removeEventListener('resize', scheduleFallback)
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = 0
      }
      if (lockTimeoutRef.current !== null) {
        window.clearTimeout(lockTimeoutRef.current)
        lockTimeoutRef.current = null
      }
    }
  }, [location.pathname, sectionOrder])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1199px)')
    const updateCollapsed = (event?: MediaQueryListEvent) => {
      setIsCollapsed(event ? event.matches : media.matches)
    }

    updateCollapsed()
    media.addEventListener('change', updateCollapsed)

    return () => {
      media.removeEventListener('change', updateCollapsed)
    }
  }, [])

  useEffect(() => {
    const threshold = 12

    const handleScrollDirection = () => {
      const currentY = window.scrollY
      const lastY = lastScrollYRef.current

      if (currentY <= 10) {
        setIsNavbarVisible(true)
        lastScrollYRef.current = currentY
        return
      }

      if (currentY > lastY + threshold) {
        setIsNavbarVisible(false)
      } else if (currentY < lastY - threshold) {
        setIsNavbarVisible(true)
      }

      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', handleScrollDirection, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScrollDirection)
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: NavItemId
  ) => {
    event.preventDefault()
    setIsMobileMenuOpen(false)
    setActiveId(id === 'projects' ? 'projects' : id)

    if (id === 'home' && location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (
      id !== 'home' &&
      location.pathname === '/' &&
      location.hash === `#${id}`
    ) {
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    navigate(getNavTarget(id))
  }

  const handleBrandClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setActiveId('home')
    setIsMobileMenuOpen(false)
    if (location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate('/')
  }

  const visibleActiveId =
    location.pathname === '/'
      ? activeId
      : getRouteActiveId(location.pathname, location.hash)
  const activeItem = NAV_ITEMS.find((item) => item.id === visibleActiveId) ?? NAV_ITEMS[0]
  const ActiveIcon = activeItem.Icon

  return (
    <header
      ref={navRef}
      className={`navbar ${isNavbarVisible ? 'navbar--visible' : 'navbar--hidden'}`}
    >
      <div className="container navbarShell flex items-center gap-3 py-2">
        <a
          href="/"
          onClick={handleBrandClick}
          className="navBrand shrink-0"
          aria-label="Go to Home"
        >
          <span className="brandMark">&lt;/&gt;</span>
          <span className="brandName hidden md:inline">Tien Huynh</span>
        </a>

        {!isCollapsed ? (
          <>
            <nav
              className="navbarDesktopNav flex flex-1 items-center justify-start gap-1 py-1 sm:justify-center"
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = visibleActiveId === item.id
                const Icon = item.Icon

                return (
                  <a
                    key={item.id}
                    href={getNavTarget(item.id)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(event) => handleNavClick(event, item.id)}
                    className={`group inline-flex shrink-0 items-center rounded-full px-2 py-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] ${
                      isActive
                        ? 'text-[color:var(--primary)]'
                        : 'text-[color:var(--muted)] hover:text-[color:var(--primary)]'
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 ${isActive ? 'scale-105' : ''}`}
                    >
                      <Icon
                        size={21}
                        weight="regular"
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-200 ${
                        isActive
                          ? 'ml-2 max-w-36 translate-x-0 font-semibold opacity-100'
                          : 'ml-0 max-w-0 -translate-x-1 opacity-0 group-hover:ml-2 group-hover:max-w-36 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-36 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                )
              })}
            </nav>

            <div className="navbarDesktopTheme shrink-0">
              <ThemeToggle />
            </div>
          </>
        ) : (
          <>
            <div className="navbarMobileMain">
              <span
                className="navbarMobileActive"
                aria-live="polite"
                aria-label={`Active section: ${activeItem.label}`}
              >
                <ActiveIcon size={18} weight="regular" aria-hidden="true" />
                <span className="navbarMobileActiveLabel">{activeItem.label}</span>
              </span>
            </div>

            <div className="navbarMobileActions">
              <ThemeToggle compact />
              <button
                type="button"
                className="navbarMobileMenuButton"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="navbar-mobile-menu"
                onClick={() => {
                  setIsMobileMenuOpen((open) => !open)
                }}
              >
                <List size={18} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {isMobileMenuOpen && isCollapsed ? (
        <div className="container navbarMobileMenuWrap" ref={mobileMenuRef}>
          <nav id="navbar-mobile-menu" className="navbarMobileMenu" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const isActive = visibleActiveId === item.id
              const Icon = item.Icon

              return (
                <a
                  key={item.id}
                  href={getNavTarget(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(event) => handleNavClick(event, item.id)}
                  className={`navbarMobileMenuItem ${isActive ? 'navbarMobileMenuItem--active' : ''}`}
                >
                  <Icon size={17} weight="regular" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
