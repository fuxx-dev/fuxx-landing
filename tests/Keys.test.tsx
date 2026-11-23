import { splitCombo } from '../src/components/Keys'

test('splitCombo turns modifiers into separate caps', () => {
  expect(splitCombo('⇧⌘U')).toEqual([['⇧', '⌘', 'U']])
})

test('splitCombo keeps alternatives and multi-char keys', () => {
  expect(splitCombo('⌥⌘[ / ⌥⌘]')).toEqual([['⌥', '⌘', '['], ['⌥', '⌘', ']']])
  expect(splitCombo('⌘1–9')).toEqual([['⌘', '1–9']])
})

import { render } from '@testing-library/react'
import { Keys } from '../src/components/Keys'

test('Keys gives screen readers the shortcut as text, without aria-label on a span', () => {
  const { container } = render(<Keys combo="⇧⌘U" />)
  const root = container.firstElementChild!
  expect(root.hasAttribute('aria-label')).toBe(false)
  expect(container.querySelector('.visually-hidden')!.textContent).toBe('⇧⌘U')
})
