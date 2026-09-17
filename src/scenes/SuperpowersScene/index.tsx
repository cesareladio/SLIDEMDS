import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SceneShell } from '../../components/SceneShell'
import { capabilityNodes, type CapabilityFocus } from '../../data/capabilityConstellation'
import { useState } from 'react'

const selectable = capabilityNodes.filter(node => node.focus)

export function SuperpowersScene() {
  const [capabilityFocus, setCapabilityFocus] = useState<CapabilityFocus>('overview')
  const selected = selectable.find(node => node.focus === capabilityFocus)

  return <SceneShell eyebrow="03 · LO QUE NOS HACE ÚNICOS" title="NUESTROS SUPERPODERES" className={`superpowers-scene ${selected ? 'superpowers-focus' : ''}`}>
    {!selected ? <motion.div className="capability-constellation-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p>Una constelación de capacidades conectadas por experiencia.</p>
      <div className="capability-constellation-actions">
        {capabilityNodes.map((node, index) => <motion.button key={node.id} className={node.focus ? 'capability-focus-trigger' : ''} onClick={() => node.focus && setCapabilityFocus(node.focus)} initial={{ opacity: 0, x: -18 }} animate={{ opacity: node.focus ? 1 : .48, x: 0 }} transition={{ delay: .52 + index * .09 }} disabled={!node.focus}>
          <span>{node.label}</span><b>{node.value}</b><i>0{index + 1}</i>
        </motion.button>)}
      </div>
      <span className="capability-hint">SELECCIONA TESTING, SAP O BACK-END PARA EXPLORAR</span>
    </motion.div> : <motion.div className="capability-detail" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <button className="back-link" onClick={() => setCapabilityFocus('overview')}><ArrowLeft /> VOLVER A LA CONSTELACIÓN</button>
      <p>{selected.label}</p><strong>{selected.value}</strong><span>ESPECIALISTAS</span>
      <div>{selected.details?.map(item => <p key={item.label}><span>{item.label}</span><b>{item.value}</b></p>)}</div>
    </motion.div>}
  </SceneShell>
}
