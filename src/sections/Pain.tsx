import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import './pain.css'

const LINE = 'You’ve got three agents going. You flip between windows like a nervous parent at a playground.'

export function Pain() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.pain__w',
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', end: 'bottom 55%', scrub: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="pain wrap" aria-label="The problem">
      <p className="pain__line">
        {LINE.split(' ').map((w, i) => (
          <span key={i} className="pain__w">
            {w}{' '}
          </span>
        ))}
      </p>
      <p className="pain__ask">
        <span className="pain__dot" aria-hidden="true" /> Which one needs you?
      </p>
    </section>
  )
}
