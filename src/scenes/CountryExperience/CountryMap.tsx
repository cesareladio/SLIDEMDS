import { useMemo } from 'react'
import { projectCountryToViewBox } from '../../utils/countryProjection'
import type { CountryId } from '../../data/countryProfiles'
import type { Hub, TerritorialNode } from '../../data/types'

export function CountryMap({ country, territories = [], hubs = [], progress = 1, opacity = 1 }: {
  country: CountryId
  territories?: TerritorialNode[]
  hubs?: Hub[]
  progress?: number
  opacity?: number
}) {
  const { project, ringsPath } = useMemo(() => projectCountryToViewBox(country), [country])
  const locations = territories.length > 0 ? territories : hubs
  const reveal = Math.min(1, Math.max(0, progress))
  return <div className={`country-map country-map-${country}`} style={{ opacity, transform: `scale(${.92 + reveal * .08})` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={`Mapa de ${country}`}>
      <path d={ringsPath} className="country-map-surface" />
      <path d={ringsPath} className="country-map-outline" />
    </svg>
    {locations.map((location, index) => {
      const itemP = Math.min(1, Math.max(0, (reveal - index * .12) / .3))
      const { x, y } = project(location.lat, location.lon)
      const label = 'label' in location ? location.label : location.name
      return <div key={label} className="country-map-pin" style={{ left: `${x}%`, top: `${y}%`, opacity: itemP, transform: `translate(-50%, -50%) scale(${.6 + itemP * .4})` }}>
        <i />
        <span>{label}<b>{location.people.toLocaleString('es-PE')}</b></span>
      </div>
    })}
  </div>
}
