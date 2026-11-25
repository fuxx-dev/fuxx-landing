import { readFileSync } from 'node:fs'
import { INTRO_HIDDEN, INTRO_SEL } from '../src/lib/intro'

// The head script's class hides exactly what the intro brings in: a target missing from the CSS
// would flash whole before the intro, and an extra one would stay hidden until it ends.
test('the intro-pending CSS hides exactly the targets the intro brings in', () => {
  const css = readFileSync('src/styles/global.css', 'utf8')
  const list = css.match(/html\.intro-pending\s*:is\(([^)]*)\)/)![1]
  const selectors = list.split(',').map((s) => s.trim().replace(/\s+/g, ' '))
  expect(new Set(selectors)).toEqual(new Set(INTRO_HIDDEN))
  for (const s of INTRO_HIDDEN) expect(Object.values(INTRO_SEL)).toContain(s)
})
