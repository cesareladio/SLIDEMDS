import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { story } from '../data/story'
import { clamp } from '../utils/math'
import type { CapabilityFocus } from '../data/capabilityConstellation'
import type { IBIOLPhase } from '../data/ibiol'
import { countryProfiles, type CountryId, type CountrySection } from '../data/countryProfiles'

interface StoryState {
  scene: number
  direction: number
  autoplay: boolean
  presenter: boolean
  elapsed: number
  capabilityFocus: CapabilityFocus
  setCapabilityFocus: (focus: CapabilityFocus) => void
  aiPhase: 'certifications' | 'gh300' | 'concepts'
  setAIPhase: (phase: 'certifications' | 'gh300' | 'concepts') => void
  ibiolPhase: IBIOLPhase
  setIBIOLPhase: (phase: IBIOLPhase) => void
  selectedCountry: CountryId | null
  countrySection: CountrySection
  selectCountry: (country: CountryId) => void
  clearCountry: () => void
  setCountrySection: (section: CountrySection) => void
  goTo: (index: number) => void
  next: () => void
  previous: () => void
  toggleAutoplay: () => void
  togglePresenter: () => void
}

const StoryContext = createContext<StoryState | null>(null)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoplay, setAutoplay] = useState(false)
  const [presenter, setPresenter] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [capabilityFocus, setCapabilityFocus] = useState<CapabilityFocus>('overview')
  const [aiPhase, setAIPhase] = useState<'certifications' | 'gh300' | 'concepts'>('certifications')
  const [ibiolPhase, setIBIOLPhase] = useState<IBIOLPhase>('today')
  const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null)
  const [countrySection, setCountrySection] = useState<CountrySection>('overview')
  const sceneRef = useRef(scene)

  const goTo = (raw: number) => {
    const nextScene = clamp(raw, 0, story.length - 1)
    setDirection(nextScene >= sceneRef.current ? 1 : -1)
    sceneRef.current = nextScene
    setScene(nextScene)
  }
  const next = () => goTo(sceneRef.current === story.length - 1 ? 0 : sceneRef.current + 1)
  const previous = () => goTo(sceneRef.current - 1)
  const selectCountry = useCallback((country: CountryId) => {
    setSelectedCountry(country)
    setCountrySection('overview')
    window.requestAnimationFrame(() => document.querySelector('[data-chapter="country"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [])
  const clearCountry = useCallback(() => { setSelectedCountry(null); setCountrySection('overview') }, [])

  useEffect(() => {
    const started = performance.now()
    const ticker = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 1000)
    return () => window.clearInterval(ticker)
  }, [])

  useEffect(() => {
    if (scene !== 3) setCapabilityFocus('overview')
    if (scene !== 4) setAIPhase('certifications')
    if (scene !== 6) setIBIOLPhase('today')
  }, [scene])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'p') setPresenter(value => !value)
      if (key === 'escape') setPresenter(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedCountry])

  const value = useMemo(() => ({ scene, direction, autoplay: false, presenter, elapsed, capabilityFocus, setCapabilityFocus, aiPhase, setAIPhase, ibiolPhase, setIBIOLPhase, selectedCountry, countrySection, selectCountry, clearCountry, setCountrySection, goTo, next, previous, toggleAutoplay: () => undefined, togglePresenter: () => setPresenter(v => !v) }), [scene, direction, presenter, elapsed, capabilityFocus, aiPhase, ibiolPhase, selectedCountry, countrySection, selectCountry, clearCountry])
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}

export const useStory = () => {
  const value = useContext(StoryContext)
  if (!value) throw new Error('useStory debe utilizarse dentro de StoryProvider')
  return value
}
