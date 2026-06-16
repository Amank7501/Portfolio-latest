import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cn } from '../lib/cn'

/** Max tilt in degrees — kept small so it reads as "magnetic", not a flip. */
const TILT_RANGE = 6

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Padding utility class — caller-controlled so it never fights `className` for precedence. */
  padding?: string
}

export function TiltCard({ children, className, padding = 'p-6' }: TiltCardProps) {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springConfig = { stiffness: 220, damping: 22 }
  const rotateX = useSpring(useTransform(py, [0, 1], [TILT_RANGE, -TILT_RANGE]), springConfig)
  const rotateY = useSpring(useTransform(px, [0, 1], [-TILT_RANGE, TILT_RANGE]), springConfig)

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    // Mouse only — touch generates pointermove during scroll-by, which would
    // otherwise tilt the card as a finger passes over it mid-scroll.
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }

  function handlePointerLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn(
        'group border-grid bg-ink/[0.02] hover:border-signal/60 relative overflow-hidden rounded-xl border transition-colors duration-300',
        padding,
        className,
      )}
    >
      {/* base grid — fades out as the signal-colored grid fades in on hover */}
      <div
        aria-hidden="true"
        className="bg-blueprint pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-0"
      />
      <div
        aria-hidden="true"
        className="bg-blueprint-signal pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50"
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
