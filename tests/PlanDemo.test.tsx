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

test('reduced motion shows the approved card at once, folded to one line', () => {
  const { container } = render(<PlanDemo reduced />)
  expect(container.textContent).toContain('Plan approved · auto-accept edits')
  expect(container.textContent).toContain('Show plan')
  expect(container.textContent).toContain('Accept edits')
})

test('the waiting card has fuxx 0.13.10’s one header line and one row of answers, Auto mode second', async () => {
  const { container } = render(<PlanDemo />)
  await act(async () => { fire?.() })
  await act(async () => { vi.advanceTimersByTime(PLAN_STEPS[0].ms) })
  const head = container.querySelector('.pd-head')!.textContent
  expect(head).toContain('Claude’s plan')
  expect(head).toContain('retry-current-endpoint.md')
  expect(head).toContain('4 steps')
  expect(container.querySelector('.pd-title')).toBeNull()
  expect(container.querySelector('.pd-more')!.textContent).toContain('Show all')
  expect([...container.querySelectorAll('.pd-actions > *')].map((b) => b.textContent!.trim())).toEqual(['Approve · auto-accept', 'Approve · Auto mode', 'Approve', 'Keep planning'])
})

test('waits until in view, then plays the plan through to approved', async () => {
  const { container } = render(<PlanDemo />)
  expect(container.textContent).not.toContain('Plan approved')
  await act(async () => { fire?.() })
  const total = PLAN_STEPS.reduce((ms, s) => ms + s.ms, 0)
  await act(async () => { vi.advanceTimersByTime(total - PLAN_STEPS[PLAN_STEPS.length - 1].ms) })
  expect(container.textContent).toContain('Plan approved · auto-accept edits')
  expect(container.textContent).toContain('Accept edits')
})

test('the steps stream the plan, fold, open, approve, then rest', () => {
  expect(PLAN_STEPS.map((s) => s.name)).toEqual(['streaming', 'folded', 'opening', 'open', 'pressing', 'approved'])
})
