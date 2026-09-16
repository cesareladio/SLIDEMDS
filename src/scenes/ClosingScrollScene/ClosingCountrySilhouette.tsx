import { countryPolygon } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'

function pathAndBounds(country: CountryId) {
  const polygon = countryPolygon(country)
  const centerLat = polygon.reduce((sum, [, lat]) => sum + lat, 0) / polygon.length
  const cosLat = Math.cos(centerLat * Math.PI / 180)
  const projected = polygon.map(([lon, lat]) => ({ x: lon * cosLat, y: -lat }))
  const minX = Math.min(...projected.map(point => point.x))
  const maxX = Math.max(...projected.map(point => point.x))
  const minY = Math.min(...projected.map(point => point.y))
  const maxY = Math.max(...projected.map(point => point.y))
  const width = maxX - minX || 1
  const height = maxY - minY || 1
  const scale = Math.min(84 / width, 84 / height)
  const offsetX = 50 - (minX + width / 2) * scale
  const offsetY = 50 - (minY + height / 2) * scale
  const d = projected.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x * scale + offsetX} ${point.y * scale + offsetY}`).join(' ') + ' Z'
  return d
}

export function ClosingCountrySilhouette({ country, opacity, label, subtitle, pair = false }: { country: CountryId; opacity: number; label: string; subtitle: string; pair?: boolean }) {
  return <div className={`closing-silhouette closing-silhouette-${country}${pair ? ' closing-silhouette-pair' : ''}`} style={{ opacity }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={label}>
      <path d={pathAndBounds(country)} className="closing-map-surface" />
      <path d={pathAndBounds(country)} className="closing-map-outline" />
    </svg>
    <div className="closing-country-copy"><strong>{label}</strong><span>{subtitle}</span></div>
  </div>
}
