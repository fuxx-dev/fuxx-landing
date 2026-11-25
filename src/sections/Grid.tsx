import { useRef } from 'react'
import { grid, type Card } from '../content/grid'
import { byId } from '../content/inventory'
import { Icon } from '../components/Icon'
import { Keys } from '../components/Keys'
import { PlanDemo } from '../components/PlanDemo'
import { Shot } from '../components/Shot'
import { TiltCard } from '../components/TiltCard'
import { TypedTerminal } from '../components/TypedTerminal'
import { useReducedMotion } from '../lib/motion'
import { useRevealTitles } from '../lib/reveal'
import './grid.css'

export function Grid() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useRevealTitles(ref)
  return (
    <section ref={ref} className="grid wrap" aria-labelledby="grid-title">
      <p className="kicker">And the rest</p>
      <h2 id="grid-title" className="section-title">Everything else it does, which is a lot.</h2>
      <div className="grid__cards">
        {grid.map((card, i) => (
          <CardView key={card.id} card={card} reduced={reduced} delay={(i % 3) * 0.06} />
        ))}
      </div>
    </section>
  )
}

function CardView({ card, reduced, delay }: { card: Card; reduced: boolean; delay: number }) {
  const v = card.visual
  return (
    <TiltCard className={`card ${v ? 'card--visual' : ''}`} reveal={{ delay }}>
      <h3 className="card__title">
        <Icon name={card.icon} size="0.85em" className="card__icon" />
        {card.title}
      </h3>
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
          {'demo' in v && v.demo === 'plan' ? <PlanDemo reduced={reduced} /> : null}
        </div>
      ) : null}
    </TiltCard>
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
