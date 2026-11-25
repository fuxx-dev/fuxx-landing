import { useEffect, type RefObject } from 'react'
import { useSpring, type MotionValue } from 'motion/react'
import { prefersReducedMotion } from './motion'

/**
 * How far a magnetic element leans toward the pointer, `dx/dy` being the pointer's offset from its
 * centre: nothing on the centre or past `reach`, and at most `strength` px (halfway out), easing in
 * and out between so it never jumps. Reduced motion: always still.
 */
export function magnetOffset(
  { dx, dy }: { dx: number; dy: number },
  { strength, reach, reduced }: { strength: number; reach: number; reduced: boolean },
): { x: number; y: number } {
  const d = Math.hypot(dx, dy)
  if (reduced || d === 0 || d >= reach) return { x: 0, y: 0 }
  const t = d / reach
  const lean = strength * 4 * t * (1 - t)
  return { x: (dx / d) * lean, y: (dy / d) * lean }
}

/** Lean `ref` toward a near pointer (up to `strength` px), springing back as it leaves. Feed x/y to a motion style. */
export function useMagnet(
  ref: RefObject<Element | null>,
  strength = 6,
  enabled = true,
): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useSpring(0, { stiffness: 220, damping: 18 })
  const y = useSpring(0, { stiffness: 220, damping: 18 })
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el || e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      const o = magnetOffset(
        { dx: e.clientX - (r.left + r.width / 2), dy: e.clientY - (r.top + r.height / 2) },
        { strength, reach: Math.max(r.width, r.height) / 2 + 60, reduced: false },
      )
      x.set(o.x)
      y.set(o.y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [ref, strength, enabled, x, y])
  return { x, y }
}
