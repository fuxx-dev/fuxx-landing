import { render, screen } from '@testing-library/react'
import { Plugins } from '../src/sections/Plugins'

test('shows both sample plugins, fuxx-completes as coming soon, and a conf snippet', () => {
  const { container } = render(<Plugins />)
  expect(container.textContent).toContain('fitzfitz/fuxx-sunset-themes')
  expect(container.textContent).toContain('fitzfitz/fuxx-hello-helper')
  const completes = screen.getByRole('heading', { name: /fuxx-completes/ }).closest('article')!
  expect(completes.textContent).toMatch(/coming soon/i)
  expect(container.textContent).toContain('format      = 1')
})
