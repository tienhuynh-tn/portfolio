import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react'
import imageManifest from 'virtual:image-manifest'

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  /** Only for an image critical to the current viewport. */
  priority?: boolean
  /** Opt in only after measurement; never preload galleries. */
  preload?: boolean
  /** Bypass resized versions, for the full-resolution lightbox. */
  original?: boolean
}

function ImageRequest({
  src, alt, sizes = '100vw', priority = false, preload = false, original = false,
  loading = 'lazy', decoding = 'async', fetchPriority, width, height,
  className = '', onLoad, onError, style, ...props
}: SmartImageProps) {
  const metadata = imageManifest[src]
  const [active, setActive] = useState(priority || original || loading === 'eager')
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [stage, setStage] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const variants = original ? [] : metadata?.variants ?? []
  const avif = variants.filter((variant) => variant.format === 'avif')
  const webp = variants.filter((variant) => variant.format === 'webp')
  const useVariants = stage < 2 && variants.length > 0
  const candidates = webp.length ? webp : stage === 0 ? avif : []
  const srcSet = (items: typeof variants) => items.map((item) => `${item.src} ${item.width}w`).join(', ')
  const fallbackSrc = useVariants && candidates.length ? candidates[0].src : src
  const fallbackSet = useVariants && candidates.length ? srcSet(candidates) : undefined

  useEffect(() => {
    const image = imageRef.current
    if (active || !image) return
    if (priority || original || loading === 'eager' || typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setActive(true))
      return () => cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px' })
    observer.observe(image)
    return () => observer.disconnect()
  }, [active, priority, original, loading])

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    if (!priority || !preload) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    // Match picture's first supported source to avoid downloading two formats.
    const first = avif.length ? avif : webp
    link.href = first[0]?.src ?? src
    if (first.length) {
      link.type = first[0].format === 'avif' ? 'image/avif' : 'image/webp'
      link.imageSrcset = srcSet(first)
      link.imageSizes = sizes
    }
    link.fetchPriority = 'high'
    document.head.append(link)
    return () => link.remove()
    // The wrapper remounts when src/original changes; metadata is build-time data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority, preload, src, sizes])

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    if (state === 'error' || timerRef.current !== null || !active) return
    if (attempt < 2) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setAttempt((current) => current + 1)
      }, 500 * 3 ** attempt)
      return
    }
    if (useVariants && stage === 0 && webp.length) {
      setStage(1)
    } else if (useVariants) {
      setStage(2)
    } else {
      setState('error')
      onError?.(event)
    }
  }

  return (
    <picture className="smartImage">
      {active && useVariants && stage === 0 && avif.length > 0 ? (
        <source type="image/avif" srcSet={srcSet(avif)} sizes={sizes} />
      ) : null}
      {active && useVariants && webp.length > 0 ? (
        <source type="image/webp" srcSet={srcSet(webp)} sizes={sizes} />
      ) : null}
      <img
        {...props}
        key={`${stage}-${attempt}`}
        ref={imageRef}
        src={active ? fallbackSrc : undefined}
        srcSet={active ? fallbackSet : undefined}
        sizes={fallbackSet ? sizes : undefined}
        alt={alt}
        width={width ?? metadata?.width}
        height={height ?? metadata?.height}
        className={`smartImageElement ${className}`}
        style={style}
        loading={priority || original ? 'eager' : loading}
        decoding={decoding}
        fetchPriority={priority ? 'high' : fetchPriority ?? (original ? 'auto' : 'low')}
        data-image-state={state}
        onLoad={(event) => {
          if (timerRef.current !== null) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
          setState('loaded')
          onLoad?.(event)
        }}
        onError={handleError}
      />
    </picture>
  )
}

export default function SmartImage(props: SmartImageProps) {
  // Source changes cancel outstanding retries and discard old loading state.
  return <ImageRequest key={`${props.src}-${Boolean(props.original)}`} {...props} />
}
