import { useMemo, useEffect, useState } from 'react'
import { SECTIONS } from '../data/sections'
import { useActiveSection } from '../hooks/useActiveSection'

interface Marker {
  tag: string
  label: string
  ids: string[]
}

function useMarkers(): Marker[] {
  return useMemo(() => {
    const byTag = new Map<string, Marker>()
    for (const section of SECTIONS) {
      const existing = byTag.get(section.tag)
      if (existing) {
        existing.ids.push(section.id)
      } else {
        byTag.set(section.tag, { tag: section.tag, label: section.label, ids: [section.id] })
      }
    }
    return Array.from(byTag.values())
  }, [])
}

/** Tracks how far the user has scrolled through the full page (0–100) */
function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return progress
}

/**
 * Section navigation rendered at two breakpoints:
 *  – Desktop: a full left-panel rail with wordmark, vertical nav, scroll meter
 *  – Mobile: a slim glassmorphic top bar with pill-active items
 */
export function SectionNav() {
  const markers = useMarkers()
  const activeId = useActiveSection(SECTIONS.map((s) => s.id))
  const activeTag = markers.find((m) => m.ids.includes(activeId ?? ''))?.tag
  const scrollProgress = useScrollProgress()

  return (
    <nav aria-label="Section navigation">

      {/* ── Desktop left rail ──────────────────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col lg:flex"
        style={{
          background: 'linear-gradient(180deg, #0a0e1a 0%, rgba(10,14,26,0.96) 100%)',
          borderRight: '1px solid #1a2138',
          isolation: 'isolate',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {/* Top: wordmark */}
        <div
          className="flex items-end justify-between px-7 pt-8 pb-6"
          style={{ borderBottom: '1px solid #1a2138' }}
        >
          <div>
            <span
              className="text-display-md font-display font-semibold tracking-tight text-ink leading-none"
              style={{ letterSpacing: '-0.04em' }}
            >
              AK
              <span style={{ color: '#4dd0e1' }}>.</span>
            </span>
          </div>
          {/* <span
            className="font-mono text-muted"
            style={{ fontSize: '0.625rem', letterSpacing: '0.15em' }}
          >
            v1
          </span> */}
        </div>

        {/* Middle: vertical nav */}
        <ul className="relative flex flex-1 flex-col justify-center gap-1 px-4 py-8">
          {/* Animated left-accent track */}
          <div
            className="pointer-events-none absolute left-4 top-8 bottom-8 w-px"
            style={{ background: '#1a2138' }}
          />

          {markers.map((marker) => {
            const isActive = marker.tag === activeTag
            return (
              <li key={marker.tag} className="relative">
                {/* Active left bar */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-px transition-all duration-300"
                  style={{
                    height: isActive ? '100%' : '0%',
                    background: '#4dd0e1',
                    boxShadow: isActive ? '0 0 8px rgba(77,208,225,0.6)' : 'none',
                  }}
                />

                <a
                  href={`#${marker.ids[0]}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="group relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-300"
                  style={{
                    background: isActive
                      ? 'rgba(77,208,225,0.06)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }
                  }}
                >
                  {/* Number tag */}
                  <span
                    className="font-mono transition-colors duration-300 select-none"
                    style={{
                      fontSize: '0.625rem',
                      letterSpacing: '0.12em',
                      color: isActive ? '#4dd0e1' : '#5c6784',
                      minWidth: '1.5rem',
                    }}
                  >
                    {marker.tag}
                  </span>

                  {/* Separator tick */}
                  <span
                    className="transition-colors duration-300"
                    style={{
                      width: '12px',
                      height: '1px',
                      background: isActive ? '#4dd0e1' : '#1a2138',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />

                  {/* Label */}
                  <span
                    className="font-mono uppercase tracking-widest transition-colors duration-300"
                    style={{
                      fontSize: '0.625rem',
                      letterSpacing: '0.18em',
                      color: isActive ? '#e8ecf5' : '#5c6784',
                    }}
                  >
                    {marker.label}
                  </span>

                  {/* Active signal dot */}
                  {isActive && (
                    <span
                      className="ml-auto"
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#4dd0e1',
                        boxShadow: '0 0 6px rgba(77,208,225,0.8)',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Bottom: scroll progress meter */}
        <div
          className="px-7 py-6 flex flex-col gap-3"
          style={{ borderTop: '1px solid #1a2138' }}
        >
          {/* Progress track */}
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: '2px', background: '#1a2138' }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${scrollProgress}%`,
                  background: 'linear-gradient(90deg, #4dd0e1, #a78bfa)',
                  boxShadow: '0 0 6px rgba(77,208,225,0.4)',
                }}
              />
            </div>
            <span
              className="font-mono tabular-nums"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.08em',
                color: '#5c6784',
                minWidth: '2.5ch',
              }}
            >
              {String(scrollProgress).padStart(2, '0')}%
            </span>
          </div>

          {/* Status line */}
          <div className="flex items-center gap-2">
            <span
              className="rounded-full"
              style={{
                width: '5px',
                height: '5px',
                background: '#4dd0e1',
                boxShadow: '0 0 5px rgba(77,208,225,0.7)',
                animation: 'blueprint-blink 2.4s ease-in-out infinite',
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span
              className="font-mono"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.1em',
                color: '#5c6784',
              }}
            >
            PORTFOLIO · LIVE
            </span>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-x-0 top-0 z-50 flex h-12 items-center lg:hidden"
        style={{
          background: 'rgba(10,14,26,0.85)',
          borderBottom: '1px solid #1a2138',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          isolation: 'isolate',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {/* Left: wordmark */}
        <div className="px-4 flex items-center gap-1.5 shrink-0">
          <span
            className="font-display font-semibold text-ink"
            style={{ fontSize: '1rem', letterSpacing: '-0.04em' }}
          >
            AK<span style={{ color: '#4dd0e1' }}>.</span>
          </span>
        </div>

        {/* Separator */}
        <div
          className="shrink-0 self-stretch"
          style={{ width: '1px', background: '#1a2138', margin: '8px 0' }}
          aria-hidden="true"
        />

        {/* Scrollable nav pills */}
        <ul className="flex flex-1 items-center gap-1.5 overflow-x-auto px-3 scrollbar-none">
          {markers.map((marker) => {
            const isActive = marker.tag === activeTag
            return (
              <li key={marker.tag} className="shrink-0">
                <a
                  href={`#${marker.ids[0]}`}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${marker.tag} ${marker.label}`}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono transition-all duration-300"
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.14em',
                    background: isActive ? 'rgba(77,208,225,0.12)' : 'transparent',
                    color: isActive ? '#4dd0e1' : '#5c6784',
                    border: isActive ? '1px solid rgba(77,208,225,0.25)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 8px rgba(77,208,225,0.15)' : 'none',
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.6 }}>{marker.tag}</span>
                  <span
                    className="uppercase"
                    style={{
                      letterSpacing: '0.16em',
                      color: isActive ? '#e8ecf5' : '#5c6784',
                    }}
                  >
                    {marker.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right: scroll percentage */}
        <div
          className="shrink-0 px-3 font-mono tabular-nums"
          style={{
            fontSize: '0.5625rem',
            letterSpacing: '0.08em',
            color: '#5c6784',
          }}
          aria-hidden="true"
        >
          {String(scrollProgress).padStart(2, '0')}%
        </div>
      </div>
    </nav>
  )
}
