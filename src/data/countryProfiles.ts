import { peru } from './peru'
import { chile } from './chile'
import { history } from './history'
import type { CountryData } from './types'

export type CountryId = 'peru' | 'chile'
export type CountrySection = 'overview' | 'talent' | 'superpowers' | 'journey'

export interface TalentProfile {
  womenPercent: number
  menPercent: number
  executiveWomen: { percent: number; of: number; outOf: number }
  leadershipWomen: { percent: number; of: number; outOf: number }
  careers: { name: string; from: string; to: string; since: string }[]
  quote: string
}

export interface CountryProfile {
  data: CountryData
  talent?: TalentProfile
  journeyHistory?: typeof history
  slogan: string
  sections: CountrySection[]
}

const peruTalent: TalentProfile = {
  womenPercent: 22,
  menPercent: 78,
  executiveWomen: { percent: 67, of: 6, outOf: 9 },
  leadershipWomen: { percent: 25, of: 13, outOf: 52 },
  careers: [
    { name: 'INGRID CRUZ', from: 'CJ', to: 'DELIVERY LEAD', since: 'enero 2026' },
    { name: 'YAELA DÍAZ', from: 'CSD', to: 'MANAGER GDN-e', since: 'enero 2017' },
  ],
  quote: '"No solo hablamos de diversidad. Mostramos progresión."',
}

export const countryProfiles: Record<CountryId, CountryProfile> = {
  peru: {
    data: peru,
    talent: peruTalent,
    journeyHistory: history,
    slogan: 'Talento que enciende el futuro.',
    sections: ['overview', 'talent', 'superpowers', 'journey'],
  },
  chile: {
    data: chile,
    talent: undefined,
    journeyHistory: undefined,
    slogan: 'La magia del sur.',
    sections: ['overview', 'superpowers'],
  },
}
