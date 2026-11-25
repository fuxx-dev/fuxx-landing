/**
 * The numbers to show, one per frame, while a count runs from `from` to `to`: eased out (fast, then
 * settling), whole numbers, never going back, and always ending exactly on `to`.
 */
export function countUp(from: number, to: number, ms: number, frameMs = 1000 / 60): number[] {
  const frames = Math.round(ms / frameMs)
  if (frames < 1) return [to]
  const out: number[] = []
  for (let i = 1; i <= frames; i++) {
    const t = i / frames
    out.push(Math.round(from + (to - from) * (1 - (1 - t) ** 3)))
  }
  out[out.length - 1] = to
  return out
}
