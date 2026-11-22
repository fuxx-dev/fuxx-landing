import type { Release } from '../../scripts/lib/release.mjs'
import fallback from '../generated/release.fallback.json'

// release.json is written by scripts/fetch-release.mjs before each build; a fresh checkout may not have it.
const generated = import.meta.glob<{ default: Release }>('../generated/release.json', { eager: true })

export const release: Release = Object.values(generated)[0]?.default ?? (fallback as Release)
export type { Release }
