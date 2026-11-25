import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { DownloadButton } from './DownloadButton'
import { Icon, type IconName } from './Icon'
import { LogoMark } from './LogoMark'
import { ScrollProgress } from './ScrollProgress'
import { StarButton } from './StarButton'
import './header.css'

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '#features', label: 'Features', icon: 'layoutGrid' },
  { href: '#plugins', label: 'Plugins', icon: 'puzzle' },
]
/** Past this much scroll, the header tucks up and fills in. */
const COMPACT_AT = 40

export function Header() {
  const [hover, setHover] = useState<number | null>(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const sync = () => setCompact(window.scrollY > COMPACT_AT)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  return (
    <header className={`hdr ${compact ? 'hdr--compact' : ''}`}>
      <div className="hdr__inner wrap">
        <a className="hdr__logo" href="#top" aria-label="fuxx, back to top">
          <LogoMark className="hdr__mark" /> fuxx
        </a>
        <nav className="hdr__nav" aria-label="Sections" onMouseLeave={() => setHover(null)}>
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              {hover === i ? <motion.span layoutId="hdr-nav-pill" className="hdr__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} /> : null}
              <Icon name={n.icon} size={14} />
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hdr__cta">
          <StarButton compact />
          <DownloadButton compact />
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
