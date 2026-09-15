import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

export function ClosingScene() {
  return <SceneShell eyebrow="GDN-e · PERÚ × CHILE" align="center" className="closing-scene">
    <div className="country-poetry">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .35 }}><strong>CHILE</strong><span>La magia del sur</span></motion.div>
      <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .85, duration: 1.1 }} />
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15 }}><strong>PERÚ</strong><span>Talento que enciende el futuro</span></motion.div>
    </div>
    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1 }}>DOS PAÍSES<br /><em>UNA CAPACIDAD SIN FRONTERAS</em></motion.h1>
    <motion.div className="closing-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>NTT <b>DATA</b></motion.div>
  </SceneShell>
}
