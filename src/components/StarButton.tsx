import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { getStarCount, starLabel } from '../lib/stars'
import { countUp } from '../lib/count'
import { useMagnet } from '../lib/magnet'
import { prefersReducedMotion } from '../lib/motion'
import { PRESS } from './DownloadButton'
import { Icon } from './Icon'
import './buttons.css'

export const REPO_URL = 'https://github.com/fitzfitz/fuxx-cli'
const COUNT_MS = 900

export function StarButton({ compact = false, magnetic = false }: { compact?: boolean; magnetic?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const pull = useMagnet(ref, 6, magnetic)
  const [stars, setStars] = useState<number | null>(null)
  const [target, setTarget] = useState<number | null>(null)
  useEffect(() => {
    let live = true
    let frame = 0
    getStarCount().then((n) => {
      if (!live || n === null) return
      setTarget(n)
      // The count runs up from zero once it arrives; reduced motion shows the number at once.
      const steps = prefersReducedMotion() ? [n] : countUp(0, n, COUNT_MS)
      let i = 0
      const tick = () => {
        if (!live) return
        setStars(steps[i])
        if (++i < steps.length) frame = requestAnimationFrame(tick)
      }
      tick()
    })
    return () => {
      live = false
      cancelAnimationFrame(frame)
    }
  }, [])
  // Below 10 the label hides; while counting, it shows from 10 up, in the final label's width (no reflow).
  const label = starLabel(stars)
  const width = starLabel(target)?.length ?? 0
  return (
    // The slot is what the hero intro animates; Motion owns the button's own transform.
    <span className="btn-slot btn-slot--star">
      <motion.a
        ref={ref}
        style={magnetic ? pull : undefined}
        className={`btn btn--ghost ${compact ? 'btn--compact' : ''}`}
        href={REPO_URL}
        whileHover={PRESS.hover}
        whileTap={PRESS.tap}
      >
        <Icon name="star" className="btn__icon" />
        {compact ? 'Star' : 'Star on GitHub'}
        {label ? (
          <span className="btn__count" style={{ minWidth: `calc(${width}ch + 0.6em)` }}>
            {label}
          </span>
        ) : null}
      </motion.a>
    </span>
  )
}
