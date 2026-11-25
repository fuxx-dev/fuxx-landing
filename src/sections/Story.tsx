import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { chapters, type Chapter } from '../content/chapters'
import { byId } from '../content/inventory'
import { FuxxWindow } from '../components/FuxxWindow'
import { Icon } from '../components/Icon'
import { Keys } from '../components/Keys'
import { Shot, shotOrigin } from '../components/Shot'
import { TypedTerminal } from '../components/TypedTerminal'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useReducedMotion } from '../lib/motion'
import { useRevealTitles } from '../lib/reveal'
import './story.css'

/** The pinned layout shows one chapter at a time in a fixed box; it only works if the tallest one fits. */
export function chaptersFit(heights: number[], box: number): boolean {
  return heights.every((h) => h <= box)
}

/** Chapter swaps while pinned: the old one leaves the way you scrolled, the new one comes from the other side. */
const SWAP = { type: 'spring', stiffness: 260, damping: 30 } as const
const STILL = { duration: 0 } as const

const PIN_QUERY = '(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'

export function Story() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const chaptersRef = useRef<HTMLOListElement>(null)
  const tooTallRef = useRef(false)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const [shot, setShot] = useState(0)
  const reduced = useReducedMotion()
  // The render that pins jumps straight to its layout; swaps after that spring.
  const [swapping, setSwapping] = useState(false)
  useEffect(() => setSwapping(pinned), [pinned])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(PIN_QUERY, () => {
        if (tooTallRef.current) return
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

  useRevealTitles(sectionRef)

  // While pinned, the window drifts a little against the scroll (transform only, scrubbed).
  useGSAP(
    () => {
      if (!pinned) return
      gsap.fromTo(
        '.story__frame',
        { y: 24 },
        {
          y: -24,
          ease: 'none',
          scrollTrigger: { trigger: pinRef.current, start: 'top top', end: () => `+=${chapters.length * window.innerHeight}`, scrub: true },
        },
      )
    },
    { scope: sectionRef, dependencies: [pinned], revertOnUpdate: true },
  )

  // After the pinned layout renders, check every chapter fits its box; if one doesn't, go back to stacked.
  useEffect(() => {
    const box = chaptersRef.current
    if (!pinned || !box) return
    const heights = Array.from(box.children, (li) => (li as HTMLElement).scrollHeight)
    if (chaptersFit(heights, box.clientHeight)) return
    tooTallRef.current = true
    triggerRef.current?.kill(true)
    triggerRef.current = null
    setPinned(false)
    setActive(0)
    setShot(0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pinned])

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
                    {i === active ? <motion.span layoutId="story-nav-pill" className="story__pill" transition={SWAP} /> : null}
                    <span className="story__nav-num">0{i + 1}</span> {ch.title}
                  </button>
                ))}
              </nav>
            ) : null}
            <ol ref={chaptersRef} className="story__chapters">
              {chapters.map((ch, i) => (
                <motion.li
                  key={ch.id}
                  className={`story__chapter ${i === active ? 'is-active' : ''}`}
                  aria-current={pinned && i === active ? 'step' : undefined}
                  initial={false}
                  // Stacked (and on the way back to stacked): every chapter plainly shown, no motion.
                  animate={pinned ? { opacity: i === active ? 1 : 0, y: i === active ? 0 : i < active ? -18 : 18 } : { opacity: 1, y: 0 }}
                  transition={pinned && swapping ? SWAP : STILL}
                >
                  <p className="story__num">0{i + 1}</p>
                  <h3 className="story__title">
                    <Icon name={ch.icon} size="0.8em" className="story__icon" />
                    {ch.title}
                  </h3>
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
                </motion.li>
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
          {/* The slow zoom leans in on the shot's focus point (the shot list's `focus`). */}
          <div className="story__drift" style={{ transformOrigin: shotOrigin(name) }}>
            <Shot name={name} priority={chapter.id === 'agents' && j === 0} />
          </div>
        </div>
      ))}
    </div>
  )
}
