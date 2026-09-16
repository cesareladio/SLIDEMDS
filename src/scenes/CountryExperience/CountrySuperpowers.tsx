import { motion } from 'framer-motion'
import type { CountryProfile } from '../../data/countryProfiles'

export function CountrySuperpowers({ profile }: { profile: CountryProfile }) {
  const caps = profile.data.capabilities
  const max = Math.max(...caps.map(c => c.value), 1)
  return <motion.div className="country-superpowers" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    {caps.map((cap, i) => <motion.div key={cap.id} className="c-cap" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + i * .1 }}>
      <span>{cap.label}</span>
      <div className="c-cap-bar" style={{ '--w': `${(cap.value / max) * 100}%` } as React.CSSProperties} />
      <b>{cap.value}</b>
    </motion.div>)}
  </motion.div>
}
