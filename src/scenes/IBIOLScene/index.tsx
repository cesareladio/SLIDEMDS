import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'
import { ibiol, type IBIOLPhase } from '../../data/ibiol'
import { useStory } from '../../app/StoryContext'

const chapters: { id: IBIOLPhase; label: string }[] = [{ id: 'today', label: 'HOY' }, { id: 'grow', label: 'CRECER' }, { id: 'ask', label: 'ACELERAR' }]

export function IBIOLScene() {
  const { ibiolPhase, setIBIOLPhase } = useStory()
  return <SceneShell eyebrow="06 · ESTRATEGIA COMPARTIDA" title="NUESTRA AMBICIÓN PARA IBIOL" align="center" className={`ibiol-scene ibiol-${ibiolPhase}`}>
    <motion.p className="ibiol-subtitle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>{ibiol.subtitle}</motion.p>
    <div className="ibiol-chapters">
      {chapters.map(chapter => <button key={chapter.id} className={chapter.id === ibiolPhase ? 'active' : ''} onClick={() => setIBIOLPhase(chapter.id)}>{chapter.label}</button>)}
    </div>
    {ibiolPhase === 'today' && <motion.div className="ibiol-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <strong>HOY</strong><span>CAPACIDADES LISTAS PARA ESCALAR</span>
      <p>{ibiol.todayCapabilities.map(item => item.label).join(' · ')}</p>
    </motion.div>}
    {ibiolPhase === 'grow' && <motion.div className="ibiol-copy ibiol-grow-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <strong>CRECER</strong><span>FY26 / FY27</span>
      <p>{ibiol.growthIndustries.map(item => item.label).join(' · ')}</p><small>{ibiol.growthCapabilities.map(item => item.label).join(' · ')}</small>
    </motion.div>}
    {ibiolPhase === 'ask' && <motion.div className="ibiol-copy ibiol-ask-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <strong>ACELERAR</strong><span>{ibiol.asks.join(' · ')}</span>
      <p>{ibiol.finalMessage}</p>
    </motion.div>}
  </SceneShell>
}
