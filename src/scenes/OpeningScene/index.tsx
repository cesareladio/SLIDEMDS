import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

export function OpeningScene() {
  return <SceneShell eyebrow="GDN-e" className="opening-scene">
    <motion.h1
      className="opening-title"
      initial={{ letterSpacing: '.4em', opacity: 0, y: 12 }}
      animate={{ letterSpacing: ['.4em', '.1em', '.1em', '.1em'], opacity: [0, 1, 1, .82], y: [12, 0, 0, -4], scale: [1, 1, 1, .93] }}
      transition={{ duration: 11, times: [0, .18, .5, 1], ease: 'easeOut' }}
    >PERÚ <em>×</em> CHILE</motion.h1>
    <motion.p
      className="lead"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, .68] }}
      transition={{ duration: 11, times: [0, .22, .5, 1] }}
    >Talento que conecta el sur con el mundo</motion.p>
    <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: .7 }} transition={{ delay: 2 }}><span />INICIAR VIAJE</motion.div>
  </SceneShell>
}
