import { inventory } from '../src/content/inventory'
import { chapters } from '../src/content/chapters'
import { grid } from '../src/content/grid'
import { PLUGIN_CAPABILITIES } from '../src/content/plugins'
import shots from '../src/generated/shots.json'

test('every capability in the inventory is shown somewhere, and nothing else is', () => {
  const shown = new Set([...chapters.flatMap((c) => c.capabilities), ...grid.flatMap((c) => c.capabilities), ...PLUGIN_CAPABILITIES])
  const known = new Set(inventory.map((c) => c.id))
  const missing = [...known].filter((id) => !shown.has(id))
  const unknown = [...shown].filter((id) => !known.has(id))
  expect({ missing, unknown }).toEqual({ missing: [], unknown: [] })
})

test('every referenced shot exists, and none is a fake-plugin render', () => {
  const names = new Set(Object.keys(shots))
  const used = [
    ...chapters.flatMap((c) => ('shots' in c.visual ? c.visual.shots : [])),
    ...grid.flatMap((c) => (c.visual && 'shot' in c.visual ? [c.visual.shot] : [])),
  ]
  for (const s of used) {
    expect(names.has(s), s).toBe(true)
    expect(s.startsWith('preferences-plugins')).toBe(false)
  }
})
