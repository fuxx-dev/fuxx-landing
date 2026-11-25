// Pure helpers for scripts/sync-shots.mjs.

/** @typedef {{ left: number, top: number, width: number, height: number }} Crop */
/** @typedef {{ x: number, y: number }} Focus */
/** @typedef {{ shot: string, name: string, alt: string, width: number, crop?: Crop, focus?: Focus }} ShotEntry */

export const BUDGET = 120_000

/**
 * @param {unknown} json
 * @returns {ShotEntry[]}
 */
export function parseManifest(json) {
  if (!Array.isArray(json)) throw new Error('shots manifest: expected an array')
  const seen = new Set()
  return json.map((e, i) => {
    for (const key of ['shot', 'name', 'alt']) {
      if (!e || typeof e[key] !== 'string' || !e[key].trim()) throw new Error(`shots manifest #${i}: missing ${key}`)
    }
    if (typeof e.width !== 'number' || !(e.width > 0)) throw new Error(`shots manifest #${i}: missing width`)
    if (seen.has(e.name)) throw new Error(`shots manifest: duplicate name "${e.name}"`)
    seen.add(e.name)
    /** @type {ShotEntry} */
    const out = { shot: e.shot, name: e.name, alt: e.alt, width: e.width }
    if (e.crop !== undefined) {
      const c = e.crop
      const sides = ['left', 'top', 'width', 'height']
      if (!c || sides.some((k) => typeof c[k] !== 'number' || c[k] < 0)) throw new Error(`shots manifest #${i}: bad crop`)
      out.crop = { left: c.left, top: c.top, width: c.width, height: c.height }
    }
    // Where the story's slow zoom leans in: fractions of the (cropped) shot, 0..1.
    if (e.focus !== undefined) {
      const f = e.focus
      const ok = (v) => typeof v === 'number' && v >= 0 && v <= 1
      if (!f || !ok(f.x) || !ok(f.y)) throw new Error(`shots manifest #${i}: bad focus`)
      out.focus = { x: f.x, y: f.y }
    }
    return out
  })
}

/** @param {string} name */
export function outputPaths(name) {
  return { avif: `public/shots/${name}.avif`, webp: `public/shots/${name}.webp` }
}

/** @param {number} bytes @param {number} [limit] */
export function overBudget(bytes, limit = BUDGET) {
  return bytes > limit
}

/** Files in public/shots that no manifest name owns (only .avif/.webp are ours). */
/** @param {string[]} existing @param {string[]} names */
export function staleFiles(existing, names) {
  const keep = new Set(names)
  return existing.filter((f) => /\.(avif|webp)$/.test(f) && !keep.has(f.replace(/\.(avif|webp)$/, '')))
}
