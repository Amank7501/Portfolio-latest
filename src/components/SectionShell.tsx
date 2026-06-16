import type { ReactNode } from 'react'
import type { SectionMeta } from '../data/sections'
import { Reveal, RevealItem } from './Reveal'

interface SectionShellProps extends SectionMeta {
  children?: ReactNode
}

/**
 * Shared 12-column scaffold every section renders into. Content sits in
 * columns 2–11 on large screens (an 8-col measure inside the 12-col grid)
 * and goes full-width below that. Body content is a placeholder until each
 * section gets real copy. The eyebrow/title/body mount with a short
 * staggered fade + rise the first time the section scrolls into view.
 */
export function SectionShell({ id, tag, label, title, children }: SectionShellProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className="relative flex min-h-dvh w-full scroll-mt-12 items-center"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-6 py-24 lg:px-12">
        <Reveal className="col-span-12 lg:col-span-10 lg:col-start-2">
          <RevealItem>
            <p className="eyebrow mb-4">
              // {tag} · {label}
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="text-display-lg mb-6">{title}</h2>
          </RevealItem>
          <RevealItem>
            {children ?? (
              <p className="text-body-sm text-muted font-mono">placeholder — content pending</p>
            )}
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
