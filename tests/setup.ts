// Browser APIs jsdom lacks. Tests override matchMedia per case through `setMatchMedia`.
let mediaMatches: (query: string) => boolean = () => false
export function setMatchMedia(fn: (query: string) => boolean) {
  mediaMatches = fn
}
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: mediaMatches(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
class IO {
  constructor(public cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
if (!('IntersectionObserver' in window)) Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IO })
