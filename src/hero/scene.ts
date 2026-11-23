import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createMascot, flicker } from './mascot'
import { createGlyphs } from './glyphs'
import { createOrbs } from './orbs'

export type HeroScene = {
  start(): void
  stop(): void
  /** Pointer in normalised device coordinates (-1..1, y up). */
  setPointer(x: number, y: number): void
  dispose(): void
}

export type HeroOptions = {
  narrow: boolean
  /** The "needs you" label, positioned over the pinging orb. */
  label?: HTMLElement | null
  colors: { green: string; working: string; waiting: string; done: string }
}

const MAX_DPR = 1.75
const FOV = 35
const CAM_Z = 11

export function createHeroScene(canvas: HTMLCanvasElement, opts: HeroOptions): HeroScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAM_Z)

  const root = new THREE.Group()
  scene.add(root)
  const mascot = createMascot(new THREE.Color(opts.colors.green))
  const orbs = createOrbs({
    working: new THREE.Color(opts.colors.working),
    done: new THREE.Color(opts.colors.done),
    waiting: new THREE.Color(opts.colors.waiting),
  })
  root.add(mascot.group, orbs.group)
  const glyphs = createGlyphs(opts.narrow ? 200 : 600)
  scene.add(glyphs.mesh)

  let composer: EffectComposer | null = null
  let bloom: UnrealBloomPass | null = null
  if (!opts.narrow) {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.45, 0.55)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
  }

  const pointer = new THREE.Vector2(99, 99)
  const tilt = new THREE.Vector2()
  const rest = new THREE.Vector2()
  const pointerWorld = new THREE.Vector2(99, 99)
  let viewW = 1
  let viewH = 1
  let cssW = 1
  let cssH = 1

  function resize() {
    const parent = canvas.parentElement
    cssW = Math.max(1, parent?.clientWidth ?? canvas.clientWidth)
    cssH = Math.max(1, parent?.clientHeight ?? canvas.clientHeight)
    renderer.setSize(cssW, cssH, false)
    camera.aspect = cssW / cssH
    camera.updateProjectionMatrix()
    viewH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    viewW = viewH * camera.aspect
    // Wide: the mascot sits in the right half, beside the headline. Tall/narrow: top centre, above it.
    if (camera.aspect > 1.15) {
      root.scale.setScalar(0.6 * Math.min(1, viewW / 7.8))
      root.position.set(viewW * 0.2, viewH * 0.04, 0)
    } else {
      root.scale.setScalar(Math.min(0.6, viewW / 9.5))
      root.position.set(0, viewH * 0.3, 0)
    }
    if (composer && bloom) {
      composer.setSize(cssW, cssH)
      composer.setPixelRatio(renderer.getPixelRatio())
      bloom.resolution.set(cssW / 2, cssH / 2)
    }
  }
  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)
  resize()

  let last = 0
  let elapsed = 0
  let raf = 0
  let running = false
  const projected = new THREE.Vector3()

  function frame() {
    raf = requestAnimationFrame(frame)
    const now = performance.now()
    elapsed += Math.min((now - last) / 1000, 0.05)
    last = now
    const t = elapsed
    const hasPointer = pointer.x < 50

    mascot.setGlow(flicker(t) * (t > 1.2 ? 0.92 + 0.08 * Math.sin(t * 1.6) : 1))
    tilt.lerp(hasPointer ? pointer : rest, 0.05)
    mascot.group.rotation.y = THREE.MathUtils.clamp(tilt.x, -1, 1) * 0.21
    mascot.group.rotation.x = -THREE.MathUtils.clamp(tilt.y, -1, 1) * 0.12
    if (hasPointer) pointerWorld.set((pointer.x * viewW) / 2, (pointer.y * viewH) / 2)
    glyphs.update(t, pointerWorld)

    const ping = orbs.update(t)
    if (opts.label) {
      if (ping) {
        projected.copy(ping.pos).applyMatrix4(root.matrixWorld).project(camera)
        const x = ((projected.x + 1) / 2) * cssW
        const y = ((1 - projected.y) / 2) * cssH
        opts.label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
        opts.label.style.opacity = String(ping.k)
      } else {
        opts.label.style.opacity = '0'
      }
    }

    if (composer) composer.render()
    else renderer.render(scene, camera)
  }

  return {
    start() {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    },
    stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    },
    setPointer(x, y) {
      pointer.set(x, y)
    },
    dispose() {
      cancelAnimationFrame(raf)
      running = false
      ro.disconnect()
      mascot.dispose()
      orbs.dispose()
      glyphs.dispose()
      composer?.dispose()
      renderer.dispose()
    },
  }
}
