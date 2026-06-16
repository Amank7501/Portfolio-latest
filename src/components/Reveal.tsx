import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1] as const

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

interface RevealProps {
  children: ReactNode
  className?: string
  /** seconds between each direct RevealItem's entrance */
  stagger?: number
}

/**
 * Scroll-mount container: children fade + rise in once, the first time the
 * container enters the viewport — like the section "mounting" as you reach
 * it. Pair with RevealItem for staggered children; wrap a single element
 * directly in RevealItem alone if no stagger is needed.
 */
export function Reveal({ children, className, stagger = 0.08 }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
