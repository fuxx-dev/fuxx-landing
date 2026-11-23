import { useEffect, useRef, useState } from 'react'
import { replays, type ReplayLine } from '../content/replays'
import './typed-terminal.css'

const CHAR_MS = 35
const LINE_PAUSE_MS = 420
const PROMPT = '~/code/api $'

type Progress = { line: number; chars: number }

/** Types a scripted session once it scrolls into view; reduced motion shows the end state. */
export function TypedTerminal({
  script,
  reduced = false,
  paused = false,
}: {
  script: keyof typeof replays
  reduced?: boolean
  /** In view but not its turn yet (a hidden slide): hold the prompt. */
  paused?: boolean
}) {
  const lines = replays[script]
  const done: Progress = { line: lines.length, chars: 0 }
  const [p, setP] = useState<Progress>(reduced ? done : { line: 0, chars: 0 })
  const [inView, setInView] = useState(reduced)
  const started = reduced || (inView && !paused)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || inView || !ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [reduced, inView])

  useEffect(() => {
    if (!started || p.line >= lines.length) return
    const cur = lines[p.line]
    const typing = cur.kind === 'cmd' && p.chars < cur.text.length
    const id = window.setTimeout(
      () => setP(typing ? { line: p.line, chars: p.chars + 1 } : { line: p.line + 1, chars: 0 }),
      typing ? CHAR_MS : LINE_PAUSE_MS,
    )
    return () => window.clearTimeout(id)
  }, [started, p, lines])

  const transcript = lines.map((l) => (l.kind === 'cmd' ? `${PROMPT} ${l.text}` : l.text)).join('\n')
  const visible: { l: ReplayLine; text: string }[] = lines
    .slice(0, p.line)
    .map((l) => ({ l, text: l.text }))
  const current = p.line < lines.length ? lines[p.line] : null
  const typingNow = started && current?.kind === 'cmd'

  return (
    <div ref={ref} className="tt" role="img" aria-label={transcript}>
      <div aria-hidden="true">
        {visible.map(({ l, text }, i) => (
          <Line key={i} kind={l.kind} text={text} />
        ))}
        {current ? (
          typingNow ? (
            <Line kind="cmd" text={current.text.slice(0, p.chars)} caret />
          ) : (
            <Line kind="cmd" text="" caret />
          )
        ) : (
          <Line kind="cmd" text="" caret />
        )}
      </div>
    </div>
  )
}

function Line({ kind, text, caret = false }: { kind: ReplayLine['kind']; text: string; caret?: boolean }) {
  return (
    <div className={`tt__line tt__line--${kind}`}>
      {kind === 'cmd' ? <span className="tt__prompt">{PROMPT} </span> : null}
      <span>{text}</span>
      {caret ? <span className="tt__caret" /> : null}
    </div>
  )
}
