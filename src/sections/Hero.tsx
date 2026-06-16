import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useHeroContext } from '../context/HeroContext'

type Phase = 'boot' | 'sweep' | 'resolved'

const HOLD_BEFORE_SWEEP_MS = 260
const SWEEP_DURATION_MS   = 430
const HOLD_AFTER_SWEEP_MS = 40
const CODE_EXIT_S         = 0.14
const HERO_ENTER_S        = 0.22

// Boot sequence lines — typed one by one before the sweep
const BOOT_LINES = [
  '> initializing PORTFOLIO...',
  '> loading profile: aman_kumar.ts',
  '> compiling experience stack...',
  '> status: ready.',
] as const

type Tone = 'keyword' | 'type' | 'punct' | 'key' | 'string'
const TONE_CLASS: Record<Tone, string> = {
  keyword: 'text-muted italic',
  type:    'text-muted',
  punct:   'text-muted/60',
  key:     'text-ink/90',
  string:  'text-code-string',
}
function T({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={TONE_CLASS[tone]}>{children}</span>
}

const CTA_LINKS = [
  { label: 'Resume',   href: profile.links.resume,                   external: true  },
  { label: 'GitHub',   href: profile.links.github,                   external: true  },
  { label: 'LinkedIn', href: profile.links.linkedin,                  external: true  },
  { label: 'Email',    href: `mailto:${profile.links.email}`,         external: false },
] as const

// ─── boot screen ─────────────────────────────────────────────────────────────
function BootScreen() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const delays = [0, 120, 260, 420]
    const timers = delays.map((d, i) =>
      setTimeout(() => setVisibleLines(i + 1), d)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="font-mono" style={{ fontSize: '0.875rem', lineHeight: 2 }}>
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          style={{
            color: i === BOOT_LINES.length - 1 ? '#4dd0e1' : '#5c6784',
            opacity: i < visibleLines ? 1 : 0,
          }}
        >
          {line}
        </div>
      ))}
      {/* Blinking cursor on last line */}
      {visibleLines > 0 && visibleLines <= BOOT_LINES.length && (
        <span
          aria-hidden="true"
          style={{ color: '#4dd0e1', animation: 'blueprint-blink 1s step-end infinite' }}
        >
          ▋
        </span>
      )}

      {/* Sweep card shown when lines are done — mimics the original */}
      {visibleLines >= BOOT_LINES.length && (
        <div
          className="mt-6 border-grid bg-ink/[0.02] relative overflow-hidden rounded-xl border p-5"
          style={{ maxWidth: '36rem' }}
        >
          <div className="text-body-sm font-mono leading-relaxed">
            <div>
              <T tone="keyword">const</T> <T tone="key">profile</T>
              <T tone="punct">:</T> <T tone="type">Profile</T>{' '}
              <T tone="punct">=</T> <T tone="punct">{'{'}</T>
            </div>
            <div className="pl-5">
              <T tone="key">name</T><T tone="punct">:</T>{' '}
              <T tone="string">"{profile.name}"</T><T tone="punct">,</T>
            </div>
            <div className="pl-5">
              <T tone="key">role</T><T tone="punct">:</T>{' '}
              <T tone="string">"{profile.role}"</T><T tone="punct">,</T>
            </div>
            <div className="pl-5">
              <T tone="key">location</T><T tone="punct">:</T>{' '}
              <T tone="string">"{profile.location}"</T><T tone="punct">,</T>
            </div>
            <div><T tone="punct">{'}'}</T></div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── resolved hero ────────────────────────────────────────────────────────────
// Fully atmospheric — large display name, role eyebrow, NO tagline (that lives in About)
function ResolvedHero() {
  return (
    <div className="relative">
      {/* Large decorative background letters */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-8 font-display font-semibold select-none hidden lg:block"
        style={{
          fontSize: '20vw',
          letterSpacing: '-0.05em',
          color: 'rgba(77,208,225,0.025)',
          lineHeight: 0.85,
          userSelect: 'none',
        }}
      >
        AK
      </div>

      <div className="relative">
        {/* Role eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="h-px w-10"
            style={{ background: '#4dd0e1' }}
            aria-hidden="true"
          />
          <span
            className="font-mono"
            style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', color: '#4dd0e1' }}
          >
            PORTFOLIO · init
          </span>
        </motion.div>

        {/* Name — very large, tightest tracking */}
        <motion.h1
          className="font-display font-semibold text-ink"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            letterSpacing: '-0.045em',
            lineHeight: 0.92,
            maxWidth: '12ch',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {profile.name}
        </motion.h1>

        {/* Role — as a compact badge, not a subtitle */}
        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="rounded-full px-4 py-1.5 font-mono"
            style={{
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              color: '#4dd0e1',
              border: '1px solid rgba(77,208,225,0.25)',
              background: 'rgba(77,208,225,0.06)',
            }}
          >
            Full-Stack &amp; AI Systems
          </span>
          <span
            className="rounded-full px-3 py-1.5 font-mono"
            style={{
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              color: '#a78bfa',
              border: '1px solid rgba(167,139,250,0.2)',
              background: 'rgba(167,139,250,0.05)',
            }}
          >
            Research Associate
          </span>
        </motion.div>

        {/* Four core domains — precise capability list, not a tagline */}
        <motion.div
          className="mt-8 flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.5 }}
        >
          {[
            { n: '01', text: 'Low-code platform architecture' },
            { n: '02', text: 'Live preview feature architecture' },
            { n: '03', text: 'End-to-end AI code-generation pipelines' },
            { n: '04', text: 'Collaboration systems with offline-first sync' },
            { n: '05', text: 'Distributed full-stack platform engineering' },
          ].map((item) => (
            <div key={item.n} className="flex items-center gap-4">
              <span
                className="font-mono"
                style={{ fontSize: '0.5625rem', letterSpacing: '0.14em', color: 'var(--color-dim)', minWidth: '1.2rem' }}
              >
                {item.n}
              </span>
              <span
                className="h-px shrink-0"
                style={{ width: '16px', background: 'var(--color-grid)' }}
                aria-hidden="true"
              />
              <span
                className="font-mono"
                style={{ fontSize: '0.875rem', letterSpacing: '0.04em', color: 'var(--color-muted)' }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA links */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {CTA_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group text-label text-muted hover:text-signal border-grid hover:border-signal inline-flex items-center gap-1.5 border-b pb-1 font-mono transition-colors duration-300"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {link.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'resolved' : 'boot')
  const { setHeroActive } = useHeroContext()

  useEffect(() => {
    if (reducedMotion) return

    const toSweep = setTimeout(() => {
      setPhase('sweep')
      setHeroActive(true)
    }, HOLD_BEFORE_SWEEP_MS)

    const toResolved = setTimeout(
      () => setPhase('resolved'),
      HOLD_BEFORE_SWEEP_MS + SWEEP_DURATION_MS + HOLD_AFTER_SWEEP_MS,
    )

    const toRelease = setTimeout(
      () => setHeroActive(false),
      HOLD_BEFORE_SWEEP_MS + SWEEP_DURATION_MS + HOLD_AFTER_SWEEP_MS + HERO_ENTER_S * 1000 + 200,
    )

    return () => {
      clearTimeout(toSweep)
      clearTimeout(toResolved)
      clearTimeout(toRelease)
    }
  }, [reducedMotion, setHeroActive])

  if (reducedMotion) {
    return (
      <section id="hero" aria-label="Hero" className="relative flex min-h-dvh w-full items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <ResolvedHero />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="hero" aria-label="Hero" className="relative flex min-h-dvh w-full items-center">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <motion.div layout="position">
            <AnimatePresence mode="wait">
              {phase === 'resolved' ? (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: HERO_ENTER_S, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ResolvedHero />
                </motion.div>
              ) : (
                <motion.div
                  key="boot"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: CODE_EXIT_S }}
                  className="relative"
                >
                  <p className="eyebrow mb-4">// PORTFOLIO · init</p>
                  <BootScreen />

                  {/* Sweep overlay */}
                  {phase === 'sweep' && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage:
                          'linear-gradient(90deg, transparent, var(--color-signal) 45%, var(--color-plasma) 55%, transparent)',
                        backgroundSize: '55% 100%',
                        backgroundRepeat: 'no-repeat',
                        mixBlendMode: 'screen',
                      }}
                      initial={{ backgroundPositionX: '-65%', opacity: 0 }}
                      animate={{ backgroundPositionX: '165%', opacity: [0, 0.85, 0.85, 0] }}
                      transition={{
                        duration: SWEEP_DURATION_MS / 1000,
                        ease: 'easeInOut',
                        times: [0, 0.12, 0.85, 1],
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
