import { useEffect, useState } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'

const STORAGE_KEY = 'theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

type Theme = 'light' | 'dark'
type StoredTheme = Theme | null

function getStoredTheme(): StoredTheme {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'dark' || value === 'light' ? value : null
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
}

type ThemeToggleProps = {
  compact?: boolean
}

function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme() ?? getSystemTheme()
  )
  const [hasPreference, setHasPreference] = useState(() =>
    Boolean(getStoredTheme())
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (hasPreference) return

    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [hasPreference])

  const handleToggle = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setHasPreference(true)
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  return (
    <button
      type="button"
      className={`themeToggle ${compact ? 'themeToggle--icon' : ''} ${theme === 'dark' ? 'is-dark' : 'is-light'}`.trim()}
      onClick={handleToggle}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
    >
      {compact ? (
        <span className="themeToggleIconOnly" aria-hidden="true">
          {theme === 'dark' ? (
            <Sun size={16} weight="regular" aria-hidden="true" />
          ) : (
            <Moon size={16} weight="regular" aria-hidden="true" />
          )}
        </span>
      ) : (
        <>
          <span className="themeToggleLabel">DARK</span>
          <span className="themeToggleSwitch" aria-hidden="true">
            <span className="themeToggleThumb">
              {theme === 'dark' ? (
                <Moon
                  size={12}
                  weight="regular"
                  aria-hidden="true"
                  className="text-white"
                />
              ) : (
                <Sun size={12} weight="regular" aria-hidden="true" />
              )}
            </span>
          </span>
          <span className="themeToggleLabel">LIGHT</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle
