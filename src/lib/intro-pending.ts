/**
 * The first-load intro's guard against a flash. The server HTML would otherwise paint whole, then
 * vanish when the intro sets its start state, then play in. An inline <head> script (below) puts
 * `intro-pending` on <html> before first paint; global.css hides the intro's targets under it; the
 * intro lifts it once its start state is set. No JS or reduced motion: the class never appears.
 * If the app has not started after INTRO_SAFETY_MS, the script shows the page itself and marks the
 * intro skipped, so a late start doesn't hide a page someone is already reading.
 */
export const INTRO_PENDING = 'intro-pending'
export const INTRO_SKIPPED = 'intro-skipped'
export const INTRO_SAFETY_MS = 2500

export const INTRO_PENDING_SCRIPT = `(function(c){try{if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;c.add('${INTRO_PENDING}');setTimeout(function(){if(c.contains('${INTRO_PENDING}')){c.remove('${INTRO_PENDING}');c.add('${INTRO_SKIPPED}')}},${INTRO_SAFETY_MS})}catch(e){}})(document.documentElement.classList)`

/** The safety timeout already showed the page: don't hide it again for an intro. */
export function introWasSkipped(root: HTMLElement = document.documentElement): boolean {
  return root.classList.contains(INTRO_SKIPPED)
}

/** The intro has set its start state (or won't play): show the page. */
export function releaseIntroPending(root: HTMLElement = document.documentElement): void {
  root.classList.remove(INTRO_PENDING)
}
