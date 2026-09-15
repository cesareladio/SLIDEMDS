import { motion } from 'framer-motion'
import { certifications } from '../../data/capabilities'
import { SceneShell } from '../../components/SceneShell'
import { useStory } from '../../app/StoryContext'

export function AISkillingScene() {
  const { aiPhase: phase } = useStory()
  const isGH = phase !== 'certifications'
  return <SceneShell eyebrow="04 · TALENTO EN MOVIMIENTO" align="center" className="ai-scene">
    <motion.div className="ai-number" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <strong>{isGH ? `${certifications.gh300Percent}%` : certifications.totalAI.toLocaleString('es-PE')}</strong>
      <span>{isGH ? 'GH-300 · DEL COLECTIVO PERÚ' : 'CERTIFICACIONES IA'}</span>
    </motion.div>
    <motion.div className="orbit-concepts" initial={{ opacity: 0 }} animate={{ opacity: phase === 'concepts' ? 1 : 0 }} transition={{ duration: .8 }}>
      {[...certifications.concepts, 'AI'].map(item => <span key={item}>{item}</span>)}
    </motion.div>
    <motion.p className="ai-closing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase === 'concepts' ? 1 : 0, y: phase === 'concepts' ? 0 : 20 }} transition={{ duration: .8 }}>Preparando el talento para lo que viene.</motion.p>
    <span className="ai-phase-probe" aria-hidden="true" data-phase={phase} ref={() => undefined} />
    <motion.div className="ai-timing" animate={{ opacity: 0 }} transition={{ delay: 0 }} />
  </SceneShell>
}
