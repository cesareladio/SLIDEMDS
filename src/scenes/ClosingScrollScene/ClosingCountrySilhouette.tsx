import { countryPolygon } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'

function project(country: CountryId, lat: number, lon: number) {
  const bounds = country === 'peru'
    ? { minLat: -18.5, maxLat: 0, minLon: -81.5, maxLon: -68.4 }
    : { minLat: -56.2, maxLat: -17.2, minLon: -76, maxLon: -66.8 }
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100
  return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) }
}

function polygonPath(country: CountryId) {
  return countryPolygon(country).map(([lon, lat], index) => {
    const { x, y } = project(country, lat, lon)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ') + ' Z'
}

export function ClosingCountrySilhouette({ country, opacity, label, subtitle }: { country: CountryId; opacity: number; label: string; subtitle: string }) {
  return <div className={`closing-silhouette closing-silhouette-${country}`} style={{ opacity }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={label}>
      <path d={polygonPath(country)} className="closing-map-surface" />
      <path d={polygonPath(country)} className="closing-map-outline" />
    </svg>
    <div className="closing-country-copy"><strong>{label}</strong><span>{subtitle}</span></div>
  </div>
}
