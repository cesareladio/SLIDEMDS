import { motion } from 'framer-motion'
import { peru } from '../../data/peru'
import { SceneShell } from '../../components/SceneShell'
import { formatNumber } from '../../utils/math'
import type { TerritorialNode } from '../../data/types'

const TOP3_LABELS = new Set(['La Libertad', 'Arequipa', 'Lima'])

const PERU_BOUNDS = { latMin: -18.5, latMax: -0.1, lonMin: -81.5, lonMax: -68.2 }

function geoToPercent(lat: number, lon: number) {
  const x = ((lon - PERU_BOUNDS.lonMin) / (PERU_BOUNDS.lonMax - PERU_BOUNDS.lonMin)) * 100
  const y = ((PERU_BOUNDS.latMax - lat) / (PERU_BOUNDS.latMax - PERU_BOUNDS.latMin)) * 100
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

function TerritoryPin({ node, index, isTop }: { node: TerritorialNode; index: number; isTop: boolean }) {
  const { x, y } = geoToPercent(node.lat, node.lon)
  const delay = 0.6 + index * 0.18
  const alignRight = x > 58
  return <motion.div
    className={`geo-pin${isTop ? ' geo-pin-top' : ''}`}
    style={{ left: `${x}%`, top: `${y}%` } as React.CSSProperties}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4, type: 'spring', stiffness: 220 }}
  >
    <span className="geo-dot" />
    <div className={`geo-label${alignRight ? ' geo-label-right' : ''}`}>
      <span>{node.label}</span>
      <b>{node.people.toLocaleString('es-PE')}</b>
    </div>
  </motion.div>
}

export function FootprintScene() {
  const territorial = peru.territorialDistribution ?? []
  const delivery = peru.deliveryDistribution ?? []

  return <SceneShell eyebrow="01 · QUIÉNES SOMOS" title="NUESTRA HUELLA" className="footprint-scene">
    <motion.div className="hero-number" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
      <strong>{formatNumber(peru.total)}</strong><span>PERSONAS</span>
    </motion.div>

    <div className="footprint-layout">
      <motion.div className="peru-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4, duration: .7 }}>
        {territorial.map((node, index) => <TerritoryPin key={node.label} node={node} index={index} isTop={TOP3_LABELS.has(node.label)} />)}
      </motion.div>
      <div className="footprint-data">
        <motion.div className="top3-highlight" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: .65 }}>
          <strong>64.7%</strong>
          <span>DEL HC EN EL TOP 3<br /><small>La Libertad · Arequipa · Lima</small></span>
        </motion.div>
        <motion.div className="hub-stats" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: .5 }}>
          {delivery.map(item => <div key={item.label}><span>{item.label}</span><b>{item.percent}%</b></div>)}
        </motion.div>
      </div>
    </div>
  </SceneShell>
}
