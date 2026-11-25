import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

const CHAR_MS = 32
const START_MS = 500

/**
 * Settings → Plugins' "add" field, played: a GitHub link types itself in, then a check lands. Starts
 * when it scrolls into view, once; reduced motion shows the link and the check at once.
 */
export function LinkTypeDemo({ url, reduced = false }: { url: string; reduced?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [chars, setChars] = useState(0)

  useEffect(() => {
    if (reduced || started || !ref.current || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [reduced, started])

  useEffect(() => {
    if (reduced || !started || chars >= url.length) return
    const id = window.setTimeout(() => setChars((c) => c + 1), chars === 0 ? START_MS : CHAR_MS)
    return () => window.clearTimeout(id)
  }, [reduced, started, chars, url])

  const shown = reduced ? url.length : chars
  const done = shown >= url.length
  return (
    <div ref={ref} className="smock__add ltd">
      <span className={`smock__input ltd__field ${shown ? 'is-typing' : ''}`}>
        {shown ? <span className="ltd__text">{url.slice(0, shown)}</span> : <span>https://github.com/…</span>}
        {started && !done ? <span className="ltd__caret" /> : null}
        {done ? <Icon name="check" size={14} className="ltd__ok" /> : null}
      </span>
      <span className="smock__btn">Install</span>
    </div>
  )
}
