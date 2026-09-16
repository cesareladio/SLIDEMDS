import { ArrowLeft } from 'lucide-react'
import { useStory } from '../../app/StoryContext'
import { useScrollStory } from '../../app/ScrollContext'
import { countryProfiles } from '../../data/countryProfiles'
import { getActiveSegment, segmentFadeOpacity } from '../../data/countryScroll'
import { CountryOverview } from './CountryOverview'
import { CountryTalent } from './CountryTalent'
import { CountrySuperpowers } from './CountrySuperpowers'
import { CountryJourney } from './CountryJourney'

const chapterLabels: Record<string, string> = {
  overview: 'HUELLA',
  talent: 'TALENTO',
  superpowers: 'SUPERPODERES',
  journey: 'NUESTRO CAMINO',
}

export function CountryExperience() {
  const { selectedCountry, clearCountry } = useStory()
  const { chapter, chapterProgress } = useScrollStory()
  if (!selectedCountry || chapter !== 'country') return null

  const profile = countryProfiles[selectedCountry]
  const active = getActiveSegment(selectedCountry, chapterProgress)
  const mapOpacity = Math.max(
    segmentFadeOpacity(selectedCountry, 'geo-focus', chapterProgress, .03),
    segmentFadeOpacity(selectedCountry, 'overview', chapterProgress, .035),
    segmentFadeOpacity(selectedCountry, 'talent', chapterProgress, .04) * .48,
    segmentFadeOpacity(selectedCountry, 'exit', chapterProgress, .02),
  )

  const returnToEarth = () => {
    document.querySelector('[data-chapter="earth"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <section className="country-scroll-stage" aria-label={`Historia de ${profile.data.name}`}>
    <div className="country-scroll-chrome">
      <button className="country-back" onClick={returnToEarth}><ArrowLeft size={12} /><span>ONE GDN-e</span></button>
      <div className="country-scroll-identity">
        <span>{profile.data.name.toUpperCase()}</span>
        <small>{profile.slogan}</small>
      </div>
      <div className="country-progress" aria-label={`Capítulo ${chapterLabels[active.id] ?? active.id}`}>
        {profile.sections.map((section, index) => <i key={section} className={active.id === section ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</i>)}
      </div>
    </div>

    <div className="country-scroll-content">
      <CountryOverview profile={profile} progress={chapterProgress} opacity={mapOpacity} />
      {profile.talent && <CountryTalent talent={profile.talent} progress={chapterProgress} />}
      <CountrySuperpowers profile={profile} progress={chapterProgress} />
      {profile.journeyHistory && <CountryJourney history={profile.journeyHistory} progress={chapterProgress} />}
    </div>
  </section>
}
