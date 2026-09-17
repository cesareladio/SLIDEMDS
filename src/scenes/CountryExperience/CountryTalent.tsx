import type { TalentProfile } from '../../data/countryProfiles'
import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

export function CountryTalent({ talent, progress, countryId = 'peru' }: { talent: TalentProfile; progress: number; countryId?: string }) {
  const local = getSegmentProgress(countryId as any, 'talent', progress)
  const opacity = segmentFadeOpacity(countryId as any, 'talent', progress, .025)
  const gender = Math.min(1, local / .22)
  const executive = Math.min(1, Math.max(0, (local - .12) / .2))
  const leadership = Math.min(1, Math.max(0, (local - .26) / .2))
  const careers = Math.min(1, Math.max(0, (local - .42) / .22))
  // Leadership row is confirmed only for Peru; Chile V3 script omits it
  const showLeadership = countryId === 'peru'

  return <section className="country-scroll-talent" style={{ opacity }}>
    <p className="country-scroll-kicker">TALENTO</p>
    <div className="country-scroll-gender" style={{ opacity: gender, transform: `translateX(${(1 - gender) * 24}px)` }}>
      <div><strong>{talent.womenPercent}</strong><sup>%</sup><span>MUJERES</span></div>
      <div className="muted"><strong>{talent.menPercent}</strong><sup>%</sup><span>HOMBRES</span></div>
    </div>
    <div className="country-scroll-flow" style={{ opacity: executive }} />
    <div className="country-scroll-leadership">
      <article style={{ opacity: executive, transform: `translateY(${(1 - executive) * 18}px)` }}>
        <strong>{talent.executiveWomen.percent}</strong><sup>%</sup>
        <p>EJECUTIVOS MUJERES</p><small>{talent.executiveWomen.of} DE {talent.executiveWomen.outOf}</small>
      </article>
      {showLeadership && (
        <article style={{ opacity: leadership, transform: `translateY(${(1 - leadership) * 18}px)` }}>
          <strong>{talent.leadershipWomen.percent}</strong><sup>%</sup>
          <p>LIDERAZGO FEMENINO</p><small>{talent.leadershipWomen.of} DE {talent.leadershipWomen.outOf}</small>
        </article>
      )}
    </div>
    <div className="country-scroll-careers" style={{ opacity: careers }}>
      {talent.careers.map(career => <article key={career.name}>
        <h3>{career.name}</h3><p>{career.from} <i>→</i> {career.to}</p>
      </article>)}
    </div>
  </section>
}
