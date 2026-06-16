/**
 * Experience — "Work Log" redesign
 *
 * Section heading + a stacked list of role cards.
 * Each role card has:
 *   - Header bar: status badge (CURRENT/PREV), role title, period chip, commit count
 *   - Org + terminal summary
 *   - Highlights displayed as a 2-column grid of mini "feature cards",
 *     each with: colored verb badge pill, left accent bar, description text,
 *     hover radial glow, and staggered entrance animation.
 *   - Show-more toggle for roles with many highlights
 *   - Metrics strip: key numbers as callout chips
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getSection } from '../data/sections'
import { experience } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('experience')

// ─── verb → accent colour ────────────────────────────────────────────────────
const VERB_PALETTE: Record<string, string> = {
  Engineered:       '#4dd0e1',
  Designed:         '#a78bfa',
  Built:            '#4dd0e1',
  Integrated:       '#a78bfa',
  Delivered:        '#4ade80',
  Deployed:         '#4dd0e1',
  'Co-architected': '#a78bfa',
  Established:      '#4dd0e1',
}

function parseHighlight(text: string) {
  const firstWord = text.split(' ')[0]
  const color = VERB_PALETTE[firstWord] ?? '#7a8aaa'
  const rest = text.slice(firstWord.length).trim()
  return { verb: firstWord, rest, color }
}

// ─── per-role metric callouts ────────────────────────────────────────────────
const ROLE_METRICS: { value: string; label: string; color: string }[][] = [
  [
    { value: '10+',  label: 'concurrent users',   color: '#4dd0e1' },
    { value: '70%',  label: 'backend time saved', color: '#a78bfa' },
    { value: '300+', label: 'students served',    color: '#4ade80' },
    { value: '20+',  label: 'engineers mentored', color: '#4dd0e1' },
  ],
  [
    { value: '5+', label: 'component types', color: '#4dd0e1' },
    { value: '3',  label: 'core APIs built',  color: '#a78bfa' },
  ],
]

// ─── highlight card ───────────────────────────────────────────────────────────
function HighlightCard({
  text,
  index,
}: {
  text: string
  index: number
}) {
  const reducedMotion = usePrefersReducedMotion()
  const { verb, rest, color } = parseHighlight(text)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden flex flex-col gap-3"
      style={{
        padding: '1rem 1.125rem 1.125rem 1.25rem',
        border: `1px solid ${hovered ? color + '45' : '#1a2138'}`,
        background: hovered ? `${color}09` : 'rgba(255,255,255,0.018)',
        boxShadow: hovered ? `0 0 24px ${color}14` : 'none',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: 0.06 + index * 0.045, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Radial glow from top on hover */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 90% 50% at 50% 0%, ${color}18 0%, transparent 100%)`,
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Left accent bar */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-3 bottom-3 rounded-full"
        style={{
          width: '2px',
          background: `linear-gradient(180deg, ${color}, ${color}30)`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Verb badge */}
      <div className="relative flex items-center gap-2">
        <span
          className="font-mono rounded-full inline-flex items-center"
          style={{
            fontSize: '0.5625rem',
            letterSpacing: '0.18em',
            padding: '0.2rem 0.625rem',
            color,
            border: `1px solid ${color}40`,
            background: `${color}12`,
            textTransform: 'uppercase',
          }}
        >
          {verb}
        </span>
      </div>

      {/* Description */}
      <p
        className="relative font-sans"
        style={{
          fontSize: '0.875rem',
          color: hovered ? '#dde6f5' : '#b0bcd4',
          lineHeight: 1.68,
          transition: 'color 0.25s ease',
        }}
      >
        {rest}
      </p>
    </motion.div>
  )
}

// ─── highlight grid with show-more ───────────────────────────────────────────
function HighlightGrid({
  highlights,
  defaultVisible = 4,
}: {
  highlights: readonly string[]
  defaultVisible?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? highlights : highlights.slice(0, defaultVisible)
  const hiddenCount = highlights.length - defaultVisible

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((h, i) => (
          <HighlightCard key={i} text={h} index={i} />
        ))}
      </div>

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
          style={{
            border: '1px dashed #1a2138',
            background: 'transparent',
            cursor: 'pointer',
            color: '#4a5a7a',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(77,208,225,0.3)'
            el.style.color = '#4dd0e1'
            el.style.background = 'rgba(77,208,225,0.04)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#1a2138'
            el.style.color = '#4a5a7a'
            el.style.background = 'transparent'
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
          show {hiddenCount} more {hiddenCount === 1 ? 'item' : 'items'}
        </button>
      )}
    </div>
  )
}

// ─── role card ────────────────────────────────────────────────────────────────
function RoleCard({
  role,
  index,
  metrics,
}: {
  role: typeof experience[number]
  index: number
  metrics: { value: string; label: string; color: string }[]
}) {
  const reducedMotion = usePrefersReducedMotion()
  const isCurrent = index === 0
  const [hovered, setHovered] = useState(false)

  const accentColor = isCurrent ? '#4dd0e1' : '#a78bfa'

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${isCurrent ? 'rgba(77,208,225,0.22)' : hovered ? 'rgba(167,139,250,0.22)' : '#1a2138'}`,
        background: 'rgba(10,14,26,0.65)',
        backdropFilter: 'blur(8px)',
        boxShadow: isCurrent
          ? '0 0 50px rgba(77,208,225,0.06), inset 0 1px 0 rgba(77,208,225,0.07)'
          : hovered
          ? '0 0 40px rgba(167,139,250,0.06)'
          : 'none',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
      }}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.14, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent gradient */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, ${accentColor}70, transparent 55%)` }}
      />

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid #1a2138', background: 'rgba(255,255,255,0.012)' }}
      >
        {/* Left: badge + title */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="font-mono rounded-full inline-flex items-center gap-1.5"
            style={{
              fontSize: '0.5625rem',
              letterSpacing: '0.18em',
              padding: '0.25rem 0.75rem',
              color: accentColor,
              border: `1px solid ${accentColor}35`,
              background: `${accentColor}0d`,
            }}
          >
            {isCurrent && (
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                  animation: 'blueprint-blink 2s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
            )}
            {isCurrent ? 'CURRENT' : 'PREV'}
          </span>

          <h3
            className="font-display font-semibold"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              letterSpacing: '-0.025em',
              color: '#e8ecf5',
            }}
          >
            {role.title}
          </h3>
        </div>

        {/* Right: commit count + period */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono"
            style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: '#4a5a7a' }}
          >
            // {role.highlights.length} highlights
          </span>
          <span
            className="font-mono rounded-full px-3 py-1 shrink-0"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              color: '#7a8aaa',
              border: '1px solid #1a2138',
            }}
          >
            {role.period}
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-6 lg:p-8 flex flex-col gap-7">
        {/* Org + summary */}
        <div>
          <p
            className="font-mono mb-2"
            style={{ fontSize: '0.8125rem', letterSpacing: '0.08em', color: accentColor }}
          >
            {role.org}
          </p>
          <p
            className="font-mono"
            style={{ fontSize: '0.875rem', color: '#7a8aaa', lineHeight: 1.6 }}
          >
            <span style={{ color: '#2a3555' }}>&gt; </span>
            {role.summary}
          </p>
        </div>

        {/* Section divider + label */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono shrink-0"
            style={{ fontSize: '0.5625rem', letterSpacing: '0.2em', color: '#2a3555' }}
          >
            HIGHLIGHTS
          </span>
          <div
            className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, #1a2138, transparent)' }}
            aria-hidden="true"
          />
        </div>

        {/* Highlight cards grid */}
        <HighlightGrid highlights={role.highlights} defaultVisible={4} />

        {/* ── Metrics strip ──────────────────────────────────────────────── */}
        {metrics.length > 0 && (
          <div
            className="flex flex-wrap gap-2 pt-5"
            style={{ borderTop: '1px solid #1a2138' }}
          >
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg px-3.5 py-2 flex items-center gap-2.5"
                style={{
                  border: `1px solid ${m.color}28`,
                  background: `${m.color}0a`,
                }}
              >
                <span
                  className="font-display font-semibold"
                  style={{
                    fontSize: '1.25rem',
                    letterSpacing: '-0.03em',
                    color: m.color,
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    color: '#7a8aaa',
                    lineHeight: 1.4,
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function Experience() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id={meta.id}
      aria-label="Experience"
      className="relative w-full scroll-mt-12 overflow-hidden"
      style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(77,208,225,0.045) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
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
          <div className="flex items-center gap-4">
            <h2
              className="font-display font-semibold"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                letterSpacing: '-0.03em',
                color: '#e8ecf5',
              }}
            >
              Work History
            </h2>
            <span
              className="font-mono rounded-full px-3 py-1 self-center"
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                color: '#4dd0e1',
                border: '1px solid rgba(77,208,225,0.25)',
                background: 'rgba(77,208,225,0.06)',
              }}
            >
              {experience.length} roles
            </span>
          </div>
        </motion.div>

        {/* Role cards */}
        <div className="flex flex-col gap-5">
          {experience.map((role, i) => (
            <RoleCard
              key={`${role.title}-${role.period}`}
              role={role}
              index={i}
              metrics={ROLE_METRICS[i] ?? []}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
