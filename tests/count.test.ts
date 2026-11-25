import { countUp } from '../src/lib/count'

test('counts up eased, in whole numbers, ending exactly on the target', () => {
  const steps = countUp(0, 1234, 900)
  expect(steps.length).toBeGreaterThan(20)
  expect(steps[steps.length - 1]).toBe(1234)
  for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1])
  for (const s of steps) expect(Number.isInteger(s)).toBe(true)
  // Eased out: the first half of the time covers more than half the distance.
  expect(steps[Math.floor(steps.length / 2)]).toBeGreaterThan(617)
})

test('no time or no distance: just the target', () => {
  expect(countUp(0, 42, 0)).toEqual([42])
  expect(countUp(42, 42, 900).every((s) => s === 42)).toBe(true)
})
