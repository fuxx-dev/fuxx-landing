import { useState } from 'react'
import { copyText } from '../lib/clipboard'

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const onClick = async () => {
    const r = await copyText(text)
    setState(r)
    window.setTimeout(() => setState('idle'), 1800)
  }
  return (
    <button type="button" className={`copy copy--${state}`} onClick={onClick} aria-live="polite">
      {state === 'copied' ? 'Copied ✓' : state === 'manual' ? 'Press ⌘C' : label}
    </button>
  )
}
