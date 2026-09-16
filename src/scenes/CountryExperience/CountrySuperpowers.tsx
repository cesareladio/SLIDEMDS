import { motion } from 'framer-motion'
import type { CountryProfile } from '../../data/countryProfiles'

export function CountrySuperpowers({ profile }: { profile: CountryProfile }) {
  const caps = profile.data.capabilities
  return <motion.div className="country-superpowers" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <p className="country-section-kicker">CAPACIDAD CONECTADA</p>
    <div className="country-cap-constellation">
      {caps.map((cap, index) => <motion.div key={cap.id} className={`country-cap-node country-cap-node-${index + 1}`} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12 + index * .1, type: 'spring', stiffness: 170 }}>
        <i />
        <span>{cap.label}</span>
        <b>{cap.value}</b>
      </motion.div>)}
    </div>
  </motion.div>
}
