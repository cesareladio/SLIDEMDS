import { countryProfiles } from '../data/countryProfiles'
import type { CountryId } from '../data/countryProfiles'
import { journeyWaypoints } from '../data/journeyPath'
import { getSegmentProgress, journeyLocalProgress } from '../data/countryScroll'
import { CountryCapabilityConstellation } from './CountryCapabilityConstellation'
import { JourneyScrollFlight } from './JourneyScrollFlight'

interface WorldObjectsProps {
  selectedCountry?: CountryId | null
  countryScrollProgress?: number
  scrollChapter?: string
}

export function WorldObjects({ selectedCountry = null, countryScrollProgress = 0, scrollChapter = 'opening' }: WorldObjectsProps) {
  const isCountryChapter = scrollChapter === 'country' && selectedCountry !== null
  if (!isCountryChapter) return null

  const profile = countryProfiles[selectedCountry]
  const supProg = getSegmentProgress(selectedCountry, 'superpowers', countryScrollProgress)
  const jrProg = journeyLocalProgress(selectedCountry, countryScrollProgress)
  const supOpacity = Math.min(1, Math.max(0, Math.min(supProg / .15, (1 - supProg) / .22)))
  const jrOpacity = Math.min(1, Math.max(0, Math.min(jrProg / .12, (1 - jrProg) / .04)))

  return <>
    {supOpacity > .01 && <CountryCapabilityConstellation capabilities={profile.data.capabilities} progress={supProg} opacity={supOpacity} visible />}
    {jrOpacity > .01 && profile.journeyHistory && <JourneyScrollFlight waypoints={journeyWaypoints} progress={jrProg} opacity={jrOpacity} visible />}
  </>
}
