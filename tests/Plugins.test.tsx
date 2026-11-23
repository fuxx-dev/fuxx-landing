import { render, screen } from '@testing-library/react'
import { Plugins } from '../src/sections/Plugins'

test('shows both sample plugins, fuxx-completes as released, and a conf snippet', () => {
  const { container } = render(<Plugins />)
  expect(container.textContent).toContain('fitzfitz/fuxx-sunset-themes')
  expect(container.textContent).toContain('fitzfitz/fuxx-hello-helper')
  const completes = screen.getByRole('heading', { name: /fuxx-completes/ }).closest('article')!
  expect(completes.textContent).not.toMatch(/coming soon/i)
  expect(completes.textContent).toContain('v0.1.0')
  expect(completes.textContent).toContain('Copy link')
  expect(completes.textContent).toContain('brew install fuxx-dev/tap/fuxx-completes')
  expect(container.textContent).toContain('format      = 1')
})
