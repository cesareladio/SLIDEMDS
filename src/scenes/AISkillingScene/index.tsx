import { motion } from 'framer-motion'
import { certifications } from '../../data/capabilities'
import { SceneShell } from '../../components/SceneShell'

export function AISkillingScene() {
  return <SceneShell eyebrow="04 · TALENTO EN MOVIMIENTO" align="center" className="ai-scene">
    <motion.div className="ai-number" initial={{ opacity: 0, scale: .82, filter: 'blur(12px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: .55, duration: 1.5 }}>
      <strong>{certifications.totalAI.toLocaleString('es-PE')}</strong><span>CERTIFICACIONES IA</span>
    </motion.div>
    <motion.div className="gh-stat" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: .8 }}><b>{certifications.gh300Percent}%</b><span>GH-300<br /><small>DEL COLECTIVO PERÚ</small></span></motion.div>
    <motion.div className="orbit-concepts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>{certifications.concepts.map(item => <span key={item}>{item}</span>)}</motion.div>
  </SceneShell>
}
