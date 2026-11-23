import { shouldRender } from '../src/lib/motion'

test('render only when in view, tab visible and motion allowed', () => {
  expect(shouldRender({ inView: true, hidden: false, reduced: false })).toBe(true)
  expect(shouldRender({ inView: false, hidden: false, reduced: false })).toBe(false)
  expect(shouldRender({ inView: true, hidden: true, reduced: false })).toBe(false)
  expect(shouldRender({ inView: true, hidden: false, reduced: true })).toBe(false)
})

import { renderHook } from '@testing-library/react'
import { useReducedMotion } from '../src/lib/motion'
import { setMatchMedia } from './setup'

test('useReducedMotion follows the media query after mount', () => {
  setMatchMedia((q) => q.includes('prefers-reduced-motion: reduce'))
  const { result } = renderHook(() => useReducedMotion())
  expect(result.current).toBe(true)
  setMatchMedia(() => false)
})
