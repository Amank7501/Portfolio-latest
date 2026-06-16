import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, RevealItem } from '../components/Reveal'
import { getSection } from '../data/sections'
import { projects } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('projects')

function StackChip({ tech }: { tech: string }) {
  return (
    <span
      className="font-mono inline-flex items-center rounded px-2 py-0.5 transition-all duration-200 select-none"
      style={{
        fontSize: '0.6875rem',
        letterSpacing: '0.04em',
        border: '1px solid #1a2138',
        color: '#7a8aaa',
        background: 'rgba(255,255,255,0.02)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(77,208,225,0.4)'
        el.style.color = '#4dd0e1'
        el.style.background = 'rgba(77,208,225,0.06)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#1a2138'
        el.style.color = '#7a8aaa'
        el.style.background = 'rgba(255,255,255,0.02)'
      }}
    >
      {tech}
    </span>
  )
}

function FeaturedCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: hovered ? '1px solid rgba(77,208,225,0.3)' : '1px solid #1a2138',
        background: 'rgba(255,255,255,0.018)',
        boxShadow: hovered ? '0 0 40px rgba(77,208,225,0.08), 0 0 1px rgba(77,208,225,0.3)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow accent top */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(77,208,225,0.07) 0%, transparent 100%)',
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Terminal title bar */}
      <div
        className="flex items-center gap-2.5 px-5 py-3 relative"
        style={{ borderBottom: '1px solid #1a2138', background: 'rgba(255,255,255,0.015)' }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
        <span
          className="font-mono ml-3"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#4dd0e1' }}
        >
          {project.name.toLowerCase().replace(/\s+/g, '-')}.ts
        </span>
        <span
          className="font-mono ml-auto"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: '#2a3555' }}
        >
          featured
        </span>
      </div>

      <div className="p-6 lg:p-8 relative">
        {/* Name + repo link */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <h3 className="text-display-md">{project.name}</h3>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono transition-all duration-300 shrink-0"
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              border: '1px solid rgba(77,208,225,0.25)',
              color: '#4dd0e1',
              background: 'rgba(77,208,225,0.05)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(77,208,225,0.12)'
              el.style.boxShadow = '0 0 16px rgba(77,208,225,0.2)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(77,208,225,0.05)'
              el.style.boxShadow = 'none'
            }}
          >
            View repo
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        {/* Blurb */}
        <p className="text-body mb-2" style={{ color: '#b0bcd4', maxWidth: '68ch' }}>
          {project.blurb}
        </p>

        {/* Description */}
        <p className="text-body-sm mb-6" style={{ color: '#7a8aaa', maxWidth: '72ch', lineHeight: 1.7 }}>
          {project.description}
        </p>

        {/* Two-column layout for highlights + stack */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Highlights */}
          <div
            className="lg:col-span-3 rounded-lg overflow-hidden"
            style={{ border: '1px solid #1a2138' }}
          >
            <div
              className="px-4 py-2"
              style={{ borderBottom: '1px solid #1a2138', background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="font-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#4a5a7a' }}>
                // highlights
              </span>
            </div>
            {project.highlights.map((point, i) => (
              <div
                key={i}
                className="flex gap-3 px-4 py-2.5"
                style={{ borderBottom: i < project.highlights.length - 1 ? '1px solid #0f1628' : 'none' }}
              >
                <span
                  className="font-mono shrink-0 mt-px select-none"
                  style={{ fontSize: '0.75rem', color: '#4dd0e1', lineHeight: 1.7, minWidth: '0.8rem' }}
                >
                  ✶
                </span>
                <p className="text-body-sm" style={{ color: '#c8cede', lineHeight: 1.6 }}>{point}</p>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div className="lg:col-span-2">
            <span className="eyebrow block mb-3">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <StackChip key={tech} tech={tech} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CompactCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        border: hovered ? '1px solid rgba(167,139,250,0.3)' : '1px solid #1a2138',
        background: 'rgba(255,255,255,0.018)',
        boxShadow: hovered ? '0 0 30px rgba(167,139,250,0.07)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* File label */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: '1px solid #1a2138', background: 'rgba(255,255,255,0.015)' }}
      >
        <span className="font-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: '#7a8aaa' }}>
          ~/{project.name.toLowerCase().replace(/\s+/g, '-')}.ts
        </span>
        <span
          className="ml-auto font-mono rounded px-1.5 py-0.5"
          style={{ fontSize: '0.5625rem', letterSpacing: '0.08em', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(167,139,250,0.05)' }}
        >
          side project
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-display-md mb-2">{project.name}</h3>
        <p className="text-body-sm mb-4" style={{ color: '#7a8aaa', flex: 1 }}>{project.blurb}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.slice(0, 6).map((tech) => (
            <StackChip key={tech} tech={tech} />
          ))}
          {project.stack.length > 6 && (
            <span className="font-mono text-muted" style={{ fontSize: '0.75rem', alignSelf: 'center' }}>
              +{project.stack.length - 6}
            </span>
          )}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="font-mono inline-flex items-center gap-1.5 transition-colors duration-200"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: '#a78bfa' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa' }}
        >
          View repo →
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section
      id={meta.id}
      aria-label="Projects"
      className="relative flex min-h-dvh w-full scroll-mt-12 items-center overflow-hidden"
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(77,208,225,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12">
          <Reveal>
            <RevealItem>
              <h2 className="text-display-lg mb-12">Projects</h2>
            </RevealItem>
          </Reveal>

          {/* Featured */}
          <div className="flex flex-col gap-6 mb-8">
            {featured.map((project, i) => (
              <FeaturedCard key={project.name} project={project} index={i} />
            ))}
          </div>

          {/* Other */}
          {rest.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {rest.map((project, i) => (
                  <CompactCard key={project.name} project={project} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
