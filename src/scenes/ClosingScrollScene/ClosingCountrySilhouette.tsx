import { useMemo } from 'react'
import { projectCountryToViewBox } from '../../utils/countryProjection'
import type { CountryId } from '../../data/countryProfiles'

export function ClosingCountrySilhouette({ country, opacity, label, subtitle, pair = false }: { country: CountryId; opacity: number; label: string; subtitle: string; pair?: boolean }) {
  const { ringsPath } = useMemo(() => projectCountryToViewBox(country, 100, 100, 6), [country])
  return <div className={`closing-silhouette closing-silhouette-${country}${pair ? ' closing-silhouette-pair' : ''}`} style={{ opacity }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={label}>
      <path d={ringsPath} className="closing-map-surface" />
      <path d={ringsPath} className="closing-map-outline" />
    </svg>
    <div className="closing-country-copy"><strong>{label}</strong><span>{subtitle}</span></div>
  </div>
}
