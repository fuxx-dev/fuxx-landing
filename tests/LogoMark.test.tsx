import { render } from '@testing-library/react'
import { LogoMark } from '../src/components/LogoMark'

test('LogoMark is the ╭∩╮ as one stroked path, decorative', () => {
  const { container } = render(<LogoMark />)
  const svg = container.querySelector('svg')!
  expect(svg.getAttribute('aria-hidden')).toBe('true')
  const paths = container.querySelectorAll('path.logo-mark__path')
  expect(paths).toHaveLength(1)
  expect(paths[0].getAttribute('stroke')).toBe('currentColor')
  // Three strokes: the left hook, the arch, the right hook.
  expect(paths[0].getAttribute('d')!.match(/M/g)).toHaveLength(3)
})
