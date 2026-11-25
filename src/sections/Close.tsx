import { useRef, type ReactNode } from 'react'
import { DownloadButton } from '../components/DownloadButton'
import { REPO_URL, StarButton } from '../components/StarButton'
import { Icon, type IconName } from '../components/Icon'
import { LogoMark } from '../components/LogoMark'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { useRevealTitles } from '../lib/reveal'
import './close.css'

export function Close() {
  const ref = useRef<HTMLElement>(null)
  useRevealTitles(ref)
  // The mark draws itself as it arrives; the install steps follow one by one. Set up after mount, so
  // the server HTML shows both whole; reduced motion: nothing.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.close__mark .logo-mark__path',
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: 1.3, ease: 'power2.inOut', scrollTrigger: { trigger: '.close__mark', start: 'top 85%', once: true } },
      )
      gsap.from('.close__steps li', {
        y: 18,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.close__steps', start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )
  return (
      <section ref={ref} className="close wrap" aria-labelledby="close-title">
        <LogoMark draw className="close__mark" />
        <h2 id="close-title" className="close__title">Stop babysitting.</h2>
        <p className="close__lede">Let the agents work. fuxx will tell you when one needs you.</p>
        <div className="close__cta cta cta--center">
          <DownloadButton showMeta magnetic />
          <StarButton />
        </div>
        <ol className="close__steps">
          <Step n={1} icon="archive">Unzip it and drag <b>fuxx.app</b> into Applications.</Step>
          <Step n={2} icon="mousePointerClick">Open it once. macOS blocks it the first time; that’s expected, it isn’t signed with an Apple Developer ID yet.</Step>
          <Step n={3} icon="shieldCheck">System Settings <Crumb /> Privacy &amp; Security <Crumb /> <b>Open Anyway</b>. Only once per Mac.</Step>
        </ol>
        <p className="close__after">After that it updates itself.</p>
      </section>
  )
}

function Step({ n, icon, children }: { n: number; icon: IconName; children: ReactNode }) {
  return (
    <li>
      <span className="close__step-n">{n}</span>
      <Icon name={icon} size={16} className="close__step-icon" />
      <p>{children}</p>
    </li>
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

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: REPO_URL, label: 'GitHub', icon: 'folderGit2' },
  { href: `${REPO_URL}/releases`, label: 'Releases', icon: 'tag' },
  { href: 'https://github.com/fuxx-dev/fuxx-sunset-themes', label: 'Plugin samples', icon: 'puzzle' },
]

export function Footer() {
  return (
      <footer className="foot">
        <div className="foot__inner wrap">
          <LogoMark className="foot__mark" />
          <span>fuxx · built with Rust and chaos</span>
          <nav className="foot__links" aria-label="Links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                <Icon name={l.icon} size={14} />
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
  )
}
