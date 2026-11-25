import { renderToString } from 'react-dom/server'
import { Hero } from '../src/sections/Hero'

test('the headline is readable before the intro runs', () => {
  const html = renderToString(<Hero />)
  const h1 = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)![0]
  expect(h1.replace(/<[^>]+>/g, '').replace(/<!--.*?-->/g, '').replace(/\s+/g, ' ')).toContain('neighborhood CLI.')
  // Nothing in the server HTML starts hidden: the intro hides things only after mount.
  expect(html).not.toMatch(/opacity:\s*0[;"]/)
  expect(html).not.toMatch(/visibility:\s*hidden/)
})

import { render, screen, fireEvent } from '@testing-library/react'

test('a key during the intro lands it at once: buttons usable, headline whole', () => {
  const { container } = render(<Hero />)
  const title = container.querySelector('.hero__title')!
  expect(title.querySelectorAll('div').length).toBeGreaterThan(0) // the intro is playing
  fireEvent.keyDown(window, { key: 'ArrowDown' })
  expect(title.querySelectorAll('div')).toHaveLength(0)
  expect(title.textContent!.replace(/\s+/g, ' ')).toContain('Your not-so-friendly neighborhood CLI.')
  expect(screen.getByRole('link', { name: /Download for macOS/ })).toBeTruthy()
  expect(screen.getByRole('link', { name: /Star/ })).toBeTruthy()
})

test('mounting the hero lifts the head script’s intro-pending class', () => {
  document.documentElement.className = 'intro-pending'
  const { unmount } = render(<Hero />)
  expect(document.documentElement.classList.contains('intro-pending')).toBe(false)
  unmount()
  document.documentElement.className = ''
})

test('if the safety timeout already showed the page, the intro does not play over it', () => {
  document.documentElement.className = 'intro-skipped'
  const { container, unmount } = render(<Hero />)
  expect(container.querySelector('.hero__title')!.querySelectorAll('div')).toHaveLength(0)
  unmount()
  document.documentElement.className = ''
})
