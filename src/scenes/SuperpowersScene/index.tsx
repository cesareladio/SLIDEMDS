import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SceneShell } from '../../components/SceneShell'
import { capabilities } from '../../data/capabilities'
import type { Capability } from '../../data/types'

export function SuperpowersScene() {
  const [selected, setSelected] = useState<Capability | null>(null)
  return <SceneShell eyebrow="03 · LO QUE NOS HACE ÚNICOS" title="NUESTROS SUPERPODERES" className="superpowers-scene">
    <AnimatePresence mode="wait">
      {!selected ? <motion.div className="capability-list" key="list" exit={{ opacity: 0, x: -30 }}>
        {capabilities.peru.map((capability, index) => <motion.button key={capability.id} onClick={() => setSelected(capability)} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .52 + index * .09 }}>
          <span>{capability.label}</span><b>{capability.value}</b><i>0{index + 1}</i>
        </motion.button>)}
      </motion.div> : <motion.div className="capability-detail" key={selected.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
        <button className="back-link" onClick={() => setSelected(null)}><ArrowLeft /> VOLVER A LA CONSTELACIÓN</button>
        <p>{selected.label}</p><strong>{selected.value}</strong><span>ESPECIALISTAS</span>
        <div>{selected.details?.map(item => <p key={item.label}><span>{item.label}</span><b>{item.value}</b></p>)}</div>
      </motion.div>}
    </AnimatePresence>
  </SceneShell>
}
