import { release } from '../lib/release'
import './buttons.css'

export function DownloadButton({ compact = false, showMeta = false }: { compact?: boolean; showMeta?: boolean }) {
  return (
    <div className={`dl ${compact ? 'dl--compact' : ''}`}>
      <a className="btn btn--primary" href={release.zipUrl}>
        <span aria-hidden="true" className="btn__icon">⤓</span>
        {compact ? 'Download' : 'Download for macOS'}
        {compact ? <span className="visually-hidden"> for macOS</span> : null}
      </a>
      {showMeta ? (
        <p className="dl__meta">
          {release.version ? <>v{release.version} · </> : null}macOS 11+ · Apple Silicon + Intel
        </p>
      ) : null}
    </div>
  )
}
