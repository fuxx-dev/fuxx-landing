import './keys.css'

/** Splits a shortcut like "⇧⌘U", "⌥⌘[ / ⌥⌘]" or "⌘1–9" into keycaps. */
export function splitCombo(combo: string): string[][] {
  return combo.split(' / ').map((part) => {
    const caps: string[] = []
    let rest = part.trim()
    while (rest.length) {
      const mod = rest.match(/^[⇧⌘⌥⌃]/)
      if (mod) {
        caps.push(mod[0])
        rest = rest.slice(1)
        continue
      }
      caps.push(rest)
      break
    }
    return caps
  })
}

export function Keys({ combo }: { combo: string }) {
  return (
    <span className="keys" aria-label={combo}>
      {splitCombo(combo).map((caps, i) => (
        <span key={i} className="keys__group" aria-hidden="true">
          {i > 0 ? <span className="keys__or">/</span> : null}
          {caps.map((c, j) => (
            <kbd key={j} className="keys__cap">{c}</kbd>
          ))}
        </span>
      ))}
    </span>
  )
}
