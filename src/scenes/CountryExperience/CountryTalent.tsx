import { motion } from 'framer-motion'
import type { TalentProfile } from '../../data/countryProfiles'

export function CountryTalent({ talent }: { talent: TalentProfile }) {
  return <motion.div className="country-talent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="country-gender">
      <div className="c-stat"><strong>{talent.womenPercent}</strong><sup>%</sup><span>MUJERES</span></div>
      <div className="c-stat c-stat-muted"><strong>{talent.menPercent}</strong><sup>%</sup><span>HOMBRES</span></div>
    </div>
    <div className="c-flowline" />
    <div className="country-leadership">
      <div className="c-block">
        <header><strong>{talent.executiveWomen.percent}</strong><sup>%</sup></header>
        <p>DE EJECUTIVOS SON MUJERES</p>
        <small>{talent.executiveWomen.of} DE {talent.executiveWomen.outOf}</small>
      </div>
      <div className="c-block">
        <header><strong>{talent.leadershipWomen.percent}</strong><sup>%</sup></header>
        <p>DEL LIDERAZGO ES FEMENINO</p>
        <small>{talent.leadershipWomen.of} DE {talent.leadershipWomen.outOf}</small>
      </div>
    </div>
    <div className="country-careers">
      {talent.careers.map(career => <div key={career.name} className="c-career">
        <h3>{career.name}</h3>
        <div><span>{career.from}</span><i>→</i><span>{career.to}</span></div>
        <p>{career.since}</p>
      </div>)}
    </div>
    <p className="country-quote">{talent.quote}</p>
  </motion.div>
}
