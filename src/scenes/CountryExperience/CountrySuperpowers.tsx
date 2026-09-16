import type { CountryProfile } from '../../data/countryProfiles'
import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

export function CountrySuperpowers({ profile, progress }: { profile: CountryProfile; progress: number }) {
  const local = getSegmentProgress(profile.data.id, 'superpowers', progress)
  const opacity = segmentFadeOpacity(profile.data.id, 'superpowers', progress, .025)
  const headline = Math.min(1, local / .22)
  const details = Math.min(1, Math.max(0, (local - .48) / .28))
  const focusCapabilities = profile.data.capabilities.filter(cap => cap.details)

  return <section className="country-scroll-superpowers" style={{ opacity }}>
    <p className="country-scroll-kicker">SUPERPODERES</p>
    <h2 style={{ opacity: headline, transform: `translateY(${(1 - headline) * 18}px)` }}>CAPACIDAD<br /><em>CONECTADA</em></h2>
    <div className="country-scroll-capability-copy" style={{ opacity: details }}>
      {focusCapabilities.map(cap => <div key={cap.id}>
        <span>{cap.label}</span><b>{cap.value}</b>
        {cap.details && <small>{cap.details.map(detail => `${detail.label} ${detail.value}`).join(' · ')}</small>}
      </div>)}
    </div>
  </section>
}
