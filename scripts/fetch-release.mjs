// Prebuild: the latest fuxx release → src/generated/release.json. Never fails the build.
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pickRelease } from './lib/release.mjs'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'generated', 'release.json')
const url = 'https://api.github.com/repos/fitzfitz/fuxx-cli/releases/latest'

let release
try {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'fuxx-landing-build' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) })
  release = pickRelease(res.ok ? await res.json() : null)
  if (!res.ok) console.warn(`fetch-release: GitHub answered ${res.status}; using the releases page link`)
} catch (err) {
  console.warn(`fetch-release: ${err instanceof Error ? err.message : err}; using the releases page link`)
  release = pickRelease(null)
}
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(release, null, 2) + '\n')
console.log(`fetch-release: ${release.version || '(no version)'} → ${release.zipUrl}`)
