import { render } from '@testing-library/react'
import { Icon, ICONS } from '../src/components/Icon'
import { chapters } from '../src/content/chapters'
import { grid } from '../src/content/grid'

test('Icon renders a decorative Lucide svg', () => {
  const { container } = render(<Icon name="download" />)
  const svg = container.querySelector('svg')!
  expect(svg).toBeTruthy()
  expect(svg.getAttribute('aria-hidden')).toBe('true')
  expect(svg.getAttribute('width')).toBe('16')
  expect(svg.getAttribute('stroke-width')).toBe('1.75')
})

test('every chapter and grid card names an icon in ICONS', () => {
  for (const c of [...chapters, ...grid]) expect(c.icon in ICONS, `${c.id}: ${c.icon}`).toBe(true)
})
