import type { RefObject } from 'react'
import { gsap, SplitText, useGSAP } from './gsap'
import { prefersReducedMotion } from './motion'

const TITLES = '.section-title, .close__title'

export type Reveal = { splits: SplitText[]; revert(): void }

/**
 * Section titles rise word by word, out of a line mask, the first time they scroll in. The split runs
 * after mount (the server HTML shows them whole) and again when the lines reflow (autoSplit).
 * Reduced motion: nothing is split.
 */
export function revealTitles(scope: Element, { reduced = prefersReducedMotion() }: { reduced?: boolean } = {}): Reveal {
  if (reduced) return { splits: [], revert() {} }
  const splits = [...scope.querySelectorAll<HTMLElement>(TITLES)].map((el) =>
    SplitText.create(el, {
      type: 'words,lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 100,
          duration: 0.9,
          stagger: 0.04,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    }),
  )
  return { splits, revert: () => splits.forEach((s) => s.revert()) }
}

/** `revealTitles` for a section, undone when it unmounts. */
export function useRevealTitles(ref: RefObject<Element | null>) {
  useGSAP(
    () => {
      if (!ref.current) return
      const r = revealTitles(ref.current)
      return () => r.revert()
    },
    { scope: ref },
  )
}
