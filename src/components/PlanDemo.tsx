import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './plan-demo.css'

/**
 * fuxx's Plan card, played (the grid's "Plan Mode, live"): Claude's plan streams in, folds, opens,
 * a pointer approves it with edits accepted, the card folds to one line, the mode chip flips and
 * the first edit runs; then it starts over. Starts when scrolled into view; reduced motion shows
 * the approved card at once. Colours: fuxx's Catppuccin Mocha.
 */
export const PLAN_STEPS = [
  { name: 'streaming', ms: 2600 },
  { name: 'folded', ms: 1300 },
  { name: 'opening', ms: 900 },
  { name: 'open', ms: 1700 },
  { name: 'pressing', ms: 450 },
  { name: 'approved', ms: 3400 },
] as const

type Step = (typeof PLAN_STEPS)[number]['name']

type Line = { kind: 'h' | 'p' | 'li' | 'code'; text: string; n?: number }

const LINES: Line[] = [
  { kind: 'h', text: 'Context' },
  { kind: 'p', text: 'RetryState keeps the first attempt’s base_url, so every retry after a failover hits the dead host.' },
  { kind: 'h', text: 'Steps' },
  { kind: 'li', n: 1, text: 'Read the endpoint from Client::current() on every attempt.' },
  { kind: 'li', n: 2, text: 'Drop base_url from RetryState and its two call sites.' },
  { kind: 'li', n: 3, text: 'Test: a failover between attempts reaches the new host.' },
  { kind: 'li', n: 4, text: 'Log the endpoint each attempt used.' },
  { kind: 'h', text: 'Verification' },
  { kind: 'code', text: 'cargo test retry' },
]

const LAST = PLAN_STEPS.length - 1
const TOTAL = PLAN_STEPS.reduce((ms, s) => ms + s.ms, 0)

export function PlanDemo({ reduced = false }: { reduced?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const approveRef = useRef<HTMLSpanElement>(null)
  const [at, setAt] = useState<{ x: number; y: number } | null>(null)
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(reduced ? LAST : 0)
  const [shown, setShown] = useState(reduced ? LINES.length : 0)
  const [round, setRound] = useState(0)

  // Start once it scrolls into view.
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setStarted(true)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // Reduced motion (it settles after mount): the approved card, still.
  useEffect(() => {
    if (!reduced) return
    setStep(LAST)
    setShown(LINES.length)
  }, [reduced])

  // One round: every step and every streamed line scheduled up front, then the next round.
  useEffect(() => {
    if (reduced || !started) return
    const timers: ReturnType<typeof setTimeout>[] = []
    setStep(0)
    setShown(0)
    const per = PLAN_STEPS[0].ms / (LINES.length + 1)
    LINES.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), per * (i + 1))))
    let at = 0
    PLAN_STEPS.forEach((s, i) => {
      if (i > 0) timers.push(setTimeout(() => setStep(i), at))
      at += s.ms
    })
    timers.push(setTimeout(() => setRound((r) => r + 1), TOTAL))
    return () => timers.forEach(clearTimeout)
  }, [reduced, started, round])

  const name: Step = PLAN_STEPS[step].name
  const approved = name === 'approved'
  const folded = name === 'folded' || name === 'opening'
  const pointer = name === 'opening' ? 'more' : name === 'open' || name === 'pressing' ? 'approve' : 'off'

  // The pointer goes to what it clicks next: measured, so it lands on it at any card width.
  useLayoutEffect(() => {
    const box = ref.current
    const target = pointer === 'more' ? moreRef.current : pointer === 'approve' ? approveRef.current : null
    if (!box || !target) return
    const b = box.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    setAt({ x: t.left - b.left + Math.min(28, t.width / 2), y: t.top - b.top + t.height / 2 })
  }, [pointer, shown])

  return (
    <div ref={ref} className={`plan-demo is-${name}`} aria-hidden="true">
      <div className="pd-chat">
        <div className="pd-you">Retries hit the old host after a failover. Plan the fix first.</div>
        {approved ? (
          <div className="pd-folded">
            <span className="pd-icon">☰</span>
            <span className="pd-folded__title">Retry against the current endpoint</span>
            <span className="pd-dim">4 steps</span>
            <span className="pd-ok">Approved · auto-accept edits ✓</span>
          </div>
        ) : (
          <div className="pd-card">
            <div className="pd-head">
              <span className="pd-icon">☰</span>
              <span className="pd-who">Claude’s plan</span>
              <span className="pd-file">retry-current-endpoint.md ↗</span>
            </div>
            <div className="pd-title">Retry against the current endpoint</div>
            <div className={`pd-body ${folded ? 'is-folded' : ''}`}>
              {LINES.slice(0, shown).map((l, i) => (
                <div key={i} className={`pd-line pd-line--${l.kind}`}>
                  {l.kind === 'li' ? <span className="pd-n">{l.n}.</span> : null}
                  {l.text}
                </div>
              ))}
            </div>
            {folded ? (
              <div ref={moreRef} className="pd-more">
                Show the whole plan ▾
              </div>
            ) : null}
            <div className="pd-actions">
              <span ref={approveRef} className={`pd-btn pd-btn--pri ${name === 'pressing' ? 'is-pressed' : ''}`}>
                Approve · auto-accept edits ⏎
              </span>
              <span className="pd-btn">Approve · ask per edit</span>
              <span className="pd-quiet">Keep planning…</span>
            </div>
          </div>
        )}
        {approved ? (
          <div className="pd-step">
            <span className="pd-tile">✎</span> Edit retry.rs <span className="pd-plus">+1</span> <span className="pd-minus">−1</span>
          </div>
        ) : null}
      </div>
      <div className="pd-box">
        <span className="pd-placeholder">{approved ? 'Add a note. Claude reads it after this step…' : 'Tell Claude what to change in the plan…'}</span>
        <span className={`pd-mode ${approved ? 'is-accept' : ''}`}>{approved ? 'Accept edits' : 'Plan'}</span>
      </div>
      <span
        className={`pd-pointer ${pointer !== 'off' && at ? 'is-on' : ''}`}
        style={at ? { transform: `translate(${at.x}px, ${at.y}px)` } : undefined}
      />
    </div>
  )
}
