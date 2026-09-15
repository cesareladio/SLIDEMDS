import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'
import { history } from '../../data/history'
import { formatNumber } from '../../utils/math'

export function JourneyScene() {
  return <SceneShell eyebrow="05 · CÓMO LLEGAMOS" title="NUESTRO CAMINO" className="journey-scene">
    <motion.div className="timeline-labels" initial="hidden" animate="show">
      {history.filter(item => item.milestone).map((item, index) => <motion.div key={item.year} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { delay: .55 + index * .14 } } }}><span>{item.year}</span><b>{formatNumber(item.people)}</b></motion.div>)}
    </motion.div>
    <motion.div className="inflection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}><span>2020</span><b>PUNTO DE<br />INFLEXIÓN</b></motion.div>
    <motion.div className="scale-stat" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.75, type: 'spring' }}><strong>5×</strong><span>ESCALA EN<br />~24 MESES</span></motion.div>
  </SceneShell>
}
