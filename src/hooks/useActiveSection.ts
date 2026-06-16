import { useEffect, useState } from 'react'

/**
 * Scrollspy: tracks which section id currently sits in a thin band across
 * the vertical center of the viewport. Using rootMargin to collapse the
 * observed area to that band (rather than threshold tuning) keeps exactly
 * one section "active" at a time without fighting overlapping ratios.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0])

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const mostVisible = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b,
        )
        setActiveId(mostVisible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
