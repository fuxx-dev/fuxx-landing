import { render, screen, act } from '@testing-library/react'

const loadScene = vi.fn()
vi.mock('../src/hero/load', () => ({ loadHeroScene: () => loadScene() }))
// The first-load intro is tested on its own (intro.test.ts, HeroIntro.test.tsx); these are about the scene.
vi.mock('../src/lib/intro', () => ({ playIntro: () => ({ cut() {}, revert() {}, timeline: null }) }))
const webgl = vi.hoisted(() => ({ ok: false }))
vi.mock('../src/lib/webgl', () => ({ canUseWebGL: () => webgl.ok }))
const motion = vi.hoisted(() => ({ reduced: false }))
const narrow = vi.hoisted(() => ({ value: false }))
vi.mock('../src/lib/motion', async (orig) => ({
  ...(await orig<typeof import('../src/lib/motion')>()),
  prefersReducedMotion: () => motion.reduced,
  isNarrow: () => narrow.value,
}))

import { Hero } from '../src/sections/Hero'

beforeEach(() => { loadScene.mockReset(); vi.useFakeTimers() })
afterEach(() => vi.useRealTimers())

test('without WebGL: static mascot, both buttons, no scene loaded', async () => {
  webgl.ok = false; motion.reduced = false
  render(<Hero />)
  await act(async () => { vi.advanceTimersByTime(1000) })
  expect(screen.getByLabelText('fuxx mascot')).toBeTruthy()
  expect(screen.getByRole('link', { name: /Download for macOS/ })).toBeTruthy()
  expect(screen.getByRole('link', { name: /Star/ })).toBeTruthy()
  expect(loadScene).not.toHaveBeenCalled()
})

test('reduced motion: static hero even with WebGL', async () => {
  webgl.ok = true; motion.reduced = true
  render(<Hero />)
  await act(async () => { vi.advanceTimersByTime(1000) })
  expect(screen.getByLabelText('fuxx mascot')).toBeTruthy()
  expect(loadScene).not.toHaveBeenCalled()
})

test('a lost WebGL context brings the static mascot back', async () => {
  webgl.ok = true; motion.reduced = false
  const scene = { start: vi.fn(), stop: vi.fn(), setPointer: vi.fn(), dispose: vi.fn() }
  loadScene.mockResolvedValue({ createHeroScene: () => scene })
  const { container } = render(<Hero />)
  await act(async () => { vi.advanceTimersByTime(1000) })
  await act(async () => { await Promise.resolve() })
  const hero = container.querySelector('.hero')!
  expect(hero.classList.contains('hero--live')).toBe(true)
  await act(async () => { container.querySelector('canvas')!.dispatchEvent(new Event('webglcontextlost')) })
  expect(hero.classList.contains('hero--live')).toBe(false)
  expect(scene.stop).toHaveBeenCalled()
})

test('crossing the phone breakpoint rebuilds the scene in the right mode', async () => {
  webgl.ok = true; motion.reduced = false
  const made: boolean[] = []
  const scene = { start: vi.fn(), stop: vi.fn(), setPointer: vi.fn(), dispose: vi.fn() }
  loadScene.mockResolvedValue({ createHeroScene: (_c: unknown, o: { narrow: boolean }) => { made.push(o.narrow); return scene } })
  render(<Hero />)
  await act(async () => { vi.advanceTimersByTime(1000) })
  await act(async () => { await Promise.resolve() })
  expect(made).toEqual([false])
  narrow.value = true
  await act(async () => { window.dispatchEvent(new Event('resize')); vi.advanceTimersByTime(400) })
  await act(async () => { await Promise.resolve() })
  expect(made).toEqual([false, true])
  expect(scene.dispose).toHaveBeenCalled()
  narrow.value = false
})
