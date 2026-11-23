import { useRef, useState } from 'react'
import { chapters, type Chapter } from '../content/chapters'
import { byId } from '../content/inventory'
import { FuxxWindow } from '../components/FuxxWindow'
import { Keys } from '../components/Keys'
import { Shot } from '../components/Shot'
import { TypedTerminal } from '../components/TypedTerminal'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useReducedMotion } from '../lib/motion'
import './story.css'

const PIN_QUERY = '(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'

export function Story() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const [shot, setShot] = useState(0)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(PIN_QUERY, () => {
        setPinned(true)
        const n = chapters.length
        triggerRef.current = ScrollTrigger.create({
          trigger: pinRef.current,
          pin: true,
          start: 'top top',
          end: () => `+=${n * window.innerHeight}`,
          onUpdate: (self) => {
            const x = Math.min(self.progress * n, n - 0.0001)
            const i = Math.floor(x)
            const shots = 'shots' in chapters[i].visual ? chapters[i].visual.shots.length : 1
            setActive(i)
            setShot(Math.min(shots - 1, Math.floor((x - i) * shots)))
          },
        })
        return () => {
          triggerRef.current = null
          setPinned(false)
          setActive(0)
          setShot(0)
        }
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const goTo = (i: number) => {
    const st = triggerRef.current
    if (!st) return
    window.scrollTo({ top: st.start + (i + 0.02) * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} id="features" className="story" aria-labelledby="story-title">
      <div className="story__intro wrap">
        <p className="kicker">What it does</p>
        <h2 id="story-title" className="section-title">A terminal that keeps an eye on your agents.</h2>
      </div>
      <div ref={pinRef} className={`story__pin ${pinned ? 'is-pinned' : ''}`}>
        <div className="story__grid wrap">
          <div className="story__left">
            {pinned ? (
              <nav className="story__nav" aria-label="Chapters">
                {chapters.map((ch, i) => (
                  <button key={ch.id} type="button" className={i === active ? 'is-active' : ''} onClick={() => goTo(i)}>
                    <span className="story__nav-num">0{i + 1}</span> {ch.title}
                  </button>
                ))}
              </nav>
            ) : null}
            <ol className="story__chapters">
              {chapters.map((ch, i) => (
                <li key={ch.id} className={`story__chapter ${i === active ? 'is-active' : ''}`} aria-current={pinned && i === active ? 'step' : undefined}>
                  <p className="story__num">0{i + 1}</p>
                  <h3 className="story__title">{ch.title}</h3>
                  <p className="story__lede">{ch.lede}</p>
                  <ul className="story__caps">
                    {ch.capabilities.map((id) => {
                      const c = byId.get(id)!
                      return (
                        <li key={id}>
                          <span>{c.text}</span>
                          {c.keys ? <Keys combo={c.keys} /> : null}
                        </li>
                      )
                    })}
                  </ul>
                  {!pinned ? (
                    <div className="story__inline">
                      <Visual chapter={ch} index={0} reduced={reduced} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
          {pinned ? (
            <div className="story__frame">
              <FuxxWindow title={`fuxx — ${chapters[active].title.toLowerCase()}`}>
                <div className="story__slides">
                  {chapters.map((ch, i) => (
                    <div key={ch.id} className={`story__slide ${i === active ? 'is-active' : ''}`}>
                      <Visual chapter={ch} index={i === active ? shot : 0} reduced={false} paused={i !== active} />
                    </div>
                  ))}
                </div>
              </FuxxWindow>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Visual({ chapter, index, reduced, paused = false }: { chapter: Chapter; index: number; reduced: boolean; paused?: boolean }) {
  if ('replay' in chapter.visual) return <TypedTerminal script={chapter.visual.replay} reduced={reduced} paused={paused} />
  const shots = chapter.visual.shots
  return (
    <div className="story__shots">
      {shots.map((name, j) => (
        <div key={name} className={`story__shot ${j === index ? 'is-active' : ''}`}>
          <Shot name={name} priority={chapter.id === 'agents' && j === 0} />
        </div>
      ))}
    </div>
  )
}
