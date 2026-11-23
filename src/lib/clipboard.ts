/** The older copy path: a hidden textarea and execCommand. Works where the async API is blocked. */
function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    ta.remove()
  }
}

/** Copies text; 'manual' means the browser said no and the person should press ⌘C themselves. */
export async function copyText(
  text: string,
  clip: Clipboard | undefined = typeof navigator !== 'undefined' ? navigator.clipboard : undefined,
): Promise<'copied' | 'manual'> {
  if (clip?.writeText) {
    try {
      await clip.writeText(text)
      return 'copied'
    } catch {
      /* try the older way */
    }
  }
  return legacyCopy(text) ? 'copied' : 'manual'
}
