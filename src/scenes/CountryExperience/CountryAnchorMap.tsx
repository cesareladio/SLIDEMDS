import { useMemo } from 'react'
import { projectCountryToViewBox } from '../../utils/countryProjection'
import type { CountryId } from '../../data/countryProfiles'
import type { Hub, TerritorialNode } from '../../data/types'

interface CountryAnchorMapProps {
  country: CountryId
  territories?: TerritorialNode[]
  hubs?: Hub[]
  silhouetteOpacity?: number
  outlineOpacity?: number
  pinsOpacity?: number
  labelsOpacity?: number
  progress?: number
}

export function CountryAnchorMap({
  country, territories = [], hubs = [],
  silhouetteOpacity = 1, outlineOpacity = 1, pinsOpacity = 1, labelsOpacity = 1,
  progress = 1,
}: CountryAnchorMapProps) {
  const { project, ringsPath } = useMemo(() => projectCountryToViewBox(country), [country])
  const locations = territories.length > 0 ? territories : hubs
  const reveal = Math.min(1, Math.max(0, progress))

  return <div className={`country-map country-map-${country}`}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={`Mapa de ${country}`}>
      <path d={ringsPath} className="country-map-surface" style={{ opacity: silhouetteOpacity }} />
      <path d={ringsPath} className="country-map-outline" style={{ opacity: outlineOpacity }} />
    </svg>
    {pinsOpacity > .01 && locations.map((location, index) => {
      const itemReveal = Math.min(1, Math.max(0, (reveal - index * .12) / .3))
      const { x, y } = project(location.lat, location.lon)
      const label = 'label' in location ? location.label : location.name
      return <div key={label} className="country-map-pin" style={{ left: `${x}%`, top: `${y}%`, opacity: itemReveal * pinsOpacity, transform: `translate(-50%,-50%) scale(${.6 + itemReveal * .4})` }}>
        <i />
        {labelsOpacity > .01 && <span style={{ opacity: labelsOpacity }}>{label}<b>{location.people.toLocaleString('es-PE')}</b></span>}
      </div>
    })}
  </div>
}
