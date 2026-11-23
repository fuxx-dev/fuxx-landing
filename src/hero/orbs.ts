import * as THREE from 'three'

export type OrbColors = { working: THREE.Color; done: THREE.Color; waiting: THREE.Color }

type Orb = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
  home: THREE.Color
  radius: number
  speed: number
  phase: number
  tilt: THREE.Euler
}

const PING_EVERY = 6
const PING_LEN = 2.6

export type Orbs = {
  group: THREE.Group
  /** Advances orbits; returns the pinging orb's world position while a ping is showing, else null. */
  update(t: number): { pos: THREE.Vector3; k: number } | null
  dispose(): void
}

export function createOrbs(colors: OrbColors, count = 5): Orbs {
  const group = new THREE.Group()
  const geo = new THREE.SphereGeometry(0.085, 16, 12)
  const ringGeo = new THREE.RingGeometry(0.12, 0.15, 48)
  const ringMat = new THREE.MeshBasicMaterial({ color: colors.waiting.clone(), transparent: true, opacity: 0, depthWrite: false })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  group.add(ring)

  const orbs: Orb[] = []
  for (let i = 0; i < count; i++) {
    const home = (i % 2 === 0 ? colors.working : colors.done).clone()
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: home.clone() }))
    group.add(mesh)
    orbs.push({
      mesh,
      home,
      radius: 2.5 + (i % 3) * 0.45,
      speed: 0.22 + i * 0.045,
      phase: (i / count) * Math.PI * 2,
      tilt: new THREE.Euler(1.15 + (i % 2) * 0.25, 0, (i - 2) * 0.22),
    })
  }

  const tmp = new THREE.Vector3()
  const ringPos = new THREE.Vector3()

  return {
    group,
    update(t) {
      const cycle = Math.floor(t / PING_EVERY)
      const inPing = t % PING_EVERY
      const pinging = cycle >= 1 && inPing < PING_LEN ? (cycle * 3) % count : -1
      // 0 → 1 → 0 over the ping, held at 1 in the middle.
      const k = pinging < 0 ? 0 : Math.min(1, inPing / 0.35, (PING_LEN - inPing) / 0.5)

      orbs.forEach((o, i) => {
        const a = o.phase + t * o.speed
        tmp.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius).applyEuler(o.tilt)
        o.mesh.position.copy(tmp)
        o.mesh.material.color.copy(o.home).lerp(colors.waiting, i === pinging ? k : 0)
        o.mesh.scale.setScalar(i === pinging ? 1 + 0.6 * k : 1)
        if (i === pinging) ringPos.copy(tmp)
      })

      if (pinging < 0) {
        ringMat.opacity = 0
        return null
      }
      const grow = (inPing % 1.3) / 1.3
      ring.position.copy(ringPos)
      ring.scale.setScalar(1 + grow * 3.2)
      ringMat.opacity = (1 - grow) * 0.85 * k
      return { pos: ringPos, k }
    },
    dispose() {
      geo.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      orbs.forEach((o) => o.mesh.material.dispose())
    },
  }
}
