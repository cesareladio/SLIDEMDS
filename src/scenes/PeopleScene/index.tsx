import { motion } from 'framer-motion'
import { SceneShell } from '../../components/SceneShell'

export function PeopleScene() {
  return <SceneShell eyebrow="02 · NUESTRA GENTE" title="PROGRESIÓN REAL DEL TALENTO" align="right" className="people-scene">
    <div className="people-spotlight" />

    <motion.section
      className="people-stage people-diversity"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, ease: 'easeOut' }}
    >
      <motion.div className="people-stat" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2, duration: .65 }}>
        <strong>22</strong>
        <sup>%</sup>
        <span>MUJERES</span>
      </motion.div>
      <motion.div className="people-stat people-stat-muted" initial={{ opacity: 0, x: 34 }} animate={{ opacity: .86, x: 0 }} transition={{ delay: .36, duration: .65 }}>
        <strong>78</strong>
        <sup>%</sup>
        <span>HOMBRES</span>
      </motion.div>
    </motion.section>

    <motion.div
      className="people-flowline"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: .9 }}
      transition={{ delay: .72, duration: .8, ease: 'easeInOut' }}
    />

    <motion.section
      className="people-stage people-leadership"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: .92, duration: .55 }}
    >
      <motion.article className="leadership-block" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ delay: 1, duration: .75, ease: 'easeOut' }}>
        <header><strong>67</strong><sup>%</sup></header>
        <p>DE EJECUTIVOS SON MUJERES</p>
        <small>6 DE 9</small>
      </motion.article>

      <motion.article className="leadership-block" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ delay: 1.2, duration: .75, ease: 'easeOut' }}>
        <header><strong>25</strong><sup>%</sup></header>
        <p>DEL LIDERAZGO ES FEMENINO</p>
        <small>13 DE 52</small>
      </motion.article>
    </motion.section>

    <motion.section
      className="people-stage people-careers"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: .7 }}
    >
      <motion.article className="career-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        <h3>INGRID CRUZ</h3>
        <div><span>CJ</span><i>→</i><span>DELIVERY LEAD</span></div>
        <p>Ingreso: enero 2026</p>
      </motion.article>

      <motion.article className="career-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.78 }}>
        <h3>YAELA DÍAZ</h3>
        <div><span>CSD</span><i>→</i><span>MANAGER GDN-e</span></div>
        <p>Ingreso: enero 2017</p>
      </motion.article>
    </motion.section>

    <motion.p
      className="people-closing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.06, duration: .65 }}
    >
      “No solo hablamos de diversidad.<br />Mostramos progresión.”
    </motion.p>
  </SceneShell>
}
