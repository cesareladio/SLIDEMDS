import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { sceneDurations, story } from '../data/story'
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
  const selectCountry = (country: CountryId) => { setSelectedCountry(country); setCountrySection('overview') }
  const clearCountry = () => { setSelectedCountry(null); setCountrySection('overview') }

  useEffect(() => {
    const started = performance.now()
    const ticker = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 1000)
    return () => window.clearInterval(ticker)
  }, [])

  useEffect(() => {
    if (scene !== 3) setCapabilityFocus('overview')
    if (scene !== 4) setAIPhase('certifications')
    if (scene !== 6) setIBIOLPhase('today')
    setSelectedCountry(null)
    setCountrySection('overview')
  }, [scene])

  useEffect(() => {
    if (!autoplay || selectedCountry) return
    const timeout = window.setTimeout(next, sceneDurations[scene] * 1000)
    return () => window.clearTimeout(timeout)
  }, [autoplay, scene, selectedCountry])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (selectedCountry) {
        const sections = countryProfiles[selectedCountry].sections
        const index = sections.indexOf(countrySection)
        if (key === 'arrowright' || key === ' ') { event.preventDefault(); if (index < sections.length - 1) setCountrySection(sections[index + 1]) }
        if (key === 'arrowleft' && index > 0) setCountrySection(sections[index - 1])
        if (key === 'escape') { setPresenter(false); clearCountry() }
        return
      }
      if (key === 'arrowright' || key === ' ') { event.preventDefault(); next() }
      if (key === 'arrowleft') previous()
      if (key === 'a') setAutoplay(value => !value)
      if (key === 'p') setPresenter(value => !value)
      if (key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
      if (key === 'escape') { setPresenter(false); setSelectedCountry(null); setCountrySection('overview') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedCountry, countrySection])

  const value = useMemo(() => ({ scene, direction, autoplay, presenter, elapsed, capabilityFocus, setCapabilityFocus, aiPhase, setAIPhase, ibiolPhase, setIBIOLPhase, selectedCountry, countrySection, selectCountry, clearCountry, setCountrySection, goTo, next, previous, toggleAutoplay: () => setAutoplay(v => !v), togglePresenter: () => setPresenter(v => !v) }), [scene, direction, autoplay, presenter, elapsed, capabilityFocus, aiPhase, ibiolPhase, selectedCountry, countrySection, goTo, next, previous])
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}

export const useStory = () => {
  const value = useContext(StoryContext)
  if (!value) throw new Error('useStory debe utilizarse dentro de StoryProvider')
  return value
}
