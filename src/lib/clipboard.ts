/** Copies text; 'manual' means the browser said no and the person should press ⌘C themselves. */
export async function copyText(
  text: string,
  clip: Clipboard | undefined = typeof navigator !== 'undefined' ? navigator.clipboard : undefined,
): Promise<'copied' | 'manual'> {
  if (!clip?.writeText) return 'manual'
  try {
    await clip.writeText(text)
    return 'copied'
  } catch {
    return 'manual'
  }
}
