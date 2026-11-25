import {
  INTRO_PENDING,
  INTRO_PENDING_SCRIPT,
  INTRO_SAFETY_MS,
  INTRO_SKIPPED,
  introWasSkipped,
  releaseIntroPending,
} from '../src/lib/intro-pending'

const html = document.documentElement
const run = () => new Function(INTRO_PENDING_SCRIPT)()
const setReduced = (reduce: boolean) => {
  window.matchMedia = ((q: string) => ({ matches: reduce && q.includes('reduce'), media: q })) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  html.className = ''
  vi.useFakeTimers()
  setReduced(false)
})
afterEach(() => vi.useRealTimers())

test('the head script hides the intro targets before first paint', () => {
  run()
  expect(html.classList.contains(INTRO_PENDING)).toBe(true)
})

test('under reduced motion the head script does nothing: the page shows as served', () => {
  setReduced(true)
  run()
  expect(html.classList.contains(INTRO_PENDING)).toBe(false)
  vi.advanceTimersByTime(INTRO_SAFETY_MS + 1)
  expect(html.className).toBe('')
})

test('if the app never starts, the safety timeout shows the page and marks the intro skipped', () => {
  run()
  vi.advanceTimersByTime(INTRO_SAFETY_MS - 1)
  expect(html.classList.contains(INTRO_PENDING)).toBe(true)
  vi.advanceTimersByTime(1)
  expect(html.classList.contains(INTRO_PENDING)).toBe(false)
  expect(introWasSkipped(html)).toBe(true)
})

test('once the intro releases the page, the safety timeout no longer skips it', () => {
  run()
  expect(introWasSkipped(html)).toBe(false)
  releaseIntroPending(html)
  expect(html.classList.contains(INTRO_PENDING)).toBe(false)
  vi.advanceTimersByTime(INTRO_SAFETY_MS + 1)
  expect(html.classList.contains(INTRO_SKIPPED)).toBe(false)
})

test('the safety timeout is about two and a half seconds', () => {
  expect(INTRO_SAFETY_MS).toBe(2500)
})
