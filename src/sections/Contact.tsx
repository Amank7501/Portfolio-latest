import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, RevealItem } from '../components/Reveal'
import { getSection } from '../data/sections'
import { profile } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('contact')

const LINKS = [
  {
    id: 'EMAIL',
    label: 'Email',
    value: profile.links.email,
    href: `mailto:${profile.links.email}`,
    external: false,
    accent: '#4dd0e1',
  },
  {
    id: 'GITHUB',
    label: 'GitHub',
    value: 'Amank7501',
    href: profile.links.github,
    external: true,
    accent: '#e8ecf5',
  },
  {
    id: 'LINKEDIN',
    label: 'LinkedIn',
    value: 'aman-kumar-818412172',
    href: profile.links.linkedin,
    external: true,
    accent: '#4dd0e1',
  },
  {
    id: 'RESUME',
    label: 'Resume',
    value: 'Download PDF →',
    href: profile.links.resume,
    external: true,
    accent: '#a78bfa',
  },
] as const

function ContactRow({
  link,
  index,
}: {
  link: (typeof LINKS)[number]
  index: number
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={link.href}
      {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center justify-between rounded-xl px-6 py-5 transition-all duration-300 relative overflow-hidden"
      style={{
        border: hovered ? `1px solid ${link.accent}45` : '1px solid #1a2138',
        background: hovered ? `${link.accent}08` : 'rgba(255,255,255,0.018)',
        boxShadow: hovered ? `0 0 30px ${link.accent}12` : 'none',
        display: 'flex',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-400"
        style={{
          background: `linear-gradient(90deg, ${link.accent}06 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-5 relative">
        {/* Bracket label */}
        <span
          className="font-mono shrink-0"
          style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.12em',
            color: hovered ? link.accent : '#4a5a7a',
            transition: 'color 0.3s',
          }}
        >
          [ {link.id} ]
        </span>
        <span
          className="h-px w-8 shrink-0 transition-all duration-300"
          style={{ background: hovered ? link.accent : '#1a2138' }}
          aria-hidden="true"
        />
        <span
          className="text-body-sm font-mono"
          style={{ color: hovered ? link.accent : '#b0bcd4', transition: 'color 0.3s' }}
        >
          {link.value}
        </span>
      </div>

      <span
        className="font-mono relative transition-transform duration-300 group-hover:translate-x-1"
        style={{ fontSize: '0.875rem', color: hovered ? link.accent : '#7a8aaa' }}
        aria-hidden="true"
      >
        →
      </span>
    </motion.a>
  )
}

export default function Contact() {
  return (
    <section
      id={meta.id}
      aria-label="Contact"
      className="relative flex min-h-dvh w-full scroll-mt-12 items-center overflow-hidden"
    >
      {/* Ambient — mixed signal+plasma for a rich hue */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(77,208,225,0.04) 0%, rgba(167,139,250,0.04) 50%, transparent 80%)',
          filter: 'blur(80px)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12 lg:col-span-8">
          <Reveal>
            <RevealItem>
              <h2 className="text-display-lg mb-3">Let's build something.</h2>
            </RevealItem>
            <RevealItem>
              <p className="text-body text-muted mb-12 max-w-[52ch]">
                Open to senior engineering roles, research collaborations, and interesting problems.
                I respond to everything.
              </p>
            </RevealItem>
          </Reveal>

          <div className="flex flex-col gap-3">
            {LINKS.map((link, i) => (
              <ContactRow key={link.id} link={link} index={i} />
            ))}
          </div>

          {/* Status indicator */}
          <div className="mt-8 flex items-center gap-3">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: '#4dd0e1',
                boxShadow: '0 0 8px rgba(77,208,225,0.6)',
                animation: 'blueprint-blink 2.4s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            <span
              className="font-mono"
              style={{ fontSize: '0.8125rem', letterSpacing: '0.08em', color: '#7a8aaa' }}
            >
              Available · Bengaluru, India · responds within 24h
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
