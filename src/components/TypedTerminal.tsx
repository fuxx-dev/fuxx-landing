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
    if (reduced || !started || p.line >= lines.length) return
    const cur = lines[p.line]
    const typing = cur.kind === 'cmd' && p.chars < cur.text.length
    const id = window.setTimeout(
      () => setP(typing ? { line: p.line, chars: p.chars + 1 } : { line: p.line + 1, chars: 0 }),
      typing ? CHAR_MS : LINE_PAUSE_MS,
    )
    return () => window.clearTimeout(id)
  }, [started, p, lines])

  // Reduced motion can arrive after mount (it settles after hydration): render the end state, type nothing.
  const shown = reduced ? done : p
  const transcript = lines.map((l) => (l.kind === 'cmd' ? `${PROMPT} ${l.text}` : l.text)).join('\n')
  const visible: { l: ReplayLine; text: string }[] = lines
    .slice(0, shown.line)
    .map((l) => ({ l, text: l.text }))
  const current = shown.line < lines.length ? lines[shown.line] : null
  const typingNow = started && current?.kind === 'cmd'
  // About to print output: no fresh prompt yet, the caret waits on the command line above.
  const waitingOutput = current?.kind === 'out' && visible.length > 0

  return (
    <div ref={ref} className="tt" role="img" aria-label={transcript}>
      <div aria-hidden="true">
        {visible.map(({ l, text }, i) => (
          <Line key={i} kind={l.kind} text={text} caret={waitingOutput && i === visible.length - 1} />
        ))}
        {waitingOutput ? null : <Line kind="cmd" text={typingNow && current ? current.text.slice(0, shown.chars) : ''} caret />}
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
