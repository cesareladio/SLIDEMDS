import { motion } from 'framer-motion'

export function CountryJourney({ history }: { history: { year: number; people: number; milestone?: string; inflection?: boolean }[] }) {
  const max = Math.max(...history.map(h => h.people), 1)
  return <motion.div className="country-journey" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="cj-bars">
      {history.map((item, i) => <motion.div key={item.year} className={`cj-bar${item.inflection ? ' cj-bar-inflection' : ''}`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: .08 + i * .06, duration: .5, ease: 'easeOut' }} style={{ '--h': `${(item.people / max) * 100}%` } as React.CSSProperties}>
        {item.milestone && <span className="cj-milestone">{item.milestone}</span>}
      </motion.div>)}
    </div>
    <div className="cj-years">
      {history.map(item => <span key={item.year}>{item.year}</span>)}
    </div>
    <motion.div className="cj-inflection-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
      <span>2020</span><b>PUNTO DE INFLEXIÓN</b>
    </motion.div>
  </motion.div>
}
