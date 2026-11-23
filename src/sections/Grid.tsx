import { useRef } from 'react'
import { grid, type Card } from '../content/grid'
import { byId } from '../content/inventory'
import { Keys } from '../components/Keys'
import { Shot } from '../components/Shot'
import { TypedTerminal } from '../components/TypedTerminal'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '../lib/motion'
import './grid.css'

export function Grid() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.card', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '.grid__cards', start: 'top 82%', once: true },
      })
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="grid wrap" aria-labelledby="grid-title">
      <p className="kicker">And the rest</p>
      <h2 id="grid-title" className="section-title">Everything else it does, which is a lot.</h2>
      <div className="grid__cards">
        {grid.map((card) => (
          <CardView key={card.id} card={card} reduced={reduced} />
        ))}
      </div>
    </section>
  )
}

function CardView({ card, reduced }: { card: Card; reduced: boolean }) {
  const v = card.visual
  return (
    <article className={`card ${v ? 'card--visual' : ''}`}>
      <h3 className="card__title">{card.title}</h3>
      <ul className="card__caps">
        {card.capabilities.map((id) => {
          const c = byId.get(id)!
          return (
            <li key={id}>
              <span>{c.text}</span>
              {c.keys ? <Keys combo={c.keys} /> : null}
            </li>
          )
        })}
      </ul>
      {v ? (
        <div className="card__visual">
          {'shot' in v ? <Shot name={v.shot} /> : null}
          {'replay' in v ? <TypedTerminal script={v.replay} reduced={reduced} /> : null}
          {'demo' in v && v.demo === 'cursor' ? <CursorDemo /> : null}
          {'demo' in v && v.demo === 'sounds' ? <SoundsDemo /> : null}
        </div>
      ) : null}
    </article>
  )
}

function CursorDemo() {
  return (
    <div className="demo-cursor" aria-hidden="true">
      <span className="demo-cursor__prompt">~/code/api $</span>
      <span className="demo-cursor__trail" />
      <span className="demo-cursor__caret" />
    </div>
  )
}

function SoundsDemo() {
  return (
    <div className="demo-sounds" aria-hidden="true">
      <kbd className="keys__cap demo-sounds__key">⏎ Enter</kbd>
      <kbd className="keys__cap demo-sounds__key demo-sounds__key--late">⌃C</kbd>
      <span className="demo-sounds__wave" />
    </div>
  )
}
