const KEY = 'fuxx-stars'
const TTL = 60 * 60 * 1000
const URL = 'https://api.github.com/repos/fitzfitz/fuxx-cli'

export function safeSessionStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null
  } catch {
    return null
  }
}

function readCache(storage: Storage | null): number | null {
  try {
    const raw = storage?.getItem(KEY)
    if (!raw) return null
    const { n, at } = JSON.parse(raw) as { n: number; at: number }
    return Date.now() - at < TTL && Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function writeCache(storage: Storage | null, n: number) {
  try {
    storage?.setItem(KEY, JSON.stringify({ n, at: Date.now() }))
  } catch {
    /* private window or blocked storage: the count just isn't cached */
  }
}

let inflight: Promise<number | null> | null = null

/** One request however many buttons ask at once; cached for an hour where sessionStorage works. */
export function getStarCount(
  fetchImpl: typeof fetch = fetch,
  storage: Storage | null = safeSessionStorage(),
): Promise<number | null> {
  const cached = readCache(storage)
  if (cached !== null) return Promise.resolve(cached)
  inflight ??= fetchStars(fetchImpl, storage).finally(() => {
    inflight = null
  })
  return inflight
}

async function fetchStars(fetchImpl: typeof fetch, storage: Storage | null): Promise<number | null> {
  try {
    const res = await fetchImpl(URL, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) return null
    const n = (await res.json())?.stargazers_count
    if (typeof n !== 'number') return null
    writeCache(storage, n)
    return n
  } catch {
    return null
  }
}

export function formatStars(n: number): string {
  if (n < 1000) return String(n)
  const k = n / 1000
  return `${k >= 10 ? Math.round(k) : Math.round(k * 10) / 10}k`
}

/** What the star button shows: nothing until the count is worth showing. */
export function starLabel(n: number | null): string | null {
  return n !== null && n >= 10 ? formatStars(n) : null
}
