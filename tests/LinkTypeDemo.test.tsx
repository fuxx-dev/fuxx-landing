import { render, act } from '@testing-library/react'
import { LinkTypeDemo } from '../src/components/LinkTypeDemo'

const URL = 'https://github.com/fuxx-dev/fuxx-sunset-themes'
let fire: (() => void) | null = null
beforeEach(() => {
  vi.useFakeTimers()
  fire = null
  ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: IntersectionObserverCallback) {
      fire = () => cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
})
afterEach(() => vi.useRealTimers())

test('reduced motion: the whole link and the check, at once', () => {
  const { container } = render(<LinkTypeDemo url={URL} reduced />)
  expect(container.textContent).toContain(URL)
  expect(container.querySelector('.ltd__ok')).toBeTruthy()
})

test('waits until in view, then types the link to the end and checks it', async () => {
  const { container } = render(<LinkTypeDemo url={URL} />)
  expect(container.textContent).not.toContain(URL)
  expect(container.querySelector('.ltd__ok')).toBeNull()
  await act(async () => { fire?.() })
  for (let i = 0; i < 120; i++) await act(async () => { vi.advanceTimersByTime(60) })
  expect(container.textContent).toContain(URL)
  expect(container.querySelector('.ltd__ok')).toBeTruthy()
})
