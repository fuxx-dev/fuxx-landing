import { useRef } from 'react'
import { DownloadButton } from '../components/DownloadButton'
import { REPO_URL, StarButton } from '../components/StarButton'
import { Icon } from '../components/Icon'
import { LogoMark } from '../components/LogoMark'
import { useRevealTitles } from '../lib/reveal'
import './close.css'

export function Close() {
  const ref = useRef<HTMLElement>(null)
  useRevealTitles(ref)
  return (
      <section ref={ref} className="close wrap" aria-labelledby="close-title">
        <LogoMark className="close__mark" />
        <h2 id="close-title" className="close__title">Stop babysitting.</h2>
        <p className="close__lede">Let the agents work. fuxx will tell you when one needs you.</p>
        <div className="close__cta">
          <DownloadButton showMeta />
          <StarButton />
        </div>
        <ol className="close__steps">
          <li><span>1</span><p>Unzip it and drag <b>fuxx.app</b> into Applications.</p></li>
          <li><span>2</span><p>Open it once. macOS blocks it the first time; that’s expected, it isn’t signed with an Apple Developer ID yet.</p></li>
          <li><span>3</span><p>System Settings <Crumb /> Privacy &amp; Security <Crumb /> <b>Open Anyway</b>. Only once per Mac.</p></li>
        </ol>
        <p className="close__after">After that it updates itself.</p>
      </section>
  )
}

export function Footer() {
  return (
      <footer className="foot">
        <div className="foot__inner wrap">
          <LogoMark className="foot__mark" />
          <span>fuxx · built with Rust and chaos</span>
          <nav className="foot__links" aria-label="Links">
            <a href={REPO_URL}>GitHub</a>
            <a href={`${REPO_URL}/releases`}>Releases</a>
            <a href="https://github.com/fuxx-dev/fuxx-sunset-themes">Plugin samples</a>
          </nav>
        </div>
      </footer>
  )
}

/** A menu path's step arrow: an icon you see, an arrow a screen reader reads. */
function Crumb() {
  return (
    <>
      <Icon name="chevronRight" size={13} className="close__crumb" />
      <span className="visually-hidden">→</span>
    </>
  )
}
