import { SectionNav } from './components/SectionNav'
import { BlueprintCanvas } from './components/BlueprintCanvas'
import { HeroProvider, useHeroContext } from './context/HeroContext'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Achievements from './sections/Achievements'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

/**
 * Inner shell — separate component so it can consume HeroContext.
 */
function AppShell() {
  const { heroActive } = useHeroContext()

  return (
    <div className="relative min-h-dvh bg-void text-ink">
      {/* Schematic ambient + interactive background — sits at z-0 behind all content */}
      <BlueprintCanvas heroActive={heroActive} />

      <SectionNav />

      <main className="relative pt-12 lg:pt-0 lg:pl-56">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}

/**
 * App shell — single long scroll on a 12-column grid, no router. The left
 * rail (top bar on mobile) tracks scroll position via IntersectionObserver
 * inside SectionNav; <main> just lays out sections in order.
 *
 * HeroProvider wraps the shell so Hero.tsx can signal its sweep phase to
 * BlueprintCanvas, which dims itself during the signature animation moment.
 */
export default function App() {
  return (
    <HeroProvider>
      <AppShell />
    </HeroProvider>
  )
}
