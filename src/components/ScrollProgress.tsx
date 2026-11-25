import { motion, useScroll, useSpring } from 'motion/react'

/** A thin bar along the header's bottom edge: how far down the page you are (scaleX only). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
