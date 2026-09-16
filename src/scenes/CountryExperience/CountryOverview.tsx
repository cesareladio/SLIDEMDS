import { motion } from 'framer-motion'
import type { CountryProfile } from '../../data/countryProfiles'
import { CountryMap } from './CountryMap'

export function CountryOverview({ profile }: { profile: CountryProfile }) {
  const { data } = profile
  const territorial = data.territorialDistribution ?? []
  const delivery = data.deliveryDistribution ?? []
  return <motion.div className="country-overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="country-hero-number">
      <strong>{data.total.toLocaleString('es-PE')}</strong><span>PERSONAS</span>
    </div>
    <CountryMap country={data.id} territories={territorial} hubs={data.operationalHubs ?? []} />
    {territorial.length > 0 && <motion.div className="country-top3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
      <strong>64.7%</strong>
      <span>TOP 3 · La Libertad · Arequipa · Lima</span>
    </motion.div>}
    {delivery.length > 0 && <motion.div className="country-delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
      {delivery.map(item => <div key={item.label}><span>{item.label}</span><b>{item.percent}%</b></div>)}
    </motion.div>}
  </motion.div>
}
