import { render, fireEvent, act } from '@testing-library/react'
import { setMatchMedia } from './setup'
import { TiltCard } from '../src/components/TiltCard'

afterEach(() => setMatchMedia(() => false))

test('renders its children in an article', () => {
  const { container, getByText } = render(<TiltCard className="card">hello</TiltCard>)
  expect(getByText('hello')).toBeTruthy()
  expect(container.querySelector('article.card')).toBeTruthy()
})

test('follows the pointer with the glow, once a frame, writing only the glow (not the whole card)', async () => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
  const { container } = render(<TiltCard>x</TiltCard>)
  const el = container.querySelector('article')!
  const dot = container.querySelector<HTMLElement>('.tilt__glow-dot')!
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} })
  await act(async () => { fireEvent.pointerMove(el, { clientX: 150, clientY: 25 }) })
  await act(async () => { vi.advanceTimersToNextFrame() })
  expect(dot.style.getPropertyValue('--gx')).toBe('150px')
  expect(dot.style.getPropertyValue('--gy')).toBe('25px')
  expect(el.style.getPropertyValue('--gx')).toBe('')
  vi.useRealTimers()
})

test('reduced motion: no tilt, no transform, no glow tracking', async () => {
  setMatchMedia((q) => q.includes('prefers-reduced-motion: reduce'))
  const { container } = render(<TiltCard>x</TiltCard>)
  const el = container.querySelector('article')!
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} })
  await act(async () => { fireEvent.pointerMove(el, { clientX: 190, clientY: 5 }) })
  expect(['', 'none']).toContain(el.style.transform)
  expect(el.style.getPropertyValue('--gx')).toBe('')
  expect(el.style.opacity === '0').toBe(false)
})
