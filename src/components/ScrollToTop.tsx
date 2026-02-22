import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (location.hash) {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [location.hash, location.pathname])

  return null
}

export default ScrollToTop
