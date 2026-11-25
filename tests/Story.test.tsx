import { render, screen } from '@testing-library/react'
import { setMatchMedia } from './setup'
import { ScrollTrigger } from '../src/lib/gsap'
import { chapters } from '../src/content/chapters'
import { inventory } from '../src/content/inventory'
import { Story } from '../src/sections/Story'

const TITLES = [
  'Knows your agents',
  'Shows its work',
  'Subagents, out in the open',
  'Agent tabs with an undo',
  'Plan first, then build',
  'Workspaces, panes, tabs',
  'Your repo, live',
  'Script it',
]

afterEach(() => { setMatchMedia(() => false); vi.restoreAllMocks() })

test('eight chapters, in order', () => {
  render(<Story />)
  const heads = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
  expect(heads).toEqual(TITLES)
})

test('every chapter capability exists in the inventory', () => {
  const ids = new Set(inventory.map((c) => c.id))
  for (const ch of chapters) for (const id of ch.capabilities) expect(ids.has(id), id).toBe(true)
})

test('reduced motion: no pinning', () => {
  setMatchMedia((q) => q.includes('prefers-reduced-motion: reduce'))
  const spy = vi.spyOn(ScrollTrigger, 'create')
  render(<Story />)
  expect(spy.mock.calls.some(([v]) => v && (v as ScrollTrigger.Vars).pin)).toBe(false)
})

test('wide screen with motion: the story pins', () => {
  setMatchMedia((q) => q.includes('min-width') || q.includes('no-preference'))
  const spy = vi.spyOn(ScrollTrigger, 'create')
  render(<Story />)
  expect(spy.mock.calls.some(([v]) => v && (v as ScrollTrigger.Vars).pin)).toBe(true)
})

import { chaptersFit } from '../src/sections/Story'

test('the activity chapter shows the real file-tracks render', () => {
  render(<Story />)
  expect(screen.getByRole('img', { name: /busy agent step drawn as file tracks/ })).toBeTruthy()
})

test('chaptersFit: pin only when the tallest chapter fits its box', () => {
  expect(chaptersFit([300, 420, 500], 520)).toBe(true)
  expect(chaptersFit([300, 820, 500], 640)).toBe(false)
  expect(chaptersFit([], 0)).toBe(true)
})

test('pinned: the chapter nav has one active button, carrying the sliding pill', () => {
  setMatchMedia((q) => q.includes('min-width') || q.includes('no-preference'))
  const { container } = render(<Story />)
  const buttons = container.querySelectorAll('.story__nav button')
  expect(buttons).toHaveLength(chapters.length)
  expect(container.querySelectorAll('.story__nav button.is-active')).toHaveLength(1)
  const pills = container.querySelectorAll('.story__pill')
  expect(pills).toHaveLength(1)
  expect(pills[0].closest('button')!.classList.contains('is-active')).toBe(true)
})

test('pinned: the window bar has one dot per shot of the active chapter, the current one lit', () => {
  setMatchMedia((q) => q.includes('min-width') || q.includes('no-preference'))
  const { container } = render(<Story />)
  const first = chapters[0].visual
  const n = 'shots' in first ? first.shots.length : 0
  expect(container.querySelectorAll('.story__dots > span')).toHaveLength(n)
  expect(container.querySelectorAll('.story__dots > span.is-on')).toHaveLength(1)
})
