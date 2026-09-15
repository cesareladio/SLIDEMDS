import { motion } from 'framer-motion'
import { peru } from '../../data/peru'
import { SceneShell, rise, stagger } from '../../components/SceneShell'
import { formatNumber } from '../../utils/math'

export function FootprintScene() {
  return <SceneShell eyebrow="01 · QUIÉNES SOMOS" title="NUESTRA HUELLA" className="footprint-scene">
    <motion.div className="hero-number" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .8 }}>
      <strong>{formatNumber(peru.total)}</strong><span>PERSONAS</span>
    </motion.div>
    <motion.div className="hub-stats" variants={stagger} initial="hidden" animate="show">
      {peru.hubs.map(hub => <motion.div variants={rise} key={hub.name}><span>{hub.name}</span><b>{formatNumber(hub.people)}</b></motion.div>)}
    </motion.div>
    <motion.div className="distribution" variants={stagger} initial="hidden" animate="show">
      {peru.distribution.map(item => <motion.div variants={rise} key={item.label}><i style={{ '--value': `${item.percent}%` } as React.CSSProperties} /><span>{item.percent}% <small>{item.label}</small></span></motion.div>)}
    </motion.div>
  </SceneShell>
}
