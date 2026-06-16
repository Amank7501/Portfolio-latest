import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, RevealItem } from '../components/Reveal'
import { getSection } from '../data/sections'
import { skills } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('skills')

// Map categories to accent colors for variety
const CATEGORY_ACCENT: Record<string, string> = {
  'Languages & Core': '#4dd0e1',
  'Frontend': '#4dd0e1',
  'State & UI Systems': '#a78bfa',
  'Backend & Real-time': '#4dd0e1',
  'Architecture': '#a78bfa',
  'Data & DevOps': '#4dd0e1',
}

function SkillChip({ skill, accent }: { skill: string; accent: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      className="font-mono inline-flex items-center rounded px-2.5 py-1 transition-all duration-200 cursor-default select-none"
      style={{
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        border: hovered ? `1px solid ${accent}55` : '1px solid #1a2138',
        color: hovered ? accent : '#7a8aaa',
        background: hovered ? `${accent}12` : 'rgba(255,255,255,0.02)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {skill}
    </span>
  )
}

export default function Skills() {
  const reducedMotion = usePrefersReducedMotion()
  const entries = Object.entries(skills)

  return (
    <section
      id={meta.id}
      aria-label="Skills"
      className="relative flex min-h-dvh w-full scroll-mt-12 items-center overflow-hidden"
    >
      {/* Ambient glow — dual-tone */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12">
          <Reveal>
            <RevealItem>
              <h2 className="text-display-lg mb-12">Stack</h2>
            </RevealItem>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(([category, items], i) => {
              const accent = CATEGORY_ACCENT[category] ?? '#4dd0e1'
              return (
                <motion.div
                  key={category}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl p-5 relative overflow-hidden"
                  style={{ border: '1px solid #1a2138', background: 'rgba(255,255,255,0.018)' }}
                >
                  {/* Top accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, ${accent}60, transparent 60%)` }}
                    aria-hidden="true"
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span style={{ color: accent, fontSize: '0.75rem' }} aria-hidden="true">◆</span>
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', color: accent }}
                      >
                        {category}
                      </span>
                    </div>
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', color: '#4a5a7a' }}
                    >
                      // {items.length}
                    </span>
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <SkillChip key={skill} skill={skill} accent={accent} />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
