import { DownloadButton } from './DownloadButton'
import { LogoMark } from './LogoMark'
import { StarButton } from './StarButton'
import './header.css'

export function Header() {
  return (
    <header className="hdr">
      <div className="hdr__inner wrap">
        <a className="hdr__logo" href="#top" aria-label="fuxx, back to top">
          <LogoMark className="hdr__mark" /> fuxx
        </a>
        <nav className="hdr__nav" aria-label="Sections">
          <a href="#features">Features</a>
          <a href="#plugins">Plugins</a>
        </nav>
        <div className="hdr__cta">
          <StarButton compact />
          <DownloadButton compact />
        </div>
      </div>
    </header>
  )
}
