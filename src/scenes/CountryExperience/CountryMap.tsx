import { motion } from 'framer-motion'
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
  const polygon = countryPolygon(country)
  return polygon.map(([lon, lat], index) => {
    const { x, y } = project(country, lat, lon)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ') + ' Z'
}

export function CountryMap({ country, territories = [], hubs = [] }: { country: CountryId; territories?: TerritorialNode[]; hubs?: Hub[] }) {
  const locations = territories.length > 0 ? territories : hubs
  return <motion.div className={`country-map country-map-${country}`} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .65 }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label={`Mapa de ${country}`}>
      <path d={polygonPath(country)} className="country-map-surface" />
      <path d={polygonPath(country)} className="country-map-outline" />
    </svg>
    {locations.map((location, index) => {
      const { x, y } = project(country, location.lat, location.lon)
      const label = 'label' in location ? location.label : location.name
      const people = location.people
      return <motion.div key={label} className="country-map-pin" style={{ left: `${x}%`, top: `${y}%` }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .25 + index * .12, type: 'spring', stiffness: 190 }}>
        <i />
        <span>{label}<b>{people.toLocaleString('es-PE')}</b></span>
      </motion.div>
    })}
  </motion.div>
}
