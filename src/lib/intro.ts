import { gsap, SplitText } from './gsap'

export type Intro = {
  /** Jump to the end (a scroll or a key during the intro): everything in place, splits undone. */
  cut(): void
  /** Undo everything (unmount): the markup and inline styles as they were. */
  revert(): void
  timeline: gsap.core.Timeline | null
}

const NONE: Intro = { cut() {}, revert() {}, timeline: null }

/**
 * The first-load intro (~1.8 s, on every load): the header slides down, the mark draws, the kicker
 * types, the headline rises char by char, the lede, buttons and release line follow, the stage arrives, the dot
 * pings. Everything starts from the readable server HTML; the hiding happens here, on mount, inside
 * the timeline's `from`s. Reduced motion: nothing at all.
 */
export function playIntro(root: HTMLElement, { reduced }: { reduced: boolean }): Intro {
  if (reduced) return NONE
  const one = (s: string) => root.querySelector<HTMLElement>(s)
  const all = (s: string) => [...root.querySelectorAll<HTMLElement>(s)]

  const header = one('.hdr')
  const mark = all('.hdr .logo-mark__path')
  const kicker = one('.hero__kicker-text')
  const title = one('.hero__title')
  const lede = one('.hero__lede')
  const buttons = all('.hero__cta .btn')
  const meta = one('.hero__cta .dl__meta')
  const stage = one('.hero__stage-in')
  const dot = one('.hero__dot')

  const splits: SplitText[] = []
  const undoSplits = () => splits.splice(0).forEach((s) => s.revert())
  const kickerSplit = kicker ? SplitText.create(kicker, { type: 'chars' }) : null
  // Words break after hyphens too ("not-so-friendly"), so the split headline wraps exactly like the plain one.
  const titleSplit = title
    ? SplitText.create(title, { type: 'chars,words,lines', mask: 'lines', linesClass: 'reveal-line', wordDelimiter: { delimiter: /(?<=-)|(?= )/ } })
    : null
  if (kickerSplit) splits.push(kickerSplit)
  if (titleSplit) splits.push(titleSplit)

  const plain = [header, stage, lede, meta, dot, ...buttons].filter((el): el is HTMLElement => !!el)
  const tl = gsap.timeline({
    onComplete: () => {
      undoSplits()
      gsap.set(plain, { clearProps: 'transform,opacity,visibility' })
    },
  })
  if (header) tl.from(header, { yPercent: -100, duration: 0.6, ease: 'power3.out' }, 0)
  if (mark.length) tl.fromTo(mark, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.15)
  if (stage) tl.from(stage, { autoAlpha: 0, scale: 1.06, duration: 1.4, ease: 'power2.out' }, 0.1)
  if (kickerSplit) tl.from(kickerSplit.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.012 }, 0.2)
  if (titleSplit) tl.from(titleSplit.chars, { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.018 }, 0.3)
  if (lede) tl.from(lede, { y: 16, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0.75)
  if (buttons.length) tl.from(buttons, { scale: 0.9, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 }, 0.9)
  if (meta) tl.from(meta, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 1.05)
  if (dot) tl.to(dot, { scale: 1.9, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 1.45)

  return {
    cut() {
      if (tl.progress() < 1) tl.progress(1)
    },
    revert() {
      tl.revert()
      undoSplits()
      gsap.set(plain, { clearProps: 'transform,opacity,visibility' })
    },
    timeline: tl,
  }
}
