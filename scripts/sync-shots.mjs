// fuxx-cli's ui-shots PNGs → public/shots/<name>.avif|webp, sized for the page and kept under budget.
// Usage: pnpm sync-shots [--from ../fuxx-cli]   (run fuxx-cli's `scripts/ui-shots.sh --png` first)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { parseManifest, outputPaths, overBudget, staleFiles, BUDGET } from './lib/shots.mjs'

const argFrom = process.argv.indexOf('--from')
const from = resolve(argFrom > -1 ? process.argv[argFrom + 1] : '../fuxx-cli')
const pngDir = join(from, 'target', 'ui-shots')
const entries = parseManifest(JSON.parse(readFileSync('shots.manifest.json', 'utf8')))
mkdirSync('public/shots', { recursive: true })
for (const f of staleFiles(readdirSync('public/shots'), entries.map((e) => e.name))) {
  unlinkSync(join('public/shots', f))
  console.log(`removed stale ${f}`)
}

/** Encode at falling quality until the file fits the budget. */
async function encode(pipeline, format, qualities) {
  let buf
  for (const quality of qualities) {
    buf = await pipeline.clone()[format]({ quality, effort: format === 'avif' ? 6 : 6 }).toBuffer()
    if (!overBudget(buf.length)) return buf
  }
  return buf
}

const meta = {}
const rows = []
let failed = false
for (const e of entries) {
  const src = join(pngDir, `${e.shot}.png`)
  if (!existsSync(src)) {
    console.error(`missing: ${src}`)
    failed = true
    continue
  }
  let img = sharp(src)
  if (e.crop) img = img.extract(e.crop)
  const { width: srcW } = await img.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
  const outW = Math.min(2 * e.width, srcW)
  const base = img.resize({ width: outW })
  const avif = await encode(base, 'avif', [55, 48, 40, 32, 25])
  const webp = await encode(base, 'webp', [80, 72, 62, 52, 42])
  const paths = outputPaths(e.name)
  writeFileSync(paths.avif, avif)
  writeFileSync(paths.webp, webp)
  const info = await sharp(webp).metadata()
  // Display size: the manifest width, height kept in proportion.
  meta[e.name] = { width: e.width, height: Math.round((info.height / info.width) * e.width), alt: e.alt }
  const over = overBudget(avif.length) || overBudget(webp.length)
  if (over) failed = true
  rows.push(`${over ? '✗' : '✓'} ${e.name.padEnd(26)} avif ${(avif.length / 1024).toFixed(0).padStart(4)} KB · webp ${(webp.length / 1024).toFixed(0).padStart(4)} KB · ${outW}px`)
}
writeFileSync('src/generated/shots.json', JSON.stringify(meta, null, 2) + '\n')
console.log(rows.join('\n'))
console.log(`${entries.length} shots, budget ${BUDGET / 1000} KB each`)
if (failed) process.exit(1)
