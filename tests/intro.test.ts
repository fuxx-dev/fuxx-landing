import { playIntro } from '../src/lib/intro'

// jsdom has no SVG geometry; DrawSVG measures the path.
const proto = SVGElement.prototype as unknown as Record<string, unknown>
proto.getTotalLength = () => 100
proto.getBBox = () => ({ x: 0, y: 0, width: 10, height: 10 })

const TITLE = 'Your not-so-friendly neighborhood CLI.'

function page(): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = `
    <header class="hdr"><a class="hdr__logo"><svg class="logo-mark"><path class="logo-mark__path" d="M 0 0 L 10 0" /></svg> fuxx</a></header>
    <section class="hero">
      <div class="hero__stage"><div class="hero__stage-in"></div></div>
      <p class="hero__kicker"><span class="hero__dot"></span> <span class="hero__kicker-text">a terminal for people who run AI coding agents</span></p>
      <h1 class="hero__title">Your not-so-friendly <br class="hero__br">neighborhood CLI.</h1>
      <p class="hero__lede">A native, GPU-fast terminal.</p>
      <div class="hero__cta"><span class="btn-slot"><a class="btn">Download</a></span><p class="dl__meta">v1</p><span class="btn-slot"><a class="btn">Star</a></span></div>
    </section>`
  document.body.appendChild(root)
  return root
}

const hidden = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>('*')].filter((el) => el.style.opacity === '0' || el.style.visibility === 'hidden')

afterEach(() => { document.body.innerHTML = '' })

test('reduced motion: nothing is hidden, nothing is split', () => {
  const root = page()
  const before = root.innerHTML
  const intro = playIntro(root, { reduced: true })
  expect(hidden(root)).toEqual([])
  expect(root.innerHTML).toBe(before)
  intro.cut()
  intro.revert()
})

test('the intro hides the headline while it plays, then cut() lands it whole', () => {
  const root = page()
  const intro = playIntro(root, { reduced: false })
  const title = root.querySelector('.hero__title')!
  // Split into characters for the rise (jsdom has no layout, so only the count is checked mid-way).
  expect(title.querySelectorAll('div').length).toBeGreaterThan(5)
  intro.cut()
  expect(intro.timeline!.progress()).toBe(1)
  // Reverted: no split markup left, nothing stuck hidden.
  expect(title.querySelectorAll('div')).toHaveLength(0)
  expect(title.textContent!.replace(/\s+/g, ' ')).toBe(TITLE)
  expect(hidden(root)).toEqual([])
  intro.revert()
})

test('revert() mid-way restores the markup', () => {
  const root = page()
  const title = root.querySelector('.hero__title')!
  const before = title.innerHTML
  const intro = playIntro(root, { reduced: false })
  intro.revert()
  expect(title.innerHTML).toBe(before)
  expect(hidden(root)).toEqual([])
})

test('the header slides on GSAP alone: its CSS transform transition is off while the intro plays', () => {
  const root = page()
  const header = root.querySelector<HTMLElement>('.hdr')!
  const intro = playIntro(root, { reduced: false })
  expect(header.style.transition).toBe('none')
  intro.cut()
  expect(header.style.transition).toBe('')
  intro.revert()
})

test('revert() mid-way gives the header its transition back', () => {
  const root = page()
  const header = root.querySelector<HTMLElement>('.hdr')!
  const intro = playIntro(root, { reduced: false })
  intro.revert()
  expect(header.style.transition).toBe('')
})

test('the buttons pop in through their slots: the intro never writes the buttons themselves (Motion owns them)', () => {
  const root = page()
  const intro = playIntro(root, { reduced: false })
  const slots = [...root.querySelectorAll<HTMLElement>('.btn-slot')]
  expect(slots.every((s) => s.style.opacity === '0' || s.style.visibility === 'hidden')).toBe(true)
  for (const b of root.querySelectorAll<HTMLElement>('.btn')) expect(b.getAttribute('style')).toBeNull()
  intro.cut()
  for (const b of root.querySelectorAll<HTMLElement>('.btn')) expect(b.getAttribute('style')).toBeNull()
  intro.revert()
})
