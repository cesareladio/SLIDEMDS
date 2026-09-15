import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

export function OpeningScene() {
  return <SceneShell eyebrow="GDN-e" align="center" className="opening-scene">
    <motion.h1 className="opening-title" initial={{ letterSpacing: '.55em', opacity: 0 }} animate={{ letterSpacing: '.13em', opacity: 1 }} transition={{ duration: 1.8, ease: 'easeOut', delay: .45 }}>PERÚ <em>×</em> CHILE</motion.h1>
    <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: 1.2 }}>Talento que conecta el sur con el mundo</motion.p>
    <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: .7 }} transition={{ delay: 2 }}><span />INICIAR VIAJE</motion.div>
  </SceneShell>
}
