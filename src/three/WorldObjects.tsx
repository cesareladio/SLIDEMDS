import { countryProfiles } from '../data/countryProfiles'
import { countryFromChapter, getSegmentProgress } from '../data/countryScroll'
import { CountryCapabilityConstellation } from './CountryCapabilityConstellation'
import type { ScrollChapter } from '../app/ScrollContext'

export function WorldObjects({ scrollChapter = 'opening', countryScrollProgress = 0 }: { scrollChapter?: ScrollChapter; countryScrollProgress?: number }) {
  const activeCountry = countryFromChapter(scrollChapter)
  if (!activeCountry) return null

  const profile = countryProfiles[activeCountry]
  const superpowersProgress = getSegmentProgress(activeCountry, 'superpowers', countryScrollProgress)
  const superpowersOpacity = Math.min(1, Math.max(0, Math.min(superpowersProgress / .15, (1 - superpowersProgress) / .22)))

  return superpowersOpacity > .01
    ? <CountryCapabilityConstellation capabilities={profile.data.capabilities} progress={superpowersProgress} opacity={superpowersOpacity} visible />
    : null
}
