import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { prefersReducedMotion, useReducedMotion } from '../lib/motion'
import { rafThrottle } from '../lib/raf'
import './tilt-card.css'

const MAX_DEG = 4
const SPRING = { stiffness: 300, damping: 30 }

/**
 * A card that lifts on hover, tilts toward the pointer (±4°) and carries a soft glow under it. With
 * `reveal`, a card below the fold fades up the first time it scrolls in; it starts hidden only after
 * mount, so the server HTML shows every card. Reduced motion: a plain, still card.
 */
export function TiltCard({
  children,
  className = '',
  reveal,
}: {
  children: ReactNode
  className?: string
  /** Fade up on first view, after `delay` seconds (staggers a row). */
  reveal?: { delay: number }
}) {
  const ref = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)
  const opacity = useMotionValue(1)
  const y = useMotionValue(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!reveal || !el || prefersReducedMotion()) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    opacity.set(0)
    y.set(24)
  }, [])

  // Once a frame: measure the card, then move only the glow dot (its own transform) and the tilt.
  const [follow] = useState(() =>
    rafThrottle((x: number, y: number) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      const px = x - r.left
      const py = y - r.top
      glowRef.current?.style.setProperty('--gx', `${Math.round(px)}px`)
      glowRef.current?.style.setProperty('--gy', `${Math.round(py)}px`)
      rotateY.set((px / r.width - 0.5) * 2 * MAX_DEG)
      rotateX.set(-(py / r.height - 0.5) * 2 * MAX_DEG)
    }),
  )
  useEffect(() => () => follow.cancel(), [follow])
  const onMove = (e: PointerEvent<HTMLElement>) => follow(e.clientX, e.clientY)
  const onLeave = () => {
    follow.cancel()
    rotateX.set(0)
    rotateY.set(0)
  }

  if (reduced) {
    return (
      // Its own key: reduced motion settles after mount, and the still card must not keep the live one's styles.
      <motion.article key="still" ref={ref} className={`tilt ${className}`.trim()}>
        {children}
      </motion.article>
    )
  }
  return (
    <motion.article
      key="live"
      ref={ref}
      className={`tilt ${className}`.trim()}
      style={{ rotateX, rotateY, transformPerspective: 900, opacity, y }}
      whileHover={{ y: -4 }}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: reveal?.delay ?? 0 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="tilt__glow" aria-hidden="true">
        <span ref={glowRef} className="tilt__glow-dot" />
      </span>
      {children}
    </motion.article>
  )
}
