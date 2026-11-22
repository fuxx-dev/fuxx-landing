import { pickRelease, FALLBACK } from '../scripts/lib/release.mjs'

test('picks version and the fuxx-<v>.zip asset', () => {
  const r = pickRelease({
    tag_name: 'v0.12.6',
    published_at: '2026-11-22T21:18:38Z',
    assets: [
      { name: 'fuxx-0.12.6.zip', browser_download_url: 'https://x/fuxx-0.12.6.zip' },
      { name: 'checksums.txt', browser_download_url: 'https://x/c' },
    ],
  })
  expect(r).toEqual({ version: '0.12.6', zipUrl: 'https://x/fuxx-0.12.6.zip', publishedAt: '2026-11-22T21:18:38Z' })
})

test('no zip asset → releases/latest page, keeps version', () => {
  const r = pickRelease({ tag_name: 'v0.13.0', assets: [] })
  expect(r.zipUrl).toBe(FALLBACK.zipUrl)
  expect(r.version).toBe('0.13.0')
})

test('garbage / rate-limit body → FALLBACK', () => {
  expect(pickRelease({ message: 'API rate limit exceeded' })).toEqual(FALLBACK)
  expect(pickRelease(null)).toEqual(FALLBACK)
})
