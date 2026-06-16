/**
 * About — Bento Grid redesign
 *
 * Cards:
 *  [Competency Map]  wide  — animated horizontal bars
 *  [What I Do]       narrow — 3 domains with glyphs
 *  [Bio]             full   — streaming typewriter reveal
 *  [Stat x4]         small  — count-up numbers on viewport entry
 *  [Focus]           wide   — "currently building" rotating items
 *  [Quote]           narrow — philosophy quote
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { getSection } from '../data/sections'
import { profile } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('about')

// ─── tunables ────────────────────────────────────────────────────────────────
const STATS = [
  { end: 2,   suffix: '+', label: 'Years of\n work' },
  { end: 10,  suffix: '+', label: 'Concurrent users in multi-user collaboration' },
  { end: 70,  suffix: '%', label: 'Backend time saved via workflow orchestration' },
  { end: 300, suffix: '+', label: 'Students served\nvia RASP in prod' },
] as const

const TYPEWRITER_TEXT = profile.summary

const FOCUS_ITEMS = [
  'end-to-end AI code-generation pipelines',
  'collaboration systems with offline-first sync',
  'low-code platform architecture & live preview',
] as const

// Competency domains shown as animated bars
const COMPETENCIES = [
  { label: 'Frontend Systems',        pct: 92, color: '#4dd0e1' },
  { label: 'Code Generation / AI',    pct: 88, color: '#a78bfa' },
  { label: 'Collaboration Systems',   pct: 84, color: '#4dd0e1' },
  { label: 'Backend & APIs',          pct: 78, color: '#a78bfa' },
  { label: 'DevOps / Infrastructure', pct: 65, color: '#4dd0e1' },
] as const

// ─── sub-components ──────────────────────────────────────────────────────────

/** Shared card shell */
function BentoCard({
  children,
  className = '',
  delay = 0,
  glowColor = 'rgba(77,208,225,0.08)',
  style = {},
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  glowColor?: string
  style?: React.CSSProperties
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        border: '1px solid #1a2138',
        background: 'rgba(10,14,26,0.6)',
        backdropFilter: 'blur(8px)',
        boxShadow: hovered ? `0 0 40px ${glowColor}, 0 0 1px rgba(77,208,225,0.15)` : 'none',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        borderColor: hovered ? 'rgba(77,208,225,0.2)' : '#1a2138',
        ...style,
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </motion.div>
  )
}

/** Animated horizontal competency bar */
function CompetencyBar({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = usePrefersReducedMotion()
  const [filled, setFilled] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) { setFilled(pct); return }
    const duration = 900
    const startTime = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setFilled(Math.round(eased * pct))
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current) }
  }, [inView, pct, reducedMotion])

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono"
          style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#b0bcd4' }}
        >
          {label}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', color: color, minWidth: '2.5rem', textAlign: 'right' }}
        >
          {filled}%
        </span>
      </div>
      {/* Track */}
      <div
        className="rounded-full overflow-hidden"
        style={{ height: '3px', background: '#1a2138' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${filled}%`,
            background: `linear-gradient(90deg, ${color}, ${color === '#4dd0e1' ? '#a78bfa' : '#4dd0e1'})`,
            boxShadow: `0 0 6px ${color}60`,
            transition: 'width 0.05s linear',
          }}
        />
      </div>
    </div>
  )
}

/** Animated count-up number */
function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!inView || reducedMotion) {
      setCount(end)
      return
    }
    const duration = 900
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1)
      const eased = elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed)
      setCount(Math.round(eased * end))
      if (elapsed < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current) }
  }, [inView, end, reducedMotion])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

/** Typewriter reveal */
function TypewriterText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = usePrefersReducedMotion()
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) { setDisplayed(text); setDone(true); return }

    let i = 0
    const charPerFrame = 2
    const tick = () => {
      i = Math.min(i + charPerFrame, text.length)
      setDisplayed(text.slice(0, i))
      if (i < text.length) rafRef.current = requestAnimationFrame(tick)
      else setDone(true)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [inView, text, reducedMotion])

  return (
    <p
      ref={ref}
      style={{ color: '#b0bcd4', lineHeight: 1.75, minHeight: '7rem', fontSize: '0.9375rem' }}
    >
      {displayed}
      {!done && (
        <span
          aria-hidden="true"
          style={{ color: '#4dd0e1', animation: 'blueprint-blink 1s step-end infinite', marginLeft: '1px' }}
        >
          ▋
        </span>
      )}
    </p>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function About() {
  const reducedMotion = usePrefersReducedMotion()
  const [focusIndex, setFocusIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setFocusIndex((i) => (i + 1) % FOCUS_ITEMS.length), 2800)
    return () => clearInterval(id)
  }, [reducedMotion])

  return (
    <section
      id={meta.id}
      aria-label={meta.title}
      className="relative w-full scroll-mt-12 overflow-hidden"
      style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      {/* Deep ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(77,208,225,0.04) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(167,139,250,0.035) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* Section heading */}
        <motion.div
          className="mb-14"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2
            className="font-display font-semibold"
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              color: '#e8ecf5',
            }}
          >
            About
          </h2>
        </motion.div>

        {/* ── Bento grid ── */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'auto' }}
        >
          {/* ── 1. Competency map (col 1-7) ── */}
          <BentoCard
            delay={0}
            className="col-span-12 lg:col-span-7"
            style={{ minHeight: '220px' }}
          >
            <div className="relative p-8 lg:p-9 flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between">
                <span className="font-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.18em', color: '#7a8aaa', textTransform: 'uppercase' }}>
                  Competency Map
                </span>
                <span className="font-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: '#4a5a7a' }}>
                  // self-rated
                </span>
              </div>

              <div className="flex flex-col gap-5 flex-1 justify-center">
                {COMPETENCIES.map((c) => (
                  <CompetencyBar key={c.label} {...c} />
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ── 2. What I do (col 8-12) ── */}
          <BentoCard
            delay={0.08}
            className="col-span-12 lg:col-span-5"
            glowColor="rgba(167,139,250,0.1)"
          >
            <div className="p-7 flex flex-col justify-between h-full gap-6">
              <span className="font-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.18em', color: '#7a8aaa', textTransform: 'uppercase' }}>
                What I Do
              </span>

              <div className="flex flex-col gap-6">
                {([
                  { icon: '⬡', label: 'Platform Engineering', desc: 'Model-driven low-code systems that generate production React apps' },
                  { icon: '◈', label: 'AI Code Generation',   desc: 'End-to-end codegen pipelines, workflow orchestration, multi-step AI flows' },
                  { icon: '◎', label: 'Collaboration Systems', desc: 'Offline-first sync, conflict resolution, multi-user collaboration ' },
                ] as const).map((item) => (
                  <div key={item.label} className="flex gap-3.5">
                    <span className="shrink-0 font-mono mt-0.5" style={{ color: '#4dd0e1', fontSize: '0.875rem' }}>{item.icon}</span>
                    <div>
                      <p className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#e8ecf5', marginBottom: '4px' }}>{item.label}</p>
                      <p className="font-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.02em', color: '#7a8aaa', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px" style={{ background: 'linear-gradient(90deg, #a78bfa, transparent)' }} aria-hidden="true" />
            </div>
          </BentoCard>

          {/* ── 3. Bio typewriter (full width) ── */}
          <BentoCard delay={0.14} className="col-span-12">
            <div className="p-7 lg:p-9">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid #1a2138' }}>
                <span className="h-2 w-2 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="h-2 w-2 rounded-full" style={{ background: '#febc2e' }} />
                <span className="h-2 w-2 rounded-full" style={{ background: '#28c840' }} />
                <span className="font-mono ml-3" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#4dd0e1' }}>
                  $ cat summary.txt
                </span>
              </div>
              <TypewriterText text={TYPEWRITER_TEXT} />
            </div>
          </BentoCard>

          {/* ── 4. Stat cards (4 equal) ── */}
          {STATS.map((stat, i) => (
            <BentoCard
              key={stat.label}
              delay={0.2 + i * 0.06}
              className="col-span-12 sm:col-span-6 lg:col-span-3"
              glowColor={i % 2 === 1 ? 'rgba(167,139,250,0.1)' : 'rgba(77,208,225,0.08)'}
            >
              <div className="p-7 flex flex-col gap-4">
                <span className="font-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: '#4a5a7a', textTransform: 'uppercase' }}>
                  Metric · {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="font-display font-semibold leading-none"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                    letterSpacing: '-0.04em',
                    color: i % 2 === 1 ? '#a78bfa' : '#4dd0e1',
                  }}
                >
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div
                  className="h-px"
                  style={{ background: `linear-gradient(90deg, ${i % 2 === 1 ? '#a78bfa' : '#4dd0e1'}, transparent)` }}
                  aria-hidden="true"
                />
                <p
                  className="font-mono"
                  style={{ fontSize: '0.75rem', lineHeight: 1.55, color: '#7a8aaa', whiteSpace: 'pre-line' }}
                >
                  {stat.label}
                </p>
              </div>
            </BentoCard>
          ))}

          {/* ── 5. Currently building (col 1-8) ── */}
          <BentoCard
            delay={0.32}
            className="col-span-12 lg:col-span-8"
            glowColor="rgba(77,208,225,0.07)"
          >
            <div className="p-7 lg:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="font-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: '#4a5a7a', textTransform: 'uppercase' }}>
                  Currently Building
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: '#4dd0e1',
                    boxShadow: '0 0 8px rgba(77,208,225,0.6)',
                    animation: reducedMotion ? 'none' : 'blueprint-blink 1.6s ease-in-out infinite',
                  }}
                  aria-hidden="true"
                />
              </div>

              <div
                className="rounded-lg p-4 font-mono"
                style={{ background: 'rgba(77,208,225,0.04)', border: '1px solid rgba(77,208,225,0.1)', fontSize: '0.875rem' }}
              >
                <span style={{ color: '#4a5a7a' }}>→ </span>
                <motion.span
                  key={focusIndex}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ color: '#4dd0e1' }}
                >
                  {FOCUS_ITEMS[focusIndex]}
                </motion.span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['RASP', 'IIIT Bangalore', 'Low-Code Platform'] as const).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono rounded px-2.5 py-1"
                    style={{
                      fontSize: '0.6875rem',
                      letterSpacing: '0.06em',
                      color: '#7a8aaa',
                      border: '1px solid #1a2138',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ── 6. Philosophy quote (col 9-12) ── */}
          <BentoCard
            delay={0.38}
            className="col-span-12 lg:col-span-4"
            glowColor="rgba(167,139,250,0.1)"
          >
            <div className="p-7 flex flex-col justify-between h-full gap-6">
              <span className="font-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: '#4a5a7a', textTransform: 'uppercase' }}>
                Approach
              </span>

              <div>
                <div
                  className="font-display leading-none mb-3 select-none"
                  style={{ fontSize: '4rem', color: 'rgba(167,139,250,0.15)', lineHeight: 0.8 }}
                  aria-hidden="true"
                >
                  "
                </div>
                <p
                  className="font-display italic"
                  style={{ color: '#b0bcd4', lineHeight: 1.55, fontSize: '1rem' }}
                >
                  Code generation is the new abstraction layer. Build the builder.
                </p>
              </div>

              <div
                className="h-px"
                style={{ background: 'linear-gradient(90deg, #a78bfa, transparent)' }}
                aria-hidden="true"
              />
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  )
}
