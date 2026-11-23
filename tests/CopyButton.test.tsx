import { render, screen, fireEvent, act } from '@testing-library/react'
import { CopyButton } from '../src/components/CopyButton'

vi.mock('../src/lib/clipboard', () => ({ copyText: vi.fn(async () => 'manual') }))

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('manual state shows the text selected, ready for ⌘C', async () => {
  render(<CopyButton text="https://github.com/fuxx-dev/fuxx-hello-helper" />)
  await act(async () => { fireEvent.click(screen.getByRole('button')) })
  const input = screen.getByRole('textbox') as HTMLInputElement
  expect(input.value).toBe('https://github.com/fuxx-dev/fuxx-hello-helper')
  expect(document.activeElement).toBe(input)
  expect(input.selectionStart).toBe(0)
  expect(input.selectionEnd).toBe(input.value.length)
})

test('a second click restarts the reset timer', async () => {
  render(<CopyButton text="x" />)
  const btn = screen.getByRole('button')
  await act(async () => { fireEvent.click(btn) })
  await act(async () => { vi.advanceTimersByTime(1500) })
  await act(async () => { fireEvent.click(btn) })
  await act(async () => { vi.advanceTimersByTime(1500) })
  expect(screen.queryByRole('textbox')).not.toBeNull()
})
