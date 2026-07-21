import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type CursorMode = 'default' | 'active' | 'text' | 'disabled'

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

const DISABLED_SELECTOR = [
  ':disabled',
  '[aria-disabled="true"]',
  '.disabled',
  '.cursor-not-allowed',
].join(',')

function CatFace() {
  return (
    <svg className="catCursorIcon catCursorFace" viewBox="0 0 52 44" aria-hidden="true">
      <path
        className="catCursorFill"
        d="M9.4 20.1C8.3 15.2 8.9 8.1 12 5.2c2.1-2 7.7 2.6 12.1 7.1 1.2-.2 2.5-.3 3.9-.3 1.3 0 2.6.1 3.8.3 4.5-4.5 10.1-9.1 12.2-7.1 3.1 3 3.7 10 2.6 14.9 1.9 2.5 2.9 5.6 2.9 9.1 0 9.1-8.3 13.3-21.5 13.3S6.5 38.3 6.5 29.2c0-3.5 1-6.6 2.9-9.1Z"
      />
      <path
        className="catCursorInnerEar"
        d="M13.4 18.1c-.5-3.3-.1-7 .8-8.2 1-.3 4.4 2.4 7 5.1-2.9.5-5.5 1.5-7.8 3.1ZM34.8 15c2.6-2.7 6-5.4 7-5.1.9 1.2 1.3 4.9.8 8.2-2.3-1.6-4.9-2.6-7.8-3.1Z"
      />
      <path
        className="catCursorStroke"
        d="M9.4 20.1C8.3 15.2 8.9 8.1 12 5.2c2.1-2 7.7 2.6 12.1 7.1 1.2-.2 2.5-.3 3.9-.3 1.3 0 2.6.1 3.8.3 4.5-4.5 10.1-9.1 12.2-7.1 3.1 3 3.7 10 2.6 14.9 1.9 2.5 2.9 5.6 2.9 9.1 0 9.1-8.3 13.3-21.5 13.3S6.5 38.3 6.5 29.2c0-3.5 1-6.6 2.9-9.1Z"
      />
      <circle className="catCursorBlush catCursorBlushLeft" cx="17.2" cy="29.3" r="3.6" />
      <circle className="catCursorBlush catCursorBlushRight" cx="38.8" cy="29.3" r="3.6" />
      <g className="catCursorEyesDefault">
        <circle className="catCursorEye" cx="19.5" cy="26.3" r="3.1" />
        <circle className="catCursorEye" cx="36.5" cy="26.3" r="3.1" />
        <circle className="catCursorEyeSpark" cx="20.5" cy="25.1" r="1" />
        <circle className="catCursorEyeSpark" cx="37.5" cy="25.1" r="1" />
      </g>
      <g className="catCursorEyesHappy">
        <path className="catCursorExpression" d="M16.6 26.4c1.8 2.3 4.2 2.3 6 0M33.4 26.4c1.8 2.3 4.2 2.3 6 0" />
      </g>
      <g className="catCursorEyesWink">
        <circle className="catCursorEye" cx="19.5" cy="26.3" r="3.1" />
        <circle className="catCursorEyeSpark" cx="20.5" cy="25.1" r="1" />
        <path className="catCursorExpression" d="M33.5 26.2c1.9 1.4 4 1.4 6 0" />
      </g>
      <circle className="catCursorNose" cx="28" cy="29" r="1.4" />
      <path className="catCursorMouth catCursorMouthDefault" d="M28 30.2c-.9 3-4.7 3-5.7.4M28 30.2c.9 3 4.7 3 5.7.4" />
      <path className="catCursorMouth catCursorMouthSad" d="M23.6 33.8c2.7-2.4 6.1-2.4 8.8 0" />
      <path className="catCursorWhisker" d="M12.8 28.1H5.8M13.2 31.2 6.8 33M43.2 28.1h7M42.8 31.2l6.4 1.8" />
      <g className="catCursorHoverMarks">
        <path d="M46.5 17.8l3.4-3.2" />
        <path d="M48.7 22.2l4.2-.8" />
        <path d="M45.7 13l1.1-4" />
      </g>
      <g className="catCursorClickMarks">
        <path d="M45.7 17.1l4.2-3.8" />
        <path d="M48.4 23l5.2-1" />
        <path d="M45.1 12.4l1.5-5" />
      </g>
      <g className="catCursorTextMark">
        <path d="M11.2 8.2h9.8M16.1 8.2v16.8M11.2 25h9.8" />
      </g>
      <g className="catCursorDisabledMark">
        <circle cx="11" cy="9.5" r="4.5" />
        <path d="M7.8 6.3l6.4 6.4" />
      </g>
    </svg>
  )
}

function CatCursor() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
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
    setPortalTarget(document.body)
  }, [])

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
      setCustomCursorEnabled(visibleRef.current)
    }

    const isTextTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(TEXT_SELECTOR))

    const isDisabledTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(DISABLED_SELECTOR))

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))

    const updateModeFromTarget = (target: EventTarget | null) => {
      if (isDisabledTarget(target)) {
        setMode('disabled')
      } else if (isTextTarget(target)) {
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

      const follow = reducedMotionRef.current ? 1 : 0.4
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
      if (reducedMotionRef.current || modeRef.current === 'text' || performance.now() - lastTrailRef.current < 110) {
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
      setCustomCursorEnabled(true)
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
  }, [portalTarget])

  const cursorElement = (
    <div ref={rootRef} className="catCursor" aria-hidden="true">
      <CatFace />
    </div>
  )

  if (!portalTarget) {
    return null
  }

  return createPortal(cursorElement, portalTarget)
}

export default CatCursor
