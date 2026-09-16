import { motion } from 'framer-motion'

export function CountryJourney({ history }: { history: { year: number; people: number; milestone?: string; inflection?: boolean }[] }) {
  return <motion.div className="country-journey" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <p className="country-section-kicker">UNA TRAYECTORIA QUE ACELERA</p>
    <div className="country-journey-path">
      {history.map((item, index) => <motion.div key={item.year} className={`country-journey-stop${item.inflection ? ' country-journey-inflection' : ''}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + index * .11 }}>
        <i />
        <span>{item.year}</span>
        <b>{item.people.toLocaleString('es-PE')}</b>
        {item.milestone && <small>{item.milestone}</small>}
      </motion.div>)}
    </div>
    <motion.div className="cj-inflection-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
      <span>2020</span><b>PUNTO DE INFLEXIÓN</b>
    </motion.div>
  </motion.div>
}
