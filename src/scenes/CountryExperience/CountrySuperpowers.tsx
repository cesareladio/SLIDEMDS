import type { CountryProfile } from '../../data/countryProfiles'
import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

export function CountrySuperpowers({ profile, progress }: { profile: CountryProfile; progress: number }) {
  const { data } = profile
  const local = getSegmentProgress(data.id, 'superpowers', progress)
  const opacity = segmentFadeOpacity(data.id, 'superpowers', progress, .025)
  const headlineReveal = Math.min(1, local / .22)
  const caps = data.capabilities
  return <section className="country-scroll-superpowers" style={{ opacity }}>
    <p className="country-scroll-kicker">CAPACIDADES</p>
    <h2 style={{ opacity: headlineReveal, transform: `translateY(${(1 - headlineReveal) * 18}px)` }}>CAPACIDAD<br /><em>CONECTADA</em></h2>
    <div className="country-capabilities-grid">
      {caps.map((cap, index) => {
        const reveal = Math.min(1, Math.max(0, (local - .06 - index * .075) / .14))
        return <div key={cap.id} className="country-cap-row" style={{ opacity: reveal, transform: `translateX(${(1 - reveal) * 20}px)` }}>
          <span className="cap-label">{cap.label}</span>
          <span className="cap-value">{cap.value}</span>
          {cap.details && <span className="cap-detail">{cap.details.map(d => `${d.label} ${d.value}`).join(' · ')}</span>}
        </div>
      })}
    </div>
  </section>
}
