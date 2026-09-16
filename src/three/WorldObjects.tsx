import { countryProfiles } from '../data/countryProfiles'
import { countryFromChapter } from '../data/countryScroll'
import { journeyWaypoints } from '../data/journeyPath'
import { getSegmentProgress, journeyLocalProgress } from '../data/countryScroll'
import { CountryCapabilityConstellation } from './CountryCapabilityConstellation'
import { JourneyScrollFlight } from './JourneyScrollFlight'
import type { ScrollChapter } from '../app/ScrollContext'

export function WorldObjects({ scrollChapter = 'opening', countryScrollProgress = 0 }: { scrollChapter?: ScrollChapter; countryScrollProgress?: number }) {
  const activeCountry = countryFromChapter(scrollChapter)
  if (!activeCountry) return null

  const profile = countryProfiles[activeCountry]
  const supProg = getSegmentProgress(activeCountry, 'superpowers', countryScrollProgress)
  const jrProg = journeyLocalProgress(activeCountry, countryScrollProgress)
  const supOpacity = Math.min(1, Math.max(0, Math.min(supProg / .15, (1 - supProg) / .22)))
  const jrOpacity = Math.min(1, Math.max(0, Math.min(jrProg / .12, (1 - jrProg) / .04)))

  return <>
    {supOpacity > .01 && <CountryCapabilityConstellation capabilities={profile.data.capabilities} progress={supProg} opacity={supOpacity} visible />}
    {jrOpacity > .01 && profile.journeyHistory && <JourneyScrollFlight waypoints={journeyWaypoints} progress={jrProg} opacity={jrOpacity} visible />}
  </>
}
