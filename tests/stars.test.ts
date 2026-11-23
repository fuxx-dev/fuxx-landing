import { getStarCount, formatStars, starLabel } from '../src/lib/stars'

function memoryStorage(): Storage {
  const m = new Map<string, string>()
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size },
  }
}
const ok = (n: number) => vi.fn(async () => new Response(JSON.stringify({ stargazers_count: n }), { status: 200 }))

test('returns the star count and caches it', async () => {
  const storage = memoryStorage()
  const f = ok(42)
  expect(await getStarCount(f, storage)).toBe(42)
  expect(await getStarCount(f, storage)).toBe(42)
  expect(f).toHaveBeenCalledTimes(1)
})

test('a rejected fetch gives null', async () => {
  expect(await getStarCount(vi.fn(async () => { throw new Error('offline') }), memoryStorage())).toBeNull()
})

test('a non-200 gives null', async () => {
  expect(await getStarCount(vi.fn(async () => new Response('{}', { status: 403 })), memoryStorage())).toBeNull()
})

test('a throwing storage still returns the fetched number', async () => {
  const bad = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('denied') } } as unknown as Storage
  expect(await getStarCount(ok(7), bad)).toBe(7)
})

test('formatStars shortens thousands', () => {
  expect(formatStars(999)).toBe('999')
  expect(formatStars(1234)).toBe('1.2k')
  expect(formatStars(12000)).toBe('12k')
})

test('starLabel hides counts under 10', () => {
  expect(starLabel(null)).toBeNull()
  expect(starLabel(3)).toBeNull()
  expect(starLabel(10)).toBe('10')
  expect(starLabel(1500)).toBe('1.5k')
})
