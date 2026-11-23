import * as THREE from 'three'

// The ╭∩╮ strokes from fuxx-cli's logo master SVG (viewBox 1024): line → arc → line, three times.
// Each stroke is described as points sampled along it, in SVG units.
type Pt = [number, number]

function arc(cx: number, cy: number, r: number, from: number, to: number, steps = 24): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return out
}

function line(a: Pt, b: Pt, steps = 8): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) out.push([a[0] + ((b[0] - a[0]) * i) / steps, a[1] + ((b[1] - a[1]) * i) / steps])
  return out
}

// SVG y grows down; angles below use SVG orientation.
const STROKES: Pt[][] = [
  // M 350 468 L 297 468 A 60 60 0 0 0 237 528 L 237 670  (left hook: top bar, quarter arc, down)
  [...line([350, 468], [297, 468]), ...arc(297, 528, 60, -Math.PI / 2, -Math.PI), ...line([237, 528], [237, 670])],
  // M 437 670 L 437 428 A 75 75 0 0 1 587 428 L 587 670  (the arch)
  [...line([437, 670], [437, 428]), ...arc(512, 428, 75, Math.PI, 2 * Math.PI, 36), ...line([587, 428], [587, 670])],
  // M 674 468 L 727 468 A 60 60 0 0 1 787 528 L 787 670  (right hook)
  [...line([674, 468], [727, 468]), ...arc(727, 528, 60, -Math.PI / 2, 0), ...line([787, 528], [787, 670])],
]

const SCALE = 1 / 95
const toWorld = ([x, y]: Pt) => new THREE.Vector3((x - 512) * SCALE, -(y - 549) * SCALE, 0)

export type Mascot = { group: THREE.Group; setGlow(k: number): void; dispose(): void }

export function createMascot(green: THREE.Color): Mascot {
  const group = new THREE.Group()
  const outer = new THREE.MeshBasicMaterial({ color: green.clone(), transparent: true, opacity: 0.95 })
  const core = new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8fff0'), transparent: true })
  const geometries: THREE.BufferGeometry[] = []

  for (const stroke of STROKES) {
    // Drop consecutive duplicates (line/arc joints), then a tight centripetal spline keeps the corners crisp.
    const pts = stroke.map(toWorld).filter((p, i, a) => i === 0 || p.distanceTo(a[i - 1]) > 1e-4)
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const g1 = new THREE.TubeGeometry(curve, 160, 0.115, 14, false)
    const g2 = new THREE.TubeGeometry(curve, 160, 0.045, 10, false)
    geometries.push(g1, g2)
    group.add(new THREE.Mesh(g1, outer), new THREE.Mesh(g2, core))
    // Round end caps.
    for (const end of [pts[0], pts[pts.length - 1]]) {
      const cap = new THREE.SphereGeometry(0.115, 14, 10)
      geometries.push(cap)
      const m = new THREE.Mesh(cap, outer)
      m.position.copy(end)
      group.add(m)
    }
  }

  return {
    group,
    setGlow(k) {
      outer.color.copy(green).multiplyScalar(0.25 + 0.75 * k)
      outer.opacity = 0.35 + 0.6 * k
      core.opacity = Math.min(1, 0.15 + k)
    },
    dispose() {
      geometries.forEach((g) => g.dispose())
      outer.dispose()
      core.dispose()
    },
  }
}

/** Neon-sign ignition: dark, two stutters, then on. `t` in seconds since start → brightness 0..1. */
export function flicker(t: number): number {
  const keys: [number, number][] = [
    [0, 0], [0.25, 0], [0.3, 0.9], [0.36, 0.1], [0.5, 0.1], [0.55, 1], [0.6, 0.3], [0.68, 1], [1.2, 1],
  ]
  if (t >= 1.2) return 1
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    const [t0, v0] = keys[i - 1]
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0 || 1)
  }
  return 1
}
