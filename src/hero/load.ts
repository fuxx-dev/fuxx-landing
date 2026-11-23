// The only door to the three.js chunk, so it stays out of the first-paint bundle.
export function loadHeroScene() {
  return import('./scene')
}
