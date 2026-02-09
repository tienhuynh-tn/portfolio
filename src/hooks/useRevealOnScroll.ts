import { useRef } from 'react'

function useRevealOnScroll<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null)
  return containerRef
}

export default useRevealOnScroll
