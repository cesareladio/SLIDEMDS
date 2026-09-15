import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

export function DiversityScene() {
  return <SceneShell eyebrow="02 · NUESTRA ENERGÍA" title="DIVERSIDAD" align="right" className="diversity-scene">
    <div className="diversity-numbers">
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .45 }}><strong>22</strong><sup>%</sup><span>MUJERES</span></motion.div>
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: .48, x: 0 }} transition={{ delay: .7 }}><strong>78</strong><sup>%</sup><span>HOMBRES</span></motion.div>
    </div>
    <motion.p className="executive-stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}><b>30%</b><span>DE EJECUTIVOS<br />SON MUJERES</span></motion.p>
  </SceneShell>
}
