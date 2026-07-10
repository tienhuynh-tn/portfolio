import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  depth: number
  alpha: number
  highlight: number
  pulseOffset: number
}

type FloatingSymbol = {
  label: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  depth: number
  alpha: number
  rotation: number
  rotationVelocity: number
  pulseOffset: number
  glow: boolean
}

type PointerState = {
  x: number
  y: number
  targetX: number
  targetY: number
  active: boolean
}

type Palette = {
  particleRgb: string
  particleAccentRgb: string
  lineRgb: string
  activeLineRgb: string
  symbolRgb: string
  glowRgb: string
  clusterRgb: string
  particleAlpha: number
  lineAlpha: number
  activeLineAlpha: number
  symbolAlpha: number
}

const SYMBOLS = ['{ }', '</>', 'λ', '∑', 'π', '∞', '01', '#', '☕', '🧬', '⚛', 'μ', '∫', '🌐']
const OFFSCREEN_POINTER = -2000

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)
const alphaColor = (rgb: string, alpha: number) => `rgba(${rgb}, ${Math.max(0, Math.min(alpha, 1))})`

const getPalette = (): Palette => {
  const isDark = document.documentElement.dataset.theme === 'dark'

  return isDark
    ? {
        particleRgb: '165, 243, 252',
        particleAccentRgb: '96, 165, 250',
        lineRgb: '34, 211, 238',
        activeLineRgb: '216, 180, 254',
        symbolRgb: '226, 232, 240',
        glowRgb: '56, 189, 248',
        clusterRgb: '167, 139, 250',
        particleAlpha: 0.34,
        lineAlpha: 0.18,
        activeLineAlpha: 0.28,
        symbolAlpha: 0.28,
      }
    : {
        particleRgb: '30, 64, 175',
        particleAccentRgb: '6, 182, 212',
        lineRgb: '30, 58, 138',
        activeLineRgb: '8, 145, 178',
        symbolRgb: '28, 56, 121',
        glowRgb: '14, 165, 233',
        clusterRgb: '37, 99, 235',
        particleAlpha: 0.32,
        lineAlpha: 0.16,
        activeLineAlpha: 0.26,
        symbolAlpha: 0.26,
      }
}

function getParticleCount(width: number) {
  if (width < 640) {
    return 34
  }

  if (width < 1024) {
    return 56
  }

  return 82
}

function getSymbolCount(width: number) {
  if (width < 640) {
    return 5
  }

  if (width < 1024) {
    return 8
  }

  return 11
}

function ParticleConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d', { alpha: true })

    if (!context) {
      return undefined
    }

    const particles: Particle[] = []
    const floatingSymbols: FloatingSymbol[] = []
    const pointer: PointerState = {
      x: OFFSCREEN_POINTER,
      y: OFFSCREEN_POINTER,
      targetX: OFFSCREEN_POINTER,
      targetY: OFFSCREEN_POINTER,
      active: false,
    }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const paletteRef = { current: getPalette() }

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let animationId: number | null = null
    let reducedMotion = motionQuery.matches
    let visible = !document.hidden
    let elapsed = 0

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const buildScene = () => {
      particles.length = 0
      floatingSymbols.length = 0

      const particleCount = getParticleCount(width)
      const symbolCount = getSymbolCount(width)

      for (let index = 0; index < particleCount; index += 1) {
        const depth = index % 6 === 0 ? randomBetween(0.72, 0.95) : randomBetween(0.25, 0.78)
        const highlight = index % 24 === 0 ? randomBetween(0.4, 0.62) : 0

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: randomBetween(-0.09, 0.09) * depth,
          vy: randomBetween(-0.075, 0.075) * depth,
          radius: randomBetween(0.95, 2.85) * (0.62 + depth),
          depth,
          alpha: randomBetween(0.46, 0.9),
          highlight,
          pulseOffset: randomBetween(0, Math.PI * 2),
        })
      }

      for (let index = 0; index < symbolCount; index += 1) {
        const depth = randomBetween(0.45, 1)

        floatingSymbols.push({
          label: SYMBOLS[index % SYMBOLS.length],
          x: Math.random() * width,
          y: Math.random() * height,
          vx: randomBetween(-0.045, 0.045) * depth,
          vy: randomBetween(-0.035, 0.035) * depth,
          size: randomBetween(width < 640 ? 15 : 18, width < 640 ? 22 : 30) * depth,
          depth,
          alpha: randomBetween(0.48, 0.82),
          rotation: randomBetween(-0.18, 0.18),
          rotationVelocity: randomBetween(-0.0012, 0.0012),
          pulseOffset: randomBetween(0, Math.PI * 2),
          glow: index % 5 === 0,
        })
      }
    }

    const drawGlow = (x: number, y: number, radius: number, rgb: string, alpha: number) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, alphaColor(rgb, alpha))
      gradient.addColorStop(0.45, alphaColor(rgb, alpha * 0.32))
      gradient.addColorStop(1, alphaColor(rgb, 0))
      context.fillStyle = gradient
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }

    const getPointerDistance = (x: number, y: number) => {
      if (!pointer.active) {
        return Number.POSITIVE_INFINITY
      }

      return Math.hypot(x - pointer.x, y - pointer.y)
    }

    const drawParticle = (particle: Particle, palette: Palette) => {
      const distance = getPointerDistance(particle.x, particle.y)
      const influenceRadius = width < 640 ? 130 : 200
      const activeBoost = distance < influenceRadius ? 1 - distance / influenceRadius : 0
      const pulse = 0.82 + Math.sin(elapsed * 0.0017 + particle.pulseOffset) * 0.18
      const alpha = palette.particleAlpha * particle.alpha * (0.46 + particle.depth * 0.5 + activeBoost * 0.28)
      const radius = particle.radius * (1 + activeBoost * 0.22 + particle.highlight * 0.1)
      const accent = particle.highlight > 0 || activeBoost > 0.35
      const rgb = accent ? palette.particleAccentRgb : palette.particleRgb

      if (particle.depth > 0.72 || activeBoost > 0.18 || particle.highlight > 0) {
        drawGlow(
          particle.x,
          particle.y,
          radius * (activeBoost > 0 ? 4.2 : 3.2),
          accent ? palette.glowRgb : palette.particleRgb,
          alpha * (0.14 + activeBoost * 0.14 + particle.highlight * 0.08) * pulse
        )
      }

      context.beginPath()
      context.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
      context.fillStyle = alphaColor(rgb, alpha)
      context.fill()

      if (particle.highlight > 0) {
        context.beginPath()
        context.arc(particle.x, particle.y, radius * 1.85, 0, Math.PI * 2)
        context.strokeStyle = alphaColor(palette.clusterRgb, 0.12 * particle.highlight * pulse)
        context.lineWidth = 0.85
        context.stroke()
      }
    }

    const updateParticle = (particle: Particle) => {
      const motionScale = reducedMotion ? 0.16 : 1

      particle.x += particle.vx * motionScale
      particle.y += particle.vy * motionScale

      if (pointer.active && !reducedMotion) {
        const dx = pointer.x - particle.x
        const dy = pointer.y - particle.y
        const distance = Math.hypot(dx, dy)
        const influenceRadius = width < 640 ? 130 : 200

        if (distance > 0 && distance < influenceRadius) {
          const direction = particle.depth > 0.58 ? 1 : -1
          const force = (1 - distance / influenceRadius) * (0.035 + particle.depth * 0.035)
          particle.vx += (dx / distance) * force * direction
          particle.vy += (dy / distance) * force * direction
        }
      }

      particle.vx *= reducedMotion ? 0.998 : 0.992
      particle.vy *= reducedMotion ? 0.998 : 0.992
      particle.vx += (Math.random() - 0.5) * 0.0014 * particle.depth
      particle.vy += (Math.random() - 0.5) * 0.0014 * particle.depth

      if (particle.x < -30) {
        particle.x = width + 30
      } else if (particle.x > width + 30) {
        particle.x = -30
      }

      if (particle.y < -30) {
        particle.y = height + 30
      } else if (particle.y > height + 30) {
        particle.y = -30
      }
    }

    const updateSymbol = (symbol: FloatingSymbol) => {
      const motionScale = reducedMotion ? 0.1 : 1

      symbol.x += symbol.vx * motionScale
      symbol.y += symbol.vy * motionScale
      symbol.rotation += symbol.rotationVelocity * motionScale

      if (symbol.x < -100) {
        symbol.x = width + 100
      } else if (symbol.x > width + 100) {
        symbol.x = -100
      }

      if (symbol.y < -90) {
        symbol.y = height + 90
      } else if (symbol.y > height + 90) {
        symbol.y = -90
      }
    }

    const drawConnections = (palette: Palette) => {
      const maxDistance = width < 640 ? 104 : 144
      const pointerRadius = width < 640 ? 140 : 210

      for (let outerIndex = 0; outerIndex < particles.length; outerIndex += 1) {
        const first = particles[outerIndex]

        for (let innerIndex = outerIndex + 1; innerIndex < particles.length; innerIndex += 1) {
          const second = particles[innerIndex]
          const distance = Math.hypot(first.x - second.x, first.y - second.y)

          if (distance < maxDistance) {
            const midX = (first.x + second.x) / 2
            const midY = (first.y + second.y) / 2
            const pointerDistance = getPointerDistance(midX, midY)
            const pointerBoost = pointerDistance < pointerRadius ? 1 - pointerDistance / pointerRadius : 0
            const depthAlpha = (first.depth + second.depth) / 2
            const alpha =
              (1 - distance / maxDistance) *
              (palette.lineAlpha + pointerBoost * palette.activeLineAlpha) *
              (0.38 + depthAlpha * 0.72)
            const lineRgb = pointerBoost > 0.18 ? palette.activeLineRgb : palette.lineRgb

            context.beginPath()
            context.moveTo(first.x, first.y)
            context.lineTo(second.x, second.y)
            context.strokeStyle = alphaColor(lineRgb, alpha)
            context.lineWidth = 0.45 + depthAlpha * 0.72 + pointerBoost * 0.48
            context.stroke()
          }
        }
      }
    }

    const drawClusterFields = (palette: Palette) => {
      for (const particle of particles) {
        if (particle.highlight <= 0) {
          continue
        }

        const pulse = 0.68 + Math.sin(elapsed * 0.0012 + particle.pulseOffset) * 0.2
        drawGlow(
          particle.x,
          particle.y,
          34 * particle.depth,
          palette.clusterRgb,
          0.035 * particle.highlight * pulse
        )
      }
    }

    const drawSymbols = (palette: Palette) => {
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      for (const symbol of floatingSymbols) {
        const pulse = 0.84 + Math.sin(elapsed * 0.0014 + symbol.pulseOffset) * 0.16
        const distance = getPointerDistance(symbol.x, symbol.y)
        const activeBoost = distance < 190 ? 1 - distance / 190 : 0
        const alpha = palette.symbolAlpha * symbol.alpha * (0.5 + symbol.depth * 0.45 + activeBoost * 0.16) * pulse

        context.save()
        context.translate(symbol.x, symbol.y)
        context.rotate(symbol.rotation)
        context.font = `${symbol.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

        if (symbol.glow || activeBoost > 0.12) {
          context.shadowColor = alphaColor(palette.glowRgb, 0.28)
          context.shadowBlur = 4 + symbol.depth * 5 + activeBoost * 6
        }

        context.fillStyle = alphaColor(palette.symbolRgb, alpha)
        context.fillText(symbol.label, 0, 0)
        context.restore()
      }
    }

    const renderFrame = (timestamp = 0) => {
      elapsed = timestamp

      if (!visible) {
        animationId = null
        return
      }

      const palette = paletteRef.current

      context.clearRect(0, 0, width, height)
      pointer.x += (pointer.targetX - pointer.x) * 0.12
      pointer.y += (pointer.targetY - pointer.y) * 0.12

      for (const particle of particles) {
        updateParticle(particle)
      }

      for (const symbol of floatingSymbols) {
        updateSymbol(symbol)
      }

      drawClusterFields(palette)
      drawConnections(palette)

      for (const particle of particles) {
        drawParticle(particle, palette)
      }

      drawSymbols(palette)

      animationId = window.requestAnimationFrame(renderFrame)
    }

    const restart = () => {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId)
        animationId = null
      }

      renderFrame()
    }

    const handleResize = () => {
      resizeCanvas()
      buildScene()
      restart()
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
      pointer.targetX = OFFSCREEN_POINTER
      pointer.targetY = OFFSCREEN_POINTER
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      pointer.active = false
      restart()
    }

    const handleVisibilityChange = () => {
      visible = !document.hidden

      if (visible && animationId === null) {
        restart()
      } else if (!visible && animationId !== null) {
        window.cancelAnimationFrame(animationId)
        animationId = null
      }
    }

    const themeObserver = new MutationObserver(() => {
      paletteRef.current = getPalette()
      restart()
    })

    resizeCanvas()
    buildScene()
    renderFrame()

    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    motionQuery.addEventListener('change', handleReducedMotionChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId)
      }

      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      motionQuery.removeEventListener('change', handleReducedMotionChange)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particleConstellation" aria-hidden="true" />
}

export default ParticleConstellationBackground
