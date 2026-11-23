import { useEffect, useState } from 'react'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function isNarrow(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 767px)').matches
}

/** The hero's render loop runs only when someone can see it move. */
export function shouldRender(s: { inView: boolean; hidden: boolean; reduced: boolean }): boolean {
  return s.inView && !s.hidden && !s.reduced
}

/** Reduced-motion preference that is false during SSR/hydration and settles right after mount. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(prefersReducedMotion()), [])
  return reduced
}
