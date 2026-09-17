import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CountryId, CountrySection } from '../data/countryProfiles'

interface StoryState {
  presenter: boolean
  elapsed: number
  selectedCountry: CountryId | null
  countrySection: CountrySection
  selectCountry: (country: CountryId) => void
  clearCountry: () => void
  setCountrySection: (section: CountrySection) => void
  togglePresenter: () => void
}

const StoryContext = createContext<StoryState | null>(null)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [presenter, setPresenter] = useState(false)
  const [elapsed] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null)
  const [countrySection, setCountrySection] = useState<CountrySection>('overview')

  const selectCountry = useCallback((country: CountryId) => {
    setSelectedCountry(country)
    setCountrySection('overview')
  }, [])
  const clearCountry = useCallback(() => { setSelectedCountry(null); setCountrySection('overview') }, [])

  const value = useMemo(() => ({ presenter, elapsed, selectedCountry, countrySection, selectCountry, clearCountry, setCountrySection, togglePresenter: () => setPresenter(v => !v) }), [presenter, elapsed, selectedCountry, countrySection, selectCountry, clearCountry])
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}

export const useStory = () => {
  const value = useContext(StoryContext)
  if (!value) throw new Error('useStory debe utilizarse dentro de StoryProvider')
  return value
}
