import { parseManifest, outputPaths, overBudget, staleFiles } from '../scripts/lib/shots.mjs'

const entry = { shot: 'agent-sidebar-waiting', name: 'agent-waiting', alt: 'Sidebar with a waiting agent', width: 720 }

test('parseManifest accepts a valid list', () => {
  expect(parseManifest([entry])).toEqual([entry])
})

test('parseManifest rejects an entry without alt', () => {
  const { alt: _alt, ...noAlt } = entry
  expect(() => parseManifest([noAlt])).toThrow(/missing alt/)
})

test('parseManifest rejects duplicate names', () => {
  expect(() => parseManifest([entry, { ...entry, shot: 'other' }])).toThrow(/duplicate name/)
})

test('parseManifest rejects a non-array', () => {
  expect(() => parseManifest({})).toThrow(/array/)
})

test('outputPaths puts both formats under public/shots', () => {
  expect(outputPaths('agent-waiting')).toEqual({
    avif: 'public/shots/agent-waiting.avif',
    webp: 'public/shots/agent-waiting.webp',
  })
})

test('overBudget is strict above 120 KB', () => {
  expect(overBudget(120_001)).toBe(true)
  expect(overBudget(120_000)).toBe(false)
})

test('parseManifest keeps a valid crop', () => {
  const crop = { left: 0, top: 175, width: 720, height: 270 }
  expect(parseManifest([{ ...entry, crop }])[0].crop).toEqual(crop)
})

test('parseManifest rejects a crop with a missing side', () => {
  expect(() => parseManifest([{ ...entry, crop: { left: 0, top: 0, width: 10 } }])).toThrow(/crop/)
})

test('staleFiles lists outputs whose name left the manifest', () => {
  const existing = ['a.avif', 'a.webp', 'gone.avif', 'gone.webp', '.DS_Store']
  expect(staleFiles(existing, ['a'])).toEqual(['gone.avif', 'gone.webp'])
})
