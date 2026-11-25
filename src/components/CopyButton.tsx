import { useEffect, useRef, useState } from 'react'
import { copyText } from '../lib/clipboard'
import { Icon } from './Icon'

const RESET_MS = 1800
const MANUAL_MS = 6000

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const timer = useRef<number | undefined>(undefined)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  // The browser refused: show the text selected so ⌘C works.
  useEffect(() => {
    if (state === 'manual') {
      input.current?.focus()
      input.current?.select()
    }
  }, [state])

  const onClick = async () => {
    const r = await copyText(text)
    setState(r)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), r === 'manual' ? MANUAL_MS : RESET_MS)
  }

  return (
    <span className="copy-wrap">
      {state === 'manual' ? (
        <input ref={input} className="copy__manual" readOnly value={text} aria-label="Press ⌘C to copy" onFocus={(e) => e.currentTarget.select()} />
      ) : null}
      <button type="button" className={`copy copy--${state}`} onClick={onClick} aria-live="polite">
        {state === 'copied' ? (
          <>
            <Icon name="check" size={13} /> Copied
          </>
        ) : state === 'manual' ? (
          'Press ⌘C'
        ) : (
          <>
            <Icon name="copy" size={13} /> {label}
          </>
        )}
      </button>
    </span>
  )
}
