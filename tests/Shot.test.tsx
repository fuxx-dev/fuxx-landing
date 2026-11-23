import { render } from '@testing-library/react'

vi.mock('../src/generated/shots.json', () => ({
  default: { x: { width: 720, height: 450, alt: 'A fuxx window' } },
}))

import { Shot } from '../src/components/Shot'

test('Shot renders size and alt from shots.json, lazy by default', () => {
  const { container } = render(<Shot name="x" />)
  const img = container.querySelector('img')!
  expect(img.getAttribute('width')).toBe('720')
  expect(img.getAttribute('height')).toBe('450')
  expect(img.getAttribute('alt')).toBe('A fuxx window')
  expect(img.getAttribute('loading')).toBe('lazy')
  expect(img.getAttribute('src')).toBe('/shots/x.webp')
  expect(container.querySelector('source')!.getAttribute('srcset')).toBe('/shots/x.avif')
})

test('Shot with priority is not lazy', () => {
  const { container } = render(<Shot name="x" priority />)
  expect(container.querySelector('img')!.hasAttribute('loading')).toBe(false)
})
