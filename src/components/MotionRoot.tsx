import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

/** One Motion policy for the page: under reduced motion, Motion skips transform and layout animations. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
