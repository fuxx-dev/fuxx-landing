import { useRef } from 'react'
import { motion } from 'motion/react'
import { release } from '../lib/release'
import { useMagnet } from '../lib/magnet'
import { Icon } from './Icon'
import './buttons.css'

/** The springy hover and press every button shares (Motion skips it under reduced motion). */
export const PRESS = { hover: { scale: 1.03 }, tap: { scale: 0.97 } } as const

export function DownloadButton({
  compact = false,
  showMeta = false,
  magnetic = false,
}: {
  compact?: boolean
  showMeta?: boolean
  /** Leans toward a near pointer (the hero's and the close's big buttons). */
  magnetic?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const pull = useMagnet(ref, 6, magnetic)
  return (
    <div className={`dl ${compact ? 'dl--compact' : ''}`}>
      <motion.a
        ref={ref}
        className="btn btn--primary"
        href={release.zipUrl}
        style={magnetic ? pull : undefined}
        whileHover={PRESS.hover}
        whileTap={PRESS.tap}
      >
        <Icon name="download" className="btn__icon" />
        {compact ? 'Download' : 'Download for macOS'}
        {compact ? <span className="visually-hidden"> for macOS</span> : null}
      </motion.a>
      {showMeta ? (
        <p className="dl__meta">
          {release.version ? <>v{release.version} · </> : null}macOS 11+ · Apple Silicon + Intel
        </p>
      ) : null}
    </div>
  )
}
