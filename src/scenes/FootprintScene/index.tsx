import { motion } from 'framer-motion'
import { peru } from '../../data/peru'
import { SceneShell } from '../../components/SceneShell'
import { formatNumber } from '../../utils/math'

export function FootprintScene() {
  const territorial = peru.territorialDistribution ?? []
  const topTerritories = [...territorial].sort((a, b) => b.percent - a.percent).slice(0, 3)
  const topLabels = new Set(topTerritories.map(item => item.label))

  return <SceneShell eyebrow="01 · QUIÉNES SOMOS" title="NUESTRA HUELLA" className="footprint-scene">
    <motion.div className="hero-number" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
      <strong>{formatNumber(peru.total)}</strong><span>PERSONAS</span>
    </motion.div>

    <motion.div className="territorial-editorial" initial="hidden" animate="show">
      {territorial.map((item, index) => {
        const isTop = topLabels.has(item.label)
        return <motion.div
          key={item.label}
          className={`territory-node${isTop ? ' territory-node-top' : ''}`}
          style={{ '--hc': item.percent, '--delay': `${0.35 + index * 0.16}s` } as React.CSSProperties}
          variants={{
            hidden: { opacity: 0, y: 18, scale: .82 },
            show: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.35 + index * 0.16, duration: .45 } }
          }}
        >
          <span className="territory-label">{item.label}</span>
          <span className="territory-hc">{item.percent}% HC</span>
          <i className="territory-pulse" />
        </motion.div>
      })}
    </motion.div>

    <motion.div className="top3-highlight" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55, duration: .55 }}>
      <strong>64.7%</strong>
      <span>DEL HC CONCENTRADO EN EL TOP 3</span>
    </motion.div>

    <motion.div className="hub-stats" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: .5 }}>
      {peru.operationalHubs?.map(hub => <div key={hub.name}><span>{hub.name}</span><b>{formatNumber(hub.people)}</b></div>)}
    </motion.div>

    <motion.div className="footprint-delivery" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.45, duration: .45 }}>
      <span>Local</span>
      <i />
      <span>Offshore</span>
      <i />
      <span>Nearshore</span>
    </motion.div>
  </SceneShell>
}
