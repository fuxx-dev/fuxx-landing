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
