import { revealTitles } from '../src/lib/reveal'

function scope(): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = `
    <section><h2 class="section-title">A terminal that keeps an eye on your agents.</h2></section>
    <section><h2 class="section-title">Paste a GitHub link. That’s the install.</h2></section>
    <section><h2 class="close__title">Stop babysitting.</h2><h3 class="card__title">Not a section title</h3></section>`
  document.body.appendChild(root)
  return root
}

afterEach(() => { document.body.innerHTML = '' })

test('reduced motion: no split, the titles untouched', () => {
  const root = scope()
  const before = root.innerHTML
  const r = revealTitles(root, { reduced: true })
  expect(r.splits).toHaveLength(0)
  expect(root.innerHTML).toBe(before)
  r.revert()
})

test('one split per section title (and the close title), none for anything else; revert restores them', () => {
  const root = scope()
  const before = [...root.querySelectorAll('h2, h3')].map((h) => h.innerHTML)
  const r = revealTitles(root, { reduced: false })
  expect(r.splits).toHaveLength(3)
  expect(root.querySelectorAll('.section-title div, .close__title div').length).toBeGreaterThan(0)
  expect(root.querySelector('.card__title')!.children).toHaveLength(0)
  r.revert()
  expect([...root.querySelectorAll('h2, h3')].map((h) => h.innerHTML)).toEqual(before)
})
