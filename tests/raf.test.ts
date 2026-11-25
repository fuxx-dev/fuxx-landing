import { rafThrottle } from '../src/lib/raf'

beforeEach(() => vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] }))
afterEach(() => vi.useRealTimers())

test('runs once per frame, with the latest arguments', () => {
  const seen: number[] = []
  const run = rafThrottle((n: number) => seen.push(n))
  run(1)
  run(2)
  run(3)
  expect(seen).toEqual([])
  vi.advanceTimersToNextFrame()
  expect(seen).toEqual([3])
  run(4)
  vi.advanceTimersToNextFrame()
  expect(seen).toEqual([3, 4])
})

test('cancel() drops a pending call', () => {
  const fn = vi.fn()
  const run = rafThrottle(fn)
  run()
  run.cancel()
  vi.advanceTimersToNextFrame()
  expect(fn).not.toHaveBeenCalled()
})
