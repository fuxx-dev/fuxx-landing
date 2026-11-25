import { useEffect, type RefObject } from 'react'
import { useSpring, type MotionValue } from 'motion/react'
import { prefersReducedMotion } from './motion'
import { rafThrottle } from './raf'

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

/**
 * Lean `ref` toward a near pointer (up to `strength` px), springing back as it leaves. Feed x/y to a
 * motion style. The button's box is measured once and again only after a scroll or resize (not on
 * every pointer move, which would force a layout per event), and moves are handled once a frame.
 */
export function useMagnet(
  ref: RefObject<Element | null>,
  strength = 6,
  enabled = true,
): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useSpring(0, { stiffness: 220, damping: 18 })
  const y = useSpring(0, { stiffness: 220, damping: 18 })
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    let box: DOMRect | null = null
    const stale = () => {
      box = null
    }
    const lean = rafThrottle((px: number, py: number) => {
      const el = ref.current
      if (!el) return
      // Cached between scrolls, so the box doesn't chase its own lean from one move to the next.
      box ??= el.getBoundingClientRect()
      const r = box
      const o = magnetOffset(
        { dx: px - (r.left + r.width / 2), dy: py - (r.top + r.height / 2) },
        { strength, reach: Math.max(r.width, r.height) / 2 + 60, reduced: false },
      )
      x.set(o.x)
      y.set(o.y)
    })
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') lean(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', stale, { passive: true })
    window.addEventListener('resize', stale, { passive: true })
    return () => {
      lean.cancel()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', stale)
      window.removeEventListener('resize', stale)
    }
  }, [ref, strength, enabled, x, y])
  return { x, y }
}
