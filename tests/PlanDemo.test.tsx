import { render, act } from '@testing-library/react'
import { PlanDemo, PLAN_STEPS } from '../src/components/PlanDemo'

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

test('reduced motion shows the approved card at once', () => {
  const { container } = render(<PlanDemo reduced />)
  expect(container.textContent).toContain('Approved · auto-accept edits ✓')
  expect(container.textContent).toContain('Accept edits')
})

test('waits until in view, then plays the plan through to approved', async () => {
  const { container } = render(<PlanDemo />)
  expect(container.textContent).not.toContain('Approved · auto-accept edits ✓')
  await act(async () => { fire?.() })
  const total = PLAN_STEPS.reduce((ms, s) => ms + s.ms, 0)
  await act(async () => { vi.advanceTimersByTime(total - PLAN_STEPS[PLAN_STEPS.length - 1].ms) })
  expect(container.textContent).toContain('Approved · auto-accept edits ✓')
  expect(container.textContent).toContain('Accept edits')
})

test('the steps stream the plan, fold, open, approve, then rest', () => {
  expect(PLAN_STEPS.map((s) => s.name)).toEqual(['streaming', 'folded', 'opening', 'open', 'pressing', 'approved'])
})
