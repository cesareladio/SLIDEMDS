import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useStory } from '../../app/StoryContext'
import { countryProfiles, type CountrySection } from '../../data/countryProfiles'
import { CountryOverview } from './CountryOverview'
import { CountryTalent } from './CountryTalent'
import { CountrySuperpowers } from './CountrySuperpowers'
import { CountryJourney } from './CountryJourney'

const sectionLabels: Record<CountrySection, string> = {
  overview: '01 HUELLA',
  talent: '02 TALENTO',
  superpowers: '03 SUPERPODERES',
  journey: '04 NUESTRO CAMINO',
}

export function CountryExperience() {
  const { selectedCountry, clearCountry, countrySection, setCountrySection } = useStory()
  if (!selectedCountry) return null
  const profile = countryProfiles[selectedCountry]

  return <motion.section className="scene country-experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6 }}>
    <div className="country-chrome">
      <motion.button className="country-back" onClick={clearCountry} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 }}>
        <ArrowLeft size={12} /><span>ONE GDN-e</span>
      </motion.button>
      <motion.div className="country-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}>
        {profile.sections.map((section, index) => <button key={section} className={section === countrySection ? 'active' : ''} onClick={() => setCountrySection(section)}>
          <i>{String(index + 1).padStart(2, '0')}</i><span>{sectionLabels[section].replace(/^\d{2} /, '')}</span>
        </button>)}
      </motion.div>
      <motion.div className="country-identity" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
        <span>{profile.data.name.toUpperCase()}</span>
        <p>{profile.slogan}</p>
        {profile.data.isMock && import.meta.env.DEV && <small className="mock-badge">DATA PENDING</small>}
      </motion.div>
    </div>
    <div className="country-stage">
      <AnimatePresence mode="wait">
        {countrySection === 'overview' && <CountryOverview key="overview" profile={profile} />}
        {countrySection === 'talent' && profile.talent && <CountryTalent key="talent" talent={profile.talent} />}
        {countrySection === 'superpowers' && <CountrySuperpowers key="superpowers" profile={profile} />}
        {countrySection === 'journey' && profile.journeyHistory && <CountryJourney key="journey" history={profile.journeyHistory} />}
      </AnimatePresence>
    </div>
  </motion.section>
}
