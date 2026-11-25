import { useRef } from 'react'
import { plugins } from '../content/plugins'
import { byId } from '../content/inventory'
import { PLUGIN_CAPABILITIES } from '../content/plugins'
import { CopyButton } from '../components/CopyButton'
import { FuxxWindow } from '../components/FuxxWindow'
import { Icon } from '../components/Icon'
import { LinkTypeDemo } from '../components/LinkTypeDemo'
import { TiltCard } from '../components/TiltCard'
import { useReducedMotion } from '../lib/motion'
import { useRevealTitles } from '../lib/reveal'
import './plugins.css'

export function Plugins() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useRevealTitles(ref)
  return (
    <section ref={ref} id="plugins" className="plugins wrap" aria-labelledby="plugins-title">
      <p className="kicker">Plugins</p>
      <h2 id="plugins-title" className="section-title">Paste a GitHub link. That’s the install.</h2>

      <div className="plugins__system">
        <div>
          <p className="plugins__lede">
            A plugin is a public GitHub repo with a <code>fuxx-plugin.conf</code> at the top. Install it from
            Settings → Plugins, remove it from the same page. When the repo has something new, an Update button shows up there.
          </p>
          <ul className="plugins__caps">
            {PLUGIN_CAPABILITIES.map((id) => (
              <li key={id}>
                <Icon name="chevronRight" size={14} className="plugins__bullet" />
                {byId.get(id)!.text}
              </li>
            ))}
          </ul>
        </div>
        <FuxxWindow title="Settings — Plugins" className="plugins__mock">
          <SettingsMock reduced={reduced} />
        </FuxxWindow>
      </div>

      <div className="plugins__cards">
        {plugins.samples.map((p) => (
          <TiltCard key={p.repo} className="pcard">
            <p className="pcard__kind">{p.kind} · try it</p>
            <h3 className="pcard__name">{p.name}</h3>
            <p className="pcard__blurb">{p.blurb}</p>
            <div className="pcard__repo">
              <a href={`https://github.com/${p.repo}`}>{p.repo}</a>
              <CopyButton text={`https://github.com/${p.repo}`} label="Copy link" />
            </div>
          </TiltCard>
        ))}
        <TiltCard className="pcard">
          <p className="pcard__kind">helper plugin · {plugins.completes.version} · try it</p>
          <h3 className="pcard__name">fuxx-completes</h3>
          <p className="pcard__blurb">{plugins.completes.blurb}</p>
          <GhostDemo />
          <div className="pcard__repo">
            <a href={`https://github.com/${plugins.completes.repo}`}>{plugins.completes.repo}</a>
            <CopyButton text={`https://github.com/${plugins.completes.repo}`} label="Copy link" />
          </div>
          <p className="pcard__also">
            Outside fuxx (zsh, bash): <code>{plugins.completes.brew}</code>
          </p>
        </TiltCard>
      </div>

      <div className="plugins__own">
        <div>
          <h3 className="plugins__own-title">Write your own</h3>
          <p className="plugins__lede">
            Themes are plain text files. Helpers bring a <code>bin</code> folder and zsh scripts, and can declare
            settings. <a href={plugins.docsUrl}>The whole format is in the README.</a>
          </p>
        </div>
        <div className="plugins__code">
          <div className="plugins__code-bar">
            <span>fuxx-plugin.conf</span>
            <CopyButton text={plugins.confSnippet} />
          </div>
          <pre><code>{plugins.confSnippet}</code></pre>
        </div>
      </div>
    </section>
  )
}

function SettingsMock({ reduced }: { reduced: boolean }) {
  return (
    <div className="smock" aria-label="Settings, Plugins page with the two sample plugins installed" role="img">
      <LinkTypeDemo url={`https://github.com/${plugins.samples[0].repo}`} reduced={reduced} />
      {[
        { name: 'Sunset Themes', v: '1.0.0', d: 'Warm themes from the design team.' },
        { name: 'Hello Helper', v: '1.0.0', d: 'A tiny test plugin: a fuxx-hello command and a FUXX_HELLO variable.' },
      ].map((p) => (
        <div key={p.name} className="smock__row">
          <div className="smock__head">
            <span className="smock__name">{p.name}</span>
            <span className="smock__ver">{p.v}</span>
            <span className="smock__pill">Installed</span>
            <span className="smock__remove">Remove</span>
          </div>
          <p className="smock__desc">{p.d}</p>
        </div>
      ))}
    </div>
  )
}

function GhostDemo() {
  return (
    <div className="ghost" aria-hidden="true">
      <div className="ghost__line">
        <span className="ghost__prompt">~/proj $</span> <span className="ghost__typed">git push o</span>
        <span className="ghost__hint">rigin feature/login</span>
      </div>
      <ol className="ghost__list">
        <li><span>1</span> npm run dev</li>
        <li><span>2</span> npm run build</li>
        <li><span>3</span> npm run test</li>
      </ol>
    </div>
  )
}
