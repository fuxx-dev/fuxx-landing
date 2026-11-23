// Reads the prerendered landing page; run after `pnpm build` with `pnpm test:build`.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function findIndexHtml(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...findIndexHtml(p))
    else if (name === 'index.html') out.push(p)
  }
  return out
}

const pages = findIndexHtml('dist')
const html = pages.length === 1 ? readFileSync(pages[0], 'utf8') : ''
/** The page's visible text: tags and React's text-split comments removed. */
const text = html.replace(/<!--.*?-->/g, '').replace(/<[^>]+>/g, '')

test('exactly one prerendered index.html for /', () => {
  expect(pages).toHaveLength(1)
})

test('the page carries the tagline and the OG image', () => {
  expect(text).toContain('Your not-so-friendly neighborhood CLI.')
  expect(html).toContain('<meta property="og:image"')
})

test('no personal paths leak into the page', () => {
  expect(html).not.toContain('/Users/')
})
