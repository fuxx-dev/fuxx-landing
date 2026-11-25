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
