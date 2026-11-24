import './tracks-demo.css'

/**
 * A drawn stand-in for fuxx's file tracks (the agent activity view), built from the words and marks in fuxx's own
 * spec: one bead per call per file, in time order, a checks track, a summary per track, and the turn ledger in the
 * agent box's tab. Swap it for the `agent-tracks-busy` render once that is synced.
 */
type Bead = 'read' | 'search' | 'edit' | 'script' | 'pass' | 'planned' | 'running'
type Track = { name: string; changed?: boolean; beads: Partial<Record<number, Bead>>; summary: string }

const COLUMNS = 8
const TRACKS: Track[] = [
  { name: 'checks', beads: { 1: 'pass', 3: 'planned', 6: 'pass', 7: 'running' }, summary: 'red, as planned · 2 passed' },
  { name: 'link_route.rs', changed: true, beads: { 0: 'read', 4: 'edit' }, summary: 'edited · +2 −1' },
  { name: 'tests/cli.rs', changed: true, beads: { 2: 'search', 5: 'edit' }, summary: 'edited · +41 −0' },
  { name: 'main.rs', beads: { 5: 'script' }, summary: 'touched by a script' },
]

const LABEL =
  'An illustration of an agent step in fuxx: 8 actions across 3 files drawn as tracks, one bead per call. ' +
  'A checks track shows a planned red run, two passes and a running test; the agent box’s tab reads ' +
  '“Running tests 0:14 · 2 changed · checks 2/3”.'

export function TracksDemo() {
  return (
    <div className="tracks" role="img" aria-label={LABEL}>
      <div className="tracks__step" aria-hidden="true">
        <p className="tracks__words">Add the link route and its tests</p>
        <p className="tracks__head">8 actions · 3 files · 0:31</p>
        <div className="tracks__rows">
          {TRACKS.map((t) => (
            <div key={t.name} className={`tracks__row ${t.changed ? 'is-changed' : ''}`}>
              <span className="tracks__name">{t.name}</span>
              <span className="tracks__lane">
                {Array.from({ length: COLUMNS }, (_, i) => {
                  const kind = t.beads[i]
                  return (
                    <span key={i} className="tracks__slot">
                      {kind ? <span className={`bead bead--${kind}`} style={{ ['--i' as string]: i }} /> : null}
                    </span>
                  )
                })}
              </span>
              <span className="tracks__sum">{t.summary}</span>
            </div>
          ))}
        </div>
        <div className="tracks__box">
          <span className="tracks__tab">
            <span className="tracks__dot" />
            <span className="tracks__ledger">
              Running tests <span className="tracks__time">0:14</span> · 2 changed · checks 2/3
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
