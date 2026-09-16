import { countryPolygon } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'
import type { Hub, TerritorialNode } from '../../data/types'

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

export function CountryMap({ country, territories = [], hubs = [], progress = 1, opacity = 1 }: {
  country: CountryId
  territories?: TerritorialNode[]
  hubs?: Hub[]
  progress?: number
  opacity?: number
}) {
  const locations = territories.length > 0 ? territories : hubs
  const reveal = Math.min(1, Math.max(0, progress))
  return <div className={`country-map country-map-${country}`} style={{ opacity, transform: `scale(${.92 + reveal * .08})` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={`Mapa de ${country}`}>
      <path d={polygonPath(country)} className="country-map-surface" />
      <path d={polygonPath(country)} className="country-map-outline" />
    </svg>
    {locations.map((location, index) => {
      const itemP = Math.min(1, Math.max(0, (reveal - index * .12) / .3))
      const { x, y } = project(country, location.lat, location.lon)
      const label = 'label' in location ? location.label : location.name
      return <div key={label} className="country-map-pin" style={{ left: `${x}%`, top: `${y}%`, opacity: itemP, transform: `translate(-50%, -50%) scale(${.6 + itemP * .4})` }}>
        <i />
        <span>{label}<b>{location.people.toLocaleString('es-PE')}</b></span>
      </div>
    })}
  </div>
}
