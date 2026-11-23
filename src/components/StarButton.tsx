import { useEffect, useState } from 'react'
import { getStarCount, starLabel } from '../lib/stars'
import './buttons.css'

export const REPO_URL = 'https://github.com/fitzfitz/fuxx-cli'

export function StarButton({ compact = false }: { compact?: boolean }) {
  const [stars, setStars] = useState<number | null>(null)
  useEffect(() => {
    let live = true
    getStarCount().then((n) => live && setStars(n))
    return () => { live = false }
  }, [])
  return (
    <a className={`btn btn--ghost ${compact ? 'btn--compact' : ''}`} href={REPO_URL}>
      <span aria-hidden="true" className="btn__icon">★</span>
      {compact ? 'Star' : 'Star on GitHub'}
      {starLabel(stars) ? <span className="btn__count">{starLabel(stars)}</span> : null}
    </a>
  )
}
