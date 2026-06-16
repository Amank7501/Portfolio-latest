import { profile } from '../content'

const QUICK_LINKS = [
  { label: 'Email', href: `mailto:${profile.links.email}`, external: false },
  { label: 'GitHub', href: profile.links.github, external: true },
  { label: 'LinkedIn', href: profile.links.linkedin, external: true },
  { label: 'Resume', href: profile.links.resume, external: true },
] as const

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #4dd0e1 30%, #a78bfa 70%, transparent)' }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 py-12 lg:px-12">
        {/* Wordmark */}
        <div className="font-display font-semibold text-ink" style={{ fontSize: '1.5rem', letterSpacing: '-0.04em' }}>
          AK<span style={{ color: '#4dd0e1' }}>.</span>
        </div>

        {/* Tagline */}
        {/* <p
          className="font-mono text-center"
          style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: '#4a5a7a' }}
        >
          built with React · TypeScript · Framer Motion
        </p> */}

        {/* Quick links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="font-mono transition-colors duration-300"
              style={{ fontSize: '0.875rem', letterSpacing: '0.06em', color: '#7a8aaa' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#4dd0e1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#7a8aaa' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        {/* <p
          className="font-mono"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: '#2a3555' }}
        >
          © {new Date().getFullYear()} {profile.name} · All rights reserved
        </p> */}
      </div>
    </footer>
  )
}
