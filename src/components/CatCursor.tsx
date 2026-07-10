import { useEffect, useRef } from 'react'

type CursorMode = 'default' | 'active' | 'text'

type PawPrint = {
  x: number
  y: number
  age: number
  element: HTMLSpanElement
}

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  'summary',
  '.card',
  '.projectCard',
  '.activityCardButton',
  '.certificationBadgeTileTrigger',
  '.cardLink',
].join(',')

const TEXT_SELECTOR = [
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[contenteditable=""]',
].join(',')

function CatFace() {
  return (
    <svg className="catCursorIcon catCursorFace" viewBox="0 0 36 36" aria-hidden="true">
      <path
        className="catCursorFill"
        d="M7.5 15.8 8.2 6l7.2 5.3a14.6 14.6 0 0 1 5.2 0L27.8 6l.7 9.8A11 11 0 0 1 30 21.4C30 28 24.6 32 18 32S6 28 6 21.4c0-2 .5-3.9 1.5-5.6Z"
      />
      <path
        className="catCursorStroke"
        d="M7.5 15.8 8.2 6l7.2 5.3a14.6 14.6 0 0 1 5.2 0L27.8 6l.7 9.8A11 11 0 0 1 30 21.4C30 28 24.6 32 18 32S6 28 6 21.4c0-2 .5-3.9 1.5-5.6Z"
      />
      <path className="catCursorAccent" d="M14.2 20.2h.1M21.7 20.2h.1" />
      <path className="catCursorStroke" d="M15.1 25.4c1.9 1.4 3.9 1.4 5.8 0M18 22.8l-1.2 1.1h2.4L18 22.8Z" />
      <path className="catCursorWhisker" d="M11.5 23.1H5.8M12 25.5 7 27M24.5 23.1h5.7M24 25.5l5 1.5" />
    </svg>
  )
}

function CatPaw() {
  return (
    <svg className="catCursorIcon catCursorPaw" viewBox="0 0 36 36" aria-hidden="true">
      <path className="catCursorFill" d="M11.1 21.8c1.9-3.5 4.2-4.9 6.9-4.9s5 1.4 6.9 4.9c2 3.6-.4 7.7-4.5 7.7h-4.8c-4.1 0-6.5-4.1-4.5-7.7Z" />
      <path className="catCursorAccent" d="M9.4 15.7c1.2 1.8.9 4-.6 5s-3.7.2-4.8-1.6-.9-4 .6-5 3.7-.2 4.8 1.6ZM15.5 9.9c.5 2.2-.4 4.2-2.2 4.6s-3.5-1.1-4-3.3.4-4.2 2.2-4.6 3.5 1.1 4 3.3ZM26.6 11.2c-.5 2.2-2.2 3.7-4 3.3s-2.7-2.4-2.2-4.6 2.2-3.7 4-3.3 2.7 2.4 2.2 4.6ZM31.9 19.1c-1.1 1.8-3.3 2.6-4.8 1.6s-1.8-3.2-.6-5 3.3-2.6 4.8-1.6 1.8 3.2.6 5Z" />
      <path className="catCursorStroke" d="M11.1 21.8c1.9-3.5 4.2-4.9 6.9-4.9s5 1.4 6.9 4.9c2 3.6-.4 7.7-4.5 7.7h-4.8c-4.1 0-6.5-4.1-4.5-7.7Z" />
    </svg>
  )
}

function CatCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const renderedRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)
  const activeRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const visibleRef = useRef(false)
  const modeRef = useRef<CursorMode>('default')
  const pawPrintsRef = useRef<PawPrint[]>([])
  const lastTrailRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return undefined
    }

    const pawPrints = pawPrintsRef.current
    const precisePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const setCustomCursorEnabled = (enabled: boolean) => {
      document.documentElement.classList.toggle('customCursorEnabled', enabled)
    }

    const setMode = (mode: CursorMode) => {
      if (modeRef.current === mode) {
        return
      }

      modeRef.current = mode
      root.dataset.mode = mode
      setCustomCursorEnabled(visibleRef.current && mode !== 'text')
    }

    const isTextTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(TEXT_SELECTOR))

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))

    const updateModeFromTarget = (target: EventTarget | null) => {
      if (isTextTarget(target)) {
        setMode('text')
      } else if (isInteractiveTarget(target)) {
        setMode('active')
      } else {
        setMode('default')
      }
    }

    const animate = () => {
      if (!visibleRef.current) {
        frameRef.current = null
        return
      }

      const follow = reducedMotionRef.current ? 1 : 0.58
      renderedRef.current.x += (positionRef.current.x - renderedRef.current.x) * follow
      renderedRef.current.y += (positionRef.current.y - renderedRef.current.y) * follow
      root.style.transform = `translate3d(${renderedRef.current.x}px, ${renderedRef.current.y}px, 0)`

      for (let index = pawPrints.length - 1; index >= 0; index -= 1) {
        const print = pawPrints[index]
        print.age += reducedMotionRef.current ? 1 : 0.045
        print.element.style.opacity = `${Math.max(0, 1 - print.age)}`
        print.element.style.transform = `translate3d(${print.x}px, ${print.y}px, 0) scale(${0.7 + print.age * 0.22})`

        if (print.age >= 1) {
          print.element.remove()
          pawPrints.splice(index, 1)
        }
      }

      frameRef.current = window.requestAnimationFrame(animate)
    }

    const ensureAnimation = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animate)
      }
    }

    const addPawPrint = (x: number, y: number) => {
      if (reducedMotionRef.current || modeRef.current === 'text' || performance.now() - lastTrailRef.current < 90) {
        return
      }

      lastTrailRef.current = performance.now()
      const element = document.createElement('span')
      element.className = 'catCursorTrail'
      root.parentElement?.appendChild(element)
      pawPrints.push({ x: x - 5, y: y + 7, age: 0, element })

      while (pawPrints.length > 4) {
        const print = pawPrints.shift()
        print?.element.remove()
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!precisePointerQuery.matches || event.pointerType !== 'mouse') {
        visibleRef.current = false
        root.dataset.visible = 'false'
        setCustomCursorEnabled(false)
        return
      }

      positionRef.current.x = event.clientX
      positionRef.current.y = event.clientY

      if (!visibleRef.current) {
        renderedRef.current.x = event.clientX
        renderedRef.current.y = event.clientY
        root.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      }

      visibleRef.current = true
      root.dataset.visible = 'true'
      updateModeFromTarget(event.target)
      setCustomCursorEnabled(modeRef.current !== 'text')
      addPawPrint(event.clientX, event.clientY)
      ensureAnimation()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || modeRef.current === 'text' || reducedMotionRef.current) {
        return
      }

      activeRef.current = true
      root.dataset.pressed = 'true'
    }

    const handlePointerUp = () => {
      if (!activeRef.current) {
        return
      }

      activeRef.current = false
      root.dataset.pressed = 'false'
    }

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        updateModeFromTarget(event.target)
      }
    }

    const handlePointerLeave = () => {
      visibleRef.current = false
      root.dataset.visible = 'false'
      setCustomCursorEnabled(false)
    }

    const handlePrecisionChange = () => {
      const enabled = precisePointerQuery.matches
      visibleRef.current = false
      root.dataset.visible = 'false'
      setCustomCursorEnabled(false)

      if (!enabled && frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
      root.dataset.reducedMotion = `${event.matches}`
    }

    reducedMotionRef.current = reducedMotionQuery.matches
    root.dataset.reducedMotion = `${reducedMotionQuery.matches}`
    root.dataset.mode = 'default'
    root.dataset.visible = 'false'
    root.dataset.pressed = 'false'

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    precisePointerQuery.addEventListener('change', handlePrecisionChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      setCustomCursorEnabled(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerleave', handlePointerLeave)
      precisePointerQuery.removeEventListener('change', handlePrecisionChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)

      for (const print of pawPrints) {
        print.element.remove()
      }
    }
  }, [])

  return (
    <div ref={rootRef} className="catCursor" aria-hidden="true">
      <CatFace />
      <CatPaw />
    </div>
  )
}

export default CatCursor
