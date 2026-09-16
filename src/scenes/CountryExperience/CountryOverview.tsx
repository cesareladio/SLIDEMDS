import { motion } from 'framer-motion'
import type { CountryProfile } from '../../data/countryProfiles'
import type { TerritorialNode } from '../../data/types'

const TOP3 = new Set(['La Libertad', 'Arequipa', 'Lima'])
const PERU_BOUNDS = { latMin: -18.5, latMax: -0.1, lonMin: -81.5, lonMax: -68.2 }
function geoToPercent(lat: number, lon: number) {
  const x = ((lon - PERU_BOUNDS.lonMin) / (PERU_BOUNDS.lonMax - PERU_BOUNDS.lonMin)) * 100
  const y = ((PERU_BOUNDS.latMax - lat) / (PERU_BOUNDS.latMax - PERU_BOUNDS.latMin)) * 100
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

function GeoPin({ node, index, isTop }: { node: TerritorialNode; index: number; isTop: boolean }) {
  const { x, y } = geoToPercent(node.lat, node.lon)
  const alignRight = x > 58
  return <motion.div
    className={`geo-pin${isTop ? ' geo-pin-top' : ''}`}
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 + index * 0.12, type: 'spring', stiffness: 200 }}
  >
    <span className="geo-dot" />
    <div className={`geo-label${alignRight ? ' geo-label-right' : ''}`}>
      <span>{node.label}</span>
      <b>{node.people.toLocaleString('es-PE')}</b>
    </div>
  </motion.div>
}

export function CountryOverview({ profile }: { profile: CountryProfile }) {
  const data = profile.data
  const territorial = data.territorialDistribution ?? []
  const delivery = data.deliveryDistribution ?? []
  return <motion.div className="country-overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="country-hero-number">
      <strong>{data.total.toLocaleString('es-PE')}</strong><span>PERSONAS</span>
    </div>
    {territorial.length > 0 && <div className="country-peru-map">
      {territorial.map((node, i) => <GeoPin key={node.label} node={node} index={i} isTop={TOP3.has(node.label)} />)}
    </div>}
    {territorial.length > 0 && <motion.div className="country-top3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
      <strong>64.7%</strong>
      <span>TOP 3 · La Libertad · Arequipa · Lima</span>
    </motion.div>}
    {delivery.length > 0 && <motion.div className="country-delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
      {delivery.map(item => <div key={item.label}><span>{item.label}</span><b>{item.percent}%</b></div>)}
    </motion.div>}
  </motion.div>
}
