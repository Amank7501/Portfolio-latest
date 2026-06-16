import { motion } from 'framer-motion'
import { Reveal, RevealItem } from '../components/Reveal'
import { getSection } from '../data/sections'
import { achievements } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('achievements')

const ICONS = ['◈', '◉'] as const

export default function Achievements() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id={meta.id}
      aria-label="Achievements"
      className="relative flex min-h-[60vh] w-full scroll-mt-12 items-center overflow-hidden"
    >
      {/* Ambient glow — plasma tint for contrast with Experience */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12">
          <Reveal>
            <RevealItem>
              <h2 className="text-display-lg mb-12">Recognition</h2>
            </RevealItem>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {achievements.map((item, i) => (
              <motion.div
                key={item.title}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-xl p-7 overflow-hidden transition-all duration-300"
                style={{ border: '1px solid #1a2138', background: 'rgba(255,255,255,0.018)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(167,139,250,0.35)'
                  el.style.boxShadow = '0 0 40px rgba(167,139,250,0.09)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#1a2138'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(167,139,250,0.06) 0%, transparent 100%)' }}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className="font-mono text-2xl mb-5"
                  style={{ color: '#a78bfa', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {ICONS[i % ICONS.length]}
                </div>

                {/* Index */}
                <span
                  className="font-mono block mb-3"
                  style={{ fontSize: '0.6875rem', letterSpacing: '0.15em', color: '#4a5a7a' }}
                >
                  ACH · {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="text-display-md mb-4 leading-tight" style={{ maxWidth: '36ch' }}>
                  {item.title}
                </h3>

                {/* Divider */}
                <div
                  className="mb-4"
                  style={{ height: '1px', background: 'linear-gradient(90deg, rgba(167,139,250,0.3), transparent)' }}
                />

                <p className="text-body-sm" style={{ color: '#7a8aaa', lineHeight: 1.7, maxWidth: '48ch' }}>
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
