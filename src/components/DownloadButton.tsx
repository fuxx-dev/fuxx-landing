import { motion } from 'motion/react'
import { release } from '../lib/release'
import { Icon } from './Icon'
import './buttons.css'

/** The springy hover and press every button shares (Motion skips it under reduced motion). */
export const PRESS = { hover: { scale: 1.03 }, tap: { scale: 0.97 } } as const

export function DownloadButton({ compact = false, showMeta = false }: { compact?: boolean; showMeta?: boolean }) {
  return (
    <div className={`dl ${compact ? 'dl--compact' : ''}`}>
      <motion.a className="btn btn--primary" href={release.zipUrl} whileHover={PRESS.hover} whileTap={PRESS.tap}>
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
