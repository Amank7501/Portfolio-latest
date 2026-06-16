/**
 * HeroContext — thin bridge between Hero's sweep phase and BlueprintCanvas.
 *
 * Hero sets `heroActive = true` when the sweep starts and `false` once the
 * resolved state has fully faded in. BlueprintCanvas reads it to damp its
 * ambient opacity so it never competes with the signature sweep moment.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface HeroContextValue {
  heroActive: boolean
  setHeroActive: (v: boolean) => void
}

const HeroContext = createContext<HeroContextValue>({
  heroActive: false,
  setHeroActive: () => {},
})

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroActive, setHeroActiveState] = useState(false)
  const setHeroActive = useCallback((v: boolean) => setHeroActiveState(v), [])
  return (
    <HeroContext.Provider value={{ heroActive, setHeroActive }}>
      {children}
    </HeroContext.Provider>
  )
}

export function useHeroContext() {
  return useContext(HeroContext)
}
