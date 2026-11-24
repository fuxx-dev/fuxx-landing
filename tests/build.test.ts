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

test('all seven chapter titles are in the prerendered page', () => {
  const titles = ['Knows your agents', 'Shows its work', 'Subagents, out in the open', 'Agent tabs with an undo', 'Workspaces, panes, tabs', 'Your repo, live', 'Script it']
  for (const t of titles) {
    expect(html).toContain(t)
  }
})

test('the page offers fuxx-completes as released, with its Homebrew line', () => {
  expect(text.toLowerCase()).not.toContain('coming soon')
  expect(text).toContain('brew install fuxx-dev/tap/fuxx-completes')
})

test('download and star links point at the real places', () => {
  expect(html).toMatch(/href="https:\/\/github\.com\/fitzfitz\/fuxx-cli\/releases\/(download\/v[\d.]+\/fuxx-[\d.]+\.zip|latest)"/)
  expect(html).toContain('href="https://github.com/fitzfitz/fuxx-cli"')
})

test('every image has alt, width and height', () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? []
  expect(imgs.length).toBeGreaterThan(0)
  for (const img of imgs) {
    expect(img, img).toMatch(/\balt="[^"]+"/)
    expect(img, img).toMatch(/\bwidth="\d+"/)
    expect(img, img).toMatch(/\bheight="\d+"/)
  }
})

test('one h1, and the page has a main landmark', () => {
  expect((html.match(/<h1\b/g) ?? []).length).toBe(1)
  expect(html).toContain('<main')
})
