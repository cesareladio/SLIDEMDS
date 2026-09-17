import { useScrollStory } from '../../app/ScrollContext'
import { countryFromChapter, getActiveSegment, getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'
import { countryProfiles } from '../../data/countryProfiles'
import { CountryAnchorMap } from './CountryAnchorMap'
import { CountryOverview } from './CountryOverview'
import { CountryTalent } from './CountryTalent'
import { CountrySuperpowers } from './CountrySuperpowers'
import { CountryCertifications } from './CountryCertifications'
import { CountryJourney } from './CountryJourney'
import { rangeProgress } from '../../utils/scrollMotion'

const sectionLabels: Record<string, string> = {
  overview: 'HUELLA', talent: 'TALENTO', superpowers: 'CAPACIDADES', certifications: 'CERTIFICACIONES', journey: 'CAMINO',
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
  const geoP = getSegmentProgress(activeCountry, 'geo-focus', p)
  const exitStart = activeCountry === 'peru' ? .92 : .88
  const exitP = rangeProgress(p, exitStart, 1)

  const isExit = exitP > .01

  // Peru: Globe's CountrySurfaceHighlight + PeruTerritorialAnchors are the ONLY
  // geographic renderers. Never render the 2D CountryAnchorMap for Peru.
  // Chile: Same rule — use Earth + CountrySurfaceHighlight ONLY.
  const isPeru = activeCountry === 'peru'
  const isChile = activeCountry === 'chile'

  // Silhouette + pins only disabled for both Peru and Chile
  // Both use photoreal Earth + CountrySurfaceHighlight instead
  const silhouetteBase = (isPeru || isChile) ? 0 : (
    isExit ? Math.max(0, 1 - exitP)
    : active.id === 'geo-focus' ? geoP
    : active.id === 'overview' ? 1
    : active.id === 'talent' ? .26
    : active.id === 'superpowers' ? .20
    : active.id === 'certifications' ? .16
    : active.id === 'journey' ? .14
    : 0
  )

  const outlineBase = Math.min(1, silhouetteBase * 1.5)
  const pinsBase = (isPeru || isChile) ? 0 : (active.id === 'overview' || active.id === 'geo-focus') && !isExit ? 1 : 0
  const labelsBase = (isPeru || isChile) ? 0 : active.id === 'overview' && !isExit ? 1 : 0

  // During geo-focus, show geo poster copy. During exit, hide everything.
  const geoCopyOpacity = active.id === 'geo-focus' && !isExit ? geoP : 0
  const locale = activeCountry === 'chile' ? 'es-CL' : 'es-PE'

  return <section className="country-scroll-stage" aria-label={`Historia de ${profile.data.name}`}>
    {/* CountryAnchorMap disabled for both Peru and Chile — use Earth + highlight only */}
    {!isPeru && !isChile && (
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
    )}

    {/* Geo identity poster */}
    {geoCopyOpacity > .01 && <div className="country-geo-poster" style={{ opacity: geoCopyOpacity }}>
      <h2 className="country-geo-name">{profile.data.name.toUpperCase()}</h2>
      <p className="country-geo-total"><strong>{profile.data.total.toLocaleString(locale)}</strong><span>PERSONAS</span></p>
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
      {profile.talent && <CountryTalent talent={profile.talent} countryId={activeCountry} progress={p} />}
      <CountrySuperpowers profile={profile} progress={p} />
      {profile.certifications && <CountryCertifications certifications={profile.certifications} countryId={activeCountry} progress={p} />}
      {profile.journeyHistory && <CountryJourney history={profile.journeyHistory} countryId={activeCountry} progress={p} heroLabel={activeCountry === 'peru' ? 'NUESTRO CAMINO' : 'TECNOLOGÍA DESDE EL SUR'} heroValue={activeCountry === 'peru' ? '2016→' : 'HISTORIA'} heroSupport={activeCountry === 'peru' ? 'TRUJILLO~AL MUNDO' : '2007-2016'} />}
    </div>
  </section>
}
