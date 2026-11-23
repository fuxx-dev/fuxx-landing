import { shouldRender } from '../src/lib/motion'

test('render only when in view, tab visible and motion allowed', () => {
  expect(shouldRender({ inView: true, hidden: false, reduced: false })).toBe(true)
  expect(shouldRender({ inView: false, hidden: false, reduced: false })).toBe(false)
  expect(shouldRender({ inView: true, hidden: true, reduced: false })).toBe(false)
  expect(shouldRender({ inView: true, hidden: false, reduced: true })).toBe(false)
})
