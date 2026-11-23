import { render, screen, act } from '@testing-library/react'
import { TypedTerminal } from '../src/components/TypedTerminal'
import { replays } from '../src/content/replays'

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

const lines = () => replays.cli.map((l) => l.text)

test('reduced motion shows the whole transcript at once', () => {
  const { container } = render(<TypedTerminal script="cli" reduced />)
  for (const t of lines()) expect(container.textContent).toContain(t)
})

test('waits until in view, then types everything out', async () => {
  const { container } = render(<TypedTerminal script="cli" />)
  expect(container.textContent).not.toContain(replays.cli[1].text)
  await act(async () => { fire?.() })
  // Each keystroke schedules the next after React re-renders, so step the clock.
  for (let i = 0; i < 400; i++) await act(async () => { vi.advanceTimersByTime(100) })
  for (const t of lines()) expect(container.textContent).toContain(t)
})

test('screen readers get the full transcript', () => {
  render(<TypedTerminal script="cli" />)
  const el = screen.getByRole('img')
  expect(el.getAttribute('aria-label')).toContain(replays.cli[0].text)
  expect(el.getAttribute('aria-label')).toContain(replays.cli[replays.cli.length - 1].text)
})

test('paused: in view but does not type until unpaused', async () => {
  const { container, rerender } = render(<TypedTerminal script="cli" paused />)
  await act(async () => { fire?.() })
  for (let i = 0; i < 50; i++) await act(async () => { vi.advanceTimersByTime(100) })
  expect(container.textContent).not.toContain(replays.cli[1].text)
  rerender(<TypedTerminal script="cli" />)
  for (let i = 0; i < 400; i++) await act(async () => { vi.advanceTimersByTime(100) })
  expect(container.textContent).toContain(replays.cli[replays.cli.length - 1].text)
})

test('reduced motion arriving after mount shows the end state at once, without typing', async () => {
  const { container, rerender } = render(<TypedTerminal script="cli" />)
  rerender(<TypedTerminal script="cli" reduced />)
  for (const t of lines()) expect(container.textContent).toContain(t)
})
