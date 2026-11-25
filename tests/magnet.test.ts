import { magnetOffset } from '../src/lib/magnet'

const opts = { strength: 6, reach: 120, reduced: false }
const len = (o: { x: number; y: number }) => Math.hypot(o.x, o.y)

test('leans toward a near pointer, never more than the strength', () => {
  for (let d = 0; d <= 120; d += 5) {
    for (const [ux, uy] of [[1, 0], [0, -1], [0.6, 0.8]]) {
      const o = magnetOffset({ dx: ux * d, dy: uy * d }, opts)
      expect(len(o)).toBeLessThanOrEqual(6 + 1e-9)
      if (d > 0 && d < 120) {
        expect(len(o)).toBeGreaterThan(0)
        // Toward the pointer.
        expect(o.x * ux + o.y * uy).toBeGreaterThan(0)
      }
    }
  }
  expect(len(magnetOffset({ dx: 60, dy: 0 }, opts))).toBeCloseTo(6)
})

test('nothing beyond the reach, nothing on the centre', () => {
  expect(magnetOffset({ dx: 121, dy: 0 }, opts)).toEqual({ x: 0, y: 0 })
  expect(magnetOffset({ dx: 300, dy: -300 }, opts)).toEqual({ x: 0, y: 0 })
  expect(magnetOffset({ dx: 0, dy: 0 }, opts)).toEqual({ x: 0, y: 0 })
})

test('reduced motion: always still', () => {
  expect(magnetOffset({ dx: 60, dy: 0 }, { ...opts, reduced: true })).toEqual({ x: 0, y: 0 })
})

import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { useMagnet } from '../src/lib/magnet'

test('measures the button once, not on every pointer move, and again after a scroll or resize', () => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
  const el = document.createElement('a')
  document.body.appendChild(el)
  const rect = vi.fn(() => ({ left: 0, top: 0, width: 100, height: 40, right: 100, bottom: 40, x: 0, y: 0, toJSON() {} }))
  el.getBoundingClientRect = rect
  const { unmount } = renderHook(() => useMagnet(useRef<Element | null>(el), 6, true))
  const move = (x: number) => window.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: 20 }))
  for (let i = 0; i < 5; i++) move(60 + i)
  vi.advanceTimersToNextFrame()
  move(70)
  vi.advanceTimersToNextFrame()
  expect(rect).toHaveBeenCalledTimes(1)
  window.dispatchEvent(new Event('scroll'))
  move(71)
  vi.advanceTimersToNextFrame()
  expect(rect).toHaveBeenCalledTimes(2)
  window.dispatchEvent(new Event('resize'))
  move(72)
  vi.advanceTimersToNextFrame()
  expect(rect).toHaveBeenCalledTimes(3)
  unmount()
  el.remove()
  vi.useRealTimers()
})
