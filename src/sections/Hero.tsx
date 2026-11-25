import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DownloadButton } from '../components/DownloadButton'
import { StarButton } from '../components/StarButton'
import { canUseWebGL } from '../lib/webgl'
import { isNarrow, prefersReducedMotion, shouldRender } from '../lib/motion'
import { loadHeroScene } from '../hero/load'
import { HeroFallback } from './HeroFallback'
import { gsap, useGSAP } from '../lib/gsap'
import { playIntro } from '../lib/intro'
import { introWasSkipped, releaseIntroPending } from '../lib/intro-pending'
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

  // The first-load intro, on every load, set up before the first client paint. Until then the head
  // script (lib/intro-pending) keeps its targets hidden; with the start state set, the page is shown.
  // If that script's safety timeout already showed the page, the intro doesn't play over it.
  // A scroll, swipe or key cuts it to its end.
  useLayoutEffect(() => {
    const intro = playIntro(document.body, { reduced: prefersReducedMotion() || introWasSkipped() })
    releaseIntroPending()
    if (!intro.timeline) return
    const cut = () => intro.cut()
    const events = ['wheel', 'touchmove', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, cut, { once: true, passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, cut))
      intro.revert()
    }
  }, [])

  // The spotlight follows the pointer while it is over the hero.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = section.getBoundingClientRect()
      section.style.setProperty('--sx', `${Math.round(e.clientX - r.left)}px`)
      section.style.setProperty('--sy', `${Math.round(e.clientY - r.top)}px`)
      section.classList.add('hero--spot')
    }
    const onLeave = () => section.classList.remove('hero--spot')
    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

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
    // Sleep/wake or a GPU switch can drop the context: stop and show the static mascot again.
    const onLost = () => {
      scene?.stop()
      setLive(false)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    let narrowNow = isNarrow()
    const build = () =>
      loadHeroScene()
        .then(({ createHeroScene }) => {
          if (disposed) return
          scene?.dispose()
          scene = createHeroScene(canvas, { narrow: narrowNow, label: labelRef.current, colors: COLORS })
          setLive(true)
          sync()
        })
        .catch(() => {
          /* the static mascot stays */
        })
    const boot = () => void build()
    // Bloom and glyph count depend on phone vs desktop: rebuild when the window crosses the breakpoint.
    let resizeTimer: number | undefined
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!scene || isNarrow() === narrowNow) return
        narrowNow = isNarrow()
        void build()
      }, 250)
    }
    window.addEventListener('resize', onResize)
    const hasIdle = 'requestIdleCallback' in window
    const idle = hasIdle ? window.requestIdleCallback(boot, { timeout: 1200 }) : window.setTimeout(boot, 200)

    return () => {
      disposed = true
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      scene?.dispose()
    }
  }, [])

  return (
    <section ref={sectionRef} className={`hero ${live ? 'hero--live' : ''}`} id="top" aria-labelledby="hero-title">
      {/* A soft light that follows the pointer over the hero (moved by transform, see hero.css). */}
      <span className="hero__spot" aria-hidden="true" />
      <div className="hero__stage">
        {/* The scroll hand-off moves the stage; the intro moves this, so the two never share a property. */}
        <div className="hero__stage-in">
          <HeroFallback />
          <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
          <span ref={labelRef} className="hero__ping" aria-hidden="true">
            needs you
          </span>
        </div>
      </div>
      <div className="hero__copy wrap">
        <p className="hero__kicker">
          <span className="hero__dot" /> <span className="hero__kicker-text">a terminal for people who run AI coding agents</span>
        </p>
        <h1 id="hero-title" className="hero__title">
          Your not-so-friendly <br className="hero__br" />
          neighborhood CLI.
        </h1>
        <p className="hero__lede">
          A native, GPU-fast terminal for people who run AI coding agents and refuse to babysit them.
        </p>
        <div className="hero__cta cta">
          <DownloadButton showMeta magnetic />
          <StarButton magnetic />
        </div>
      </div>
    </section>
  )
}
