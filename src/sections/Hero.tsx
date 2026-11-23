import { useEffect, useRef, useState } from 'react'
import { DownloadButton } from '../components/DownloadButton'
import { StarButton } from '../components/StarButton'
import { canUseWebGL } from '../lib/webgl'
import { isNarrow, prefersReducedMotion, shouldRender } from '../lib/motion'
import { loadHeroScene } from '../hero/load'
import { HeroFallback } from './HeroFallback'
import { gsap, useGSAP } from '../lib/gsap'
import './hero.css'

const COLORS = { green: '#00ff66', working: '#fab387', waiting: '#f38ba8', done: '#a6e3a1' }

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [live, setLive] = useState(false)

  // Scroll hand-off: the stage recedes as the next section comes in.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.to('.hero__stage', {
        opacity: 0.15,
        scale: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: sectionRef },
  )

  useEffect(() => {
    if (prefersReducedMotion() || !canUseWebGL()) return
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    let disposed = false
    let scene: import('../hero/scene').HeroScene | null = null
    const state = { inView: true, hidden: document.hidden, reduced: false }
    const sync = () => {
      if (!scene) return
      if (shouldRender(state)) scene.start()
      else scene.stop()
    }

    const io = new IntersectionObserver(([e]) => {
      state.inView = e.isIntersecting
      sync()
    })
    io.observe(section)
    const onVisibility = () => {
      state.hidden = document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVisibility)
    const onPointer = (e: PointerEvent) => {
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const boot = () => {
      loadHeroScene()
        .then(({ createHeroScene }) => {
          if (disposed) return
          scene = createHeroScene(canvas, { narrow: isNarrow(), label: labelRef.current, colors: COLORS })
          setLive(true)
          sync()
        })
        .catch(() => {
          /* the static mascot stays */
        })
    }
    const hasIdle = 'requestIdleCallback' in window
    const idle = hasIdle ? window.requestIdleCallback(boot, { timeout: 1200 }) : window.setTimeout(boot, 200)

    return () => {
      disposed = true
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      scene?.dispose()
    }
  }, [])

  return (
    <section ref={sectionRef} className={`hero ${live ? 'hero--live' : ''}`} id="top" aria-labelledby="hero-title">
      <div className="hero__stage">
        <HeroFallback />
        <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
        <span ref={labelRef} className="hero__ping" aria-hidden="true">
          needs you
        </span>
      </div>
      <div className="hero__copy wrap">
        <p className="hero__kicker">
          <span className="hero__dot" /> a terminal for people who run AI coding agents
        </p>
        <h1 id="hero-title" className="hero__title">
          Your not-so-friendly <br className="hero__br" />
          neighborhood CLI.
        </h1>
        <p className="hero__lede">
          A native, GPU-fast terminal for people who run AI coding agents and refuse to babysit them.
        </p>
        <div className="hero__cta">
          <DownloadButton showMeta />
          <StarButton />
        </div>
      </div>
    </section>
  )
}
