import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'
import { journeyWaypoints } from '../../data/journeyPath'

export function JourneyScene() {
  const milestones = journeyWaypoints.filter(item => item.milestone)
  return <SceneShell eyebrow="05 · CÓMO LLEGAMOS" title="NUESTRO CAMINO" className="journey-scene">
    <motion.div className="journey-intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}>2016 — 2026<br /><span>UNA TRAYECTORIA QUE ACELERA</span></motion.div>
    <motion.div className="journey-milestones" initial="hidden" animate="show">
      {milestones.map((item, index) => <motion.div key={item.year} className={item.inflection ? 'journey-milestone journey-milestone-inflection' : 'journey-milestone'} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { delay: .7 + index * .5, duration: .55 } } }}>
        <span>{item.year}</span><b>{item.milestone}</b>
      </motion.div>)}
    </motion.div>
    <motion.div className="journey-inflection" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.45, duration: .65 }}><span>2020</span><b>PUNTO DE<br />INFLEXIÓN</b></motion.div>
    <motion.div className="journey-scale" initial={{ opacity: 0, scale: .84 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4.4, duration: .8 }}><strong>5×</strong><span>ESCALA EN<br />~24 MESES</span></motion.div>
    <motion.div className="journey-closing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6.2, duration: .8 }}><strong>1,408</strong><span>HC · 2026</span></motion.div>
  </SceneShell>
}
