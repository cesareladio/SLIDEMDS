import { useScrollStory } from '../../app/ScrollContext'
import { countryFromChapter, getActiveSegment, getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'
import { countryProfiles } from '../../data/countryProfiles'
import { CountryAnchorMap } from './CountryAnchorMap'
import { CountryOverview } from './CountryOverview'
import { CountryTalent } from './CountryTalent'
import { CountrySuperpowers } from './CountrySuperpowers'
import { CountryJourney } from './CountryJourney'
import { rangeProgress } from '../../utils/scrollMotion'

const sectionLabels: Record<string, string> = {
  overview: 'HUELLA', talent: 'TALENTO', superpowers: 'CAPACIDADES', journey: 'CAMINO',
  'geo-focus': '', exit: '',
}

export function CountryExperience() {
  const { chapter, chapterProgress: p } = useScrollStory()
  const activeCountry = countryFromChapter(chapter)
  if (!activeCountry) return null

  const profile = countryProfiles[activeCountry]
  const active = getActiveSegment(activeCountry, p)
  const segments = profile.sections.filter(s => sectionLabels[s])

  // Persistent anchor map opacities — different per segment
  const geoP    = getSegmentProgress(activeCountry, 'geo-focus', p)
  const ovP     = getSegmentProgress(activeCountry, 'overview', p)
  const talP    = activeCountry === 'peru' ? getSegmentProgress('peru', 'talent', p) : 0
  const supP    = getSegmentProgress(activeCountry, 'superpowers', p)
  const jrP     = activeCountry === 'peru' ? getSegmentProgress('peru', 'journey', p) : 0
  const exitP   = rangeProgress(p, active.start < .88 ? .90 : .88, 1)

  const isExit = exitP > .01

  // Silhouette tracks the story, never goes fully zero until exit
  const silhouetteBase = isExit ? Math.max(0, 1 - exitP)
    : active.id === 'geo-focus' ? geoP
    : active.id === 'overview' ? 1
    : active.id === 'talent' ? .26
    : active.id === 'superpowers' ? .20
    : active.id === 'journey' ? .14
    : 0

  const outlineBase = Math.min(1, silhouetteBase * 1.5)
  const pinsBase = (active.id === 'overview' || active.id === 'geo-focus') && !isExit ? 1 : 0
  const labelsBase = active.id === 'overview' && !isExit ? 1 : 0

  // During geo-focus, show geo poster copy. During exit, hide everything.
  const geoCopyOpacity = active.id === 'geo-focus' && !isExit ? geoP : 0

  return <section className="country-scroll-stage" aria-label={`Historia de ${profile.data.name}`}>
    {/* Persistent anchor map owned by CountryExperience */}
    <CountryAnchorMap
      country={activeCountry}
      territories={profile.data.territorialDistribution ?? []}
      hubs={profile.data.operationalHubs ?? []}
      silhouetteOpacity={silhouetteBase}
      outlineOpacity={outlineBase}
      pinsOpacity={pinsBase}
      labelsOpacity={labelsBase}
      progress={segmentFadeOpacity(activeCountry, 'overview', p, .04)}
    />

    {/* Geo identity poster */}
    {geoCopyOpacity > .01 && <div className="country-geo-poster" style={{ opacity: geoCopyOpacity }}>
      <h2 className="country-geo-name">{profile.data.name.toUpperCase()}</h2>
      <p className="country-geo-total"><strong>{profile.data.total.toLocaleString('es-PE')}</strong><span>PERSONAS</span></p>
      <p className="country-geo-slogan">{profile.slogan.toUpperCase()}</p>
    </div>}

    {/* Chrome */}
    <div className="country-scroll-chrome">
      <div className="country-scroll-identity">
        <span>{profile.data.name.toUpperCase()}</span>
        <small>{profile.slogan}</small>
        {profile.data.isMock && import.meta.env.DEV && <small className="mock-badge">DATOS DEMO</small>}
      </div>
      <div className="country-progress">
        {segments.map((section, index) => <i key={section} className={active.id === section ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</i>)}
      </div>
    </div>

    {/* Content beats — CountryOverview no longer owns the map */}
    <div className="country-scroll-content">
      <CountryOverview profile={profile} progress={p} />
      {profile.talent && <CountryTalent talent={profile.talent} progress={p} />}
      <CountrySuperpowers profile={profile} progress={p} />
      {profile.journeyHistory && <CountryJourney history={profile.journeyHistory} progress={p} />}
    </div>
  </section>
}
