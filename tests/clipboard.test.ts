import { copyText } from '../src/lib/clipboard'

test('copied when writeText resolves', async () => {
  expect(await copyText('x', { writeText: async () => {} } as unknown as Clipboard)).toBe('copied')
})

test('manual when writeText rejects', async () => {
  expect(await copyText('x', { writeText: async () => { throw new Error('denied') } } as unknown as Clipboard)).toBe('manual')
})

test('manual when there is no clipboard', async () => {
  expect(await copyText('x', undefined)).toBe('manual')
})

test('falls back to execCommand copy when the Clipboard API refuses', async () => {
  const exec = vi.fn(() => true)
  ;(document as unknown as { execCommand: unknown }).execCommand = exec
  const denied = { writeText: async () => { throw new Error('denied') } } as unknown as Clipboard
  expect(await copyText('hello', denied)).toBe('copied')
  expect(exec).toHaveBeenCalledWith('copy')
  delete (document as unknown as { execCommand?: unknown }).execCommand
})
