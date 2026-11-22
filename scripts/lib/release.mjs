// Pure: turn a GitHub "latest release" API body into what the Download button needs.

/** @typedef {{ version: string, zipUrl: string, publishedAt: string | null }} Release */

/** @type {Release} */
export const FALLBACK = Object.freeze({
  version: '',
  zipUrl: 'https://github.com/fitzfitz/fuxx-cli/releases/latest',
  publishedAt: null,
})

/**
 * @param {unknown} json
 * @returns {Release}
 */
export function pickRelease(json) {
  if (!json || typeof json !== 'object') return { ...FALLBACK }
  const body = /** @type {Record<string, unknown>} */ (json)
  const tag = typeof body.tag_name === 'string' ? body.tag_name : ''
  if (!tag) return { ...FALLBACK }
  const version = tag.replace(/^v/, '')
  const assets = Array.isArray(body.assets) ? body.assets : []
  const zip = assets.find(
    (a) => a && typeof a.name === 'string' && a.name === `fuxx-${version}.zip` && typeof a.browser_download_url === 'string',
  )
  return {
    version,
    zipUrl: zip ? zip.browser_download_url : FALLBACK.zipUrl,
    publishedAt: typeof body.published_at === 'string' ? body.published_at : null,
  }
}
