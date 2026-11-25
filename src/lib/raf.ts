/**
 * Run `fn` at most once per animation frame, with the latest arguments. Pointer handlers use it so a
 * burst of moves costs one measure-and-write per frame, not one per event. `cancel()` drops a pending call.
 */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void): ((...args: A) => void) & { cancel(): void } {
  let frame = 0
  let last: A
  const run = (...args: A) => {
    last = args
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      fn(...last)
    })
  }
  return Object.assign(run, {
    cancel() {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    },
  })
}
