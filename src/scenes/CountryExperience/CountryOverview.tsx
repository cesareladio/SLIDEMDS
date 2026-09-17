import type { CountryProfile } from '../../data/countryProfiles'
import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

const countryTopNStats: Record<string, { percent: number; label: string; regions: string }> = {
  peru: { percent: 64.7, label: 'TOP 3', regions: 'La Libertad · Arequipa · Lima' },
  chile: { percent: 72, label: 'TOP 2', regions: 'La Araucanía · Biobío' },
}

export function CountryOverview({ profile, progress }: { profile: CountryProfile; progress: number }) {
  const { data } = profile
  const territorial = data.territorialDistribution ?? []
  const delivery = data.deliveryDistribution ?? []
  const local = getSegmentProgress(data.id, 'overview', progress)
  const opacity = segmentFadeOpacity(data.id, 'overview', progress, .035)
  const revealTotal = Math.min(1, local / .18)
  const revealTop3 = Math.min(1, Math.max(0, (local - .28) / .18))
  const revealDelivery = Math.min(1, Math.max(0, (local - .48) / .2))
  const topNStats = countryTopNStats[data.id] || countryTopNStats.peru
  const locale = data.id === 'chile' ? 'es-CL' : 'es-PE'

  return <section className="country-scroll-overview" style={{ opacity }}>
    <p className="country-scroll-kicker">HUELLA</p>
    <div className="country-scroll-number" style={{ opacity: revealTotal, transform: `translateY(${(1 - revealTotal) * 18}px)` }}>
      <strong>{data.total.toLocaleString(locale)}</strong><span>PERSONAS</span>
    </div>
    {territorial.length > 0 && <div className="country-scroll-top3" style={{ opacity: revealTop3, transform: `translateY(${(1 - revealTop3) * 14}px)` }}>
      <strong>{topNStats.percent}%</strong><span>DEL HC EN EL {topNStats.label}<br /><small>{topNStats.regions}</small></span>
    </div>}
    {delivery.length > 0 && <div className="country-scroll-delivery" style={{ opacity: revealDelivery }}>
      {delivery.map(item => <div key={item.label}><span>{item.label}</span><b>{item.percent}%</b></div>)}
    </div>}
  </section>
}
