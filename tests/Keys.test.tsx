import { splitCombo } from '../src/components/Keys'

test('splitCombo turns modifiers into separate caps', () => {
  expect(splitCombo('⇧⌘U')).toEqual([['⇧', '⌘', 'U']])
})

test('splitCombo keeps alternatives and multi-char keys', () => {
  expect(splitCombo('⌥⌘[ / ⌥⌘]')).toEqual([['⌥', '⌘', '['], ['⌥', '⌘', ']']])
  expect(splitCombo('⌘1–9')).toEqual([['⌘', '1–9']])
})
