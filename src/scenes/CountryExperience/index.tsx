import { useScrollStory } from '../../app/ScrollContext'
import { countryFromChapter, getActiveSegment } from '../../data/countryScroll'
import { countryProfiles } from '../../data/countryProfiles'
import { CountryOverview } from './CountryOverview'
import { CountryTalent } from './CountryTalent'
import { CountrySuperpowers } from './CountrySuperpowers'
import { CountryJourney } from './CountryJourney'

const sectionLabels: Record<string, string> = {
  overview: 'HUELLA',
  talent: 'TALENTO',
  superpowers: 'SUPERPODERES',
  journey: 'NUESTRO CAMINO',
  'geo-focus': '',
  exit: '',
}

export function CountryExperience() {
  const { chapter, chapterProgress } = useScrollStory()
  const activeCountry = countryFromChapter(chapter)
  if (!activeCountry) return null

  const profile = countryProfiles[activeCountry]
  const active = getActiveSegment(activeCountry, chapterProgress)

  return <section className="country-scroll-stage" aria-label={`Historia de ${profile.data.name}`}>
    <div className="country-scroll-chrome">
      <div className="country-scroll-identity">
        <span>{profile.data.name.toUpperCase()}</span>
        <small>{profile.slogan}</small>
        {profile.data.isMock && import.meta.env.DEV && <small className="mock-badge">DATOS DEMO</small>}
      </div>
      <div className="country-progress">
        {profile.sections.filter(s => sectionLabels[s]).map((section, index) => <i key={section} className={active.id === section ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</i>)}
      </div>
    </div>
    <div className="country-scroll-content">
      <CountryOverview profile={profile} progress={chapterProgress} />
      {profile.talent && <CountryTalent talent={profile.talent} progress={chapterProgress} />}
      <CountrySuperpowers profile={profile} progress={chapterProgress} />
      {profile.journeyHistory && <CountryJourney history={profile.journeyHistory} progress={chapterProgress} />}
    </div>
  </section>
}
