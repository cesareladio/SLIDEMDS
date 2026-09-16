import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

type Beat = 'earth' | 'identidades' | 'paises' | 'equipo' | 'onegdne'

const beats: { id: Beat; at: number }[] = [
  { id: 'earth', at: 0 },
  { id: 'identidades', at: 3 },
  { id: 'paises', at: 5 },
  { id: 'equipo', at: 7 },
  { id: 'onegdne', at: 11 },
]

const reveal = { initial: { opacity: 0, y: 18, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -8, filter: 'blur(4px)' }, transition: { duration: .65 } }

export function OpeningScene() {
  const [beat, setBeat] = useState<Beat>('earth')
  useEffect(() => {
    const started = performance.now()
    const tick = setInterval(() => {
      const elapsed = (performance.now() - started) / 1000
      for (let i = beats.length - 1; i >= 0; i--) {
        if (elapsed >= beats[i].at) { setBeat(beats[i].id); break }
      }
    }, 250)
    return () => clearInterval(tick)
  }, [])

  return <motion.section className="scene opening-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
    <div className="scene-copy opening-copy">
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: beat !== 'earth' ? 1 : 0 }} transition={{ duration: .5 }}>GDN-e</motion.p>
      <AnimatePresence mode="wait">
        {beat === 'identidades' && <motion.div key="identidades" className="opening-beat" {...reveal}>
          <h1 className="opening-beat-h1">DOS<br />IDENTIDADES</h1>
        </motion.div>}
        {beat === 'paises' && <motion.div key="paises" className="opening-beat" {...reveal}>
          <h1 className="opening-beat-h1">PERÚ <em>×</em> CHILE</h1>
          <p className="opening-sub">Talento que conecta el sur con el mundo</p>
        </motion.div>}
        {beat === 'equipo' && <motion.div key="equipo" className="opening-beat" {...reveal}>
          <h1 className="opening-beat-h1">UN SOLO<br />EQUIPO</h1>
        </motion.div>}
        {beat === 'onegdne' && <motion.div key="onegdne" className="opening-beat" {...reveal}>
          <p className="opening-one-eyebrow">ONE GDN-e</p>
          <h1 className="opening-beat-h1">DOS IDENTIDADES<br /><em>UN SOLO EQUIPO</em></h1>
          <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: .7 }} transition={{ delay: .8 }}><span />INICIAR VIAJE</motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </motion.section>
}
