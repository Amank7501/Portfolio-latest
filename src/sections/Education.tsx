import { motion } from 'framer-motion'
import { Reveal, RevealItem } from '../components/Reveal'
import { getSection } from '../data/sections'
import { education } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const meta = getSection('education')

export default function Education() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id={meta.id}
      aria-label="Education"
      className="relative flex min-h-[70vh] w-full scroll-mt-12 items-center overflow-hidden"
    >
      {/* Plasma ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <div className="col-span-12">
          <Reveal>
            <RevealItem>
              <h2 className="text-display-lg mb-12">Education</h2>
            </RevealItem>
          </Reveal>

          <div className="flex flex-col gap-5">
            {education.map((entry, i) => (
              <motion.div
                key={entry.degree}
                initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-xl overflow-hidden transition-all duration-300"
                style={{ border: '1px solid #1a2138', background: 'rgba(255,255,255,0.018)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(167,139,250,0.3)'
                  el.style.boxShadow = '0 0 30px rgba(167,139,250,0.07)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#1a2138'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Left plasma accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: i === 0 ? 'linear-gradient(180deg,#a78bfa,transparent)' : 'linear-gradient(180deg,#4dd0e1,transparent)' }}
                  aria-hidden="true"
                />

                <div className="pl-7 pr-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    {/* Decorative label */}
                    <span
                      className="font-mono block mb-2"
                      style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: '#4a5a7a' }}
                    >
                      EDU · {String(i + 1).padStart(2, '0')}
                    </span>

                    <h3 className="text-display-md mb-1">{entry.degree}</h3>

                    {'specialization' in entry && entry.specialization && (
                      <span
                        className="font-mono inline-flex items-center rounded-full px-3 py-0.5 mb-3"
                        style={{
                          fontSize: '0.75rem',
                          letterSpacing: '0.06em',
                          color: '#a78bfa',
                          border: '1px solid rgba(167,139,250,0.25)',
                          background: 'rgba(167,139,250,0.06)',
                        }}
                      >
                        {entry.specialization}
                      </span>
                    )}

                    <p className="text-body-sm" style={{ color: '#b0bcd4' }}>{entry.institution}</p>
                  </div>

                  {/* Period */}
                  <div className="shrink-0 sm:text-right">
                    <span
                      className="font-mono rounded-full px-3 py-1 inline-block"
                      style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#7a8aaa', border: '1px solid #1a2138' }}
                    >
                      {entry.period}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
