import { render, screen, act } from '@testing-library/react'

const loadScene = vi.fn()
vi.mock('../src/hero/load', () => ({ loadHeroScene: () => loadScene() }))
const webgl = vi.hoisted(() => ({ ok: false }))
vi.mock('../src/lib/webgl', () => ({ canUseWebGL: () => webgl.ok }))
const motion = vi.hoisted(() => ({ reduced: false }))
vi.mock('../src/lib/motion', async (orig) => ({
  ...(await orig<typeof import('../src/lib/motion')>()),
  prefersReducedMotion: () => motion.reduced,
  isNarrow: () => false,
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
