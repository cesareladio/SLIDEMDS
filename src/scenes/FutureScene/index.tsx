import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

const destinations = [
  { title: 'ESCALA', items: ['Local', 'Offshore'] },
  { title: 'SECTORES', items: ['Energy', 'Mining', 'Insurance'] },
  { title: 'CAPACIDADES', items: ['AI', 'Cloud', 'Data', 'Automation', 'Enterprise Platforms'] },
]
export function FutureScene() {
  return <SceneShell eyebrow="06 · HACIA DÓNDE VAMOS" title="NUESTRA PRÓXIMA FRONTERA" align="center" className="future-scene">
    <div className="destinations">{destinations.map((destination, index) => <motion.div key={destination.title} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 + index * .22 }}>
      <span>0{index + 1}</span><h2>{destination.title}</h2><p>{destination.items.join(' · ')}</p>
    </motion.div>)}</div>
  </SceneShell>
}
