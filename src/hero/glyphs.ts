import * as THREE from 'three'

const WORDS = [
  '$ claude', '⇧⌘U', 'cargo test', '✓', '✗', '▌', '╭∩╮', 'fuxx wait s4', '⌘K', 'git diff', 'needs you',
  '$ codex', 'pnpm dev', '⌘D', 'done', 'working…', ':3000', 'git push', '$ agy', '42 passed',
]
const CELL_W = 256
const CELL_H = 64
const COLS = 4

function makeAtlas(): THREE.CanvasTexture {
  const rows = Math.ceil(WORDS.length / COLS)
  const canvas = document.createElement('canvas')
  canvas.width = CELL_W * COLS
  canvas.height = CELL_H * rows
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 30px "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, Menlo, monospace'
  WORDS.forEach((w, i) => ctx.fillText(w, (i % COLS) * CELL_W + CELL_W / 2, Math.floor(i / COLS) * CELL_H + CELL_H / 2))
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  return tex
}

const vertex = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aCell;
  attribute float aSpeed;
  attribute float aScale;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uSpan;
  uniform vec2 uGrid;
  varying vec2 vUv;
  varying float vFade;
  void main() {
    vec3 p = aOffset;
    p.y = mod(p.y + uTime * aSpeed + uSpan * 0.5, uSpan) - uSpan * 0.5;
    // Part around the pointer (pointer is in world units on the z = 0 plane, scaled by depth).
    vec2 d = p.xy - uPointer * (1.0 + (-p.z) * 0.12);
    float dist = length(d);
    p.xy += normalize(d + 1e-4) * smoothstep(2.4, 0.0, dist) * 1.1;
    vec3 pos = p + vec3(position.x * aScale * 4.0, position.y * aScale, 0.0);
    float col = mod(aCell, uGrid.x);
    float row = floor(aCell / uGrid.x);
    vUv = vec2((col + uv.x) / uGrid.x, 1.0 - (row + 1.0 - uv.y) / uGrid.y);
    vFade = smoothstep(uSpan * 0.5, uSpan * 0.3, abs(p.y)) * (0.35 + 0.65 * smoothstep(-9.0, -1.0, p.z));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vFade;
  void main() {
    float a = texture2D(uAtlas, vUv).a * vFade;
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a * 0.42);
  }
`

export type Glyphs = { mesh: THREE.Mesh; update(t: number, pointer: THREE.Vector2): void; dispose(): void }

export function createGlyphs(count: number): Glyphs {
  const atlas = makeAtlas()
  const base = new THREE.PlaneGeometry(1, 1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.index = base.index
  geo.setAttribute('position', base.getAttribute('position'))
  geo.setAttribute('uv', base.getAttribute('uv'))
  geo.instanceCount = count

  const span = 14
  const offsets = new Float32Array(count * 3)
  const cells = new Float32Array(count)
  const speeds = new Float32Array(count)
  const scales = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    offsets[i * 3] = (Math.random() - 0.5) * 26
    offsets[i * 3 + 1] = (Math.random() - 0.5) * span
    offsets[i * 3 + 2] = -1 - Math.random() * 9
    cells[i] = Math.floor(Math.random() * WORDS.length)
    speeds[i] = 0.08 + Math.random() * 0.25
    scales[i] = 0.16 + Math.random() * 0.16
  }
  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3))
  geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 1))
  geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1))
  geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uSpan: { value: span },
      uGrid: { value: new THREE.Vector2(COLS, Math.ceil(WORDS.length / COLS)) },
      uAtlas: { value: atlas },
      uColor: { value: new THREE.Color('#14603a') },
    },
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false

  return {
    mesh,
    update(t, pointer) {
      material.uniforms.uTime.value = t
      ;(material.uniforms.uPointer.value as THREE.Vector2).lerp(pointer, 0.08)
    },
    dispose() {
      geo.dispose()
      base.dispose()
      material.dispose()
      atlas.dispose()
    },
  }
}
