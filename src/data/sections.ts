export interface SectionMeta {
  id: string
  /** Two-digit marker tag shared by sections grouped under one rail label, e.g. "03" */
  tag: string
  /** Rail label for the tag group, e.g. "work" */
  label: string
  /** Heading shown inside the section placeholder */
  title: string
}

/**
 * Single source of truth for scroll order + left-rail grouping.
 * Multiple sections can share a tag/label (e.g. Experience, Projects, and
 * Achievements all roll up under "03 · work") — the rail dedupes by tag.
 * Grouped sections must stay contiguous here so the rail never jumps
 * backward to a tag it already passed.
 */
export const SECTIONS: SectionMeta[] = [
  { id: 'hero', tag: '01', label: 'home', title: 'Hero' },
  { id: 'about', tag: '02', label: 'about', title: 'About' },
  { id: 'experience', tag: '03', label: 'work', title: 'Experience' },
  { id: 'projects', tag: '03', label: 'work', title: 'Projects' },
  { id: 'achievements', tag: '03', label: 'work', title: 'Achievements' },
  { id: 'skills', tag: '04', label: 'stack', title: 'Skills' },
  { id: 'education', tag: '04', label: 'stack', title: 'Education' },
  { id: 'contact', tag: '05', label: 'contact', title: 'Contact' },
]

export function getSection(id: string): SectionMeta {
  const meta = SECTIONS.find((s) => s.id === id)
  if (!meta) throw new Error(`Unknown section id: ${id}`)
  return meta
}
