import { peru } from './peru'
import { chile } from './chile'
import { history } from './history'
import type { CountryData } from './types'

export type CountryId = 'peru' | 'chile'
export type CountrySection = 'overview' | 'talent' | 'superpowers' | 'certifications' | 'journey'

export interface HistoryItem {
  year: number
  people: number
  milestone?: string
  sublabel?: string
  location?: string
  inflection?: boolean
}

export interface TalentProfile {
  womenPercent: number
  menPercent: number
  executiveWomen: { percent: number; of: number; outOf: number }
  leadershipWomen: { percent: number; of: number; outOf: number }
  careers: { name: string; from: string; to: string; since: string }[]
  quote: string
}

export interface CertificationProfile {
  milestones: Array<{ year: number | string; count: number; label: string; approval?: number }>
  ambition: { year: number | string; count: number; percent: number; approvalTarget?: number }
}

export interface CountryProfile {
  data: CountryData
  talent?: TalentProfile
  certifications?: CertificationProfile
  journeyHistory?: HistoryItem[]
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

const chileTalent: TalentProfile = {
  womenPercent: 15.9,
  menPercent: 84.1,
  executiveWomen: { percent: 33, of: 2, outOf: 6 },
  leadershipWomen: { percent: 20, of: 5, outOf: 25 },  // kept for data integrity; not shown in exec frame
  careers: [
    { name: 'MARISEL PRADO', from: 'PROFESIONAL BASE', to: 'EQUIPO EJECUTIVO · 2025', since: '2025' },
    { name: 'YANNETT BECERRA', from: 'DESARROLLADORA', to: 'TOP EXPERT LEAD · 2026', since: '2026' },
  ],
  quote: '"Desde el sur, cambiamos el futuro."',
}

const chileHistory = [
  { year: 2007, people: 8, milestone: 'PRESENCIA EN TEMUCO' },
  { year: 2015, people: 258, milestone: '+250 PROFESIONALES' },
  { year: 2015, people: 258, milestone: 'PROYECTO HUB DIGITAL' },
  { year: 2016, people: 280, milestone: 'PUESTA EN MARCHA DEL HUB', inflection: true },
]

const chileCertifications: CertificationProfile = {
  milestones: [
    { year: '2024', count: 25, label: 'PERSONAS CERTIFICADAS' },
    { year: 'FY25', count: 112, label: '+112 (+82% APROBACIÓN)', approval: 82 },
    { year: 'FY26 HOY', count: 206, label: '206 (100% APROBACIÓN)', approval: 100 },
  ],
  ambition: { year: 'FY26', count: 332, percent: 65, approvalTarget: 85 },
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
    talent: chileTalent,
    certifications: chileCertifications,
    journeyHistory: chileHistory,
    slogan: 'La magia del sur.',
    sections: ['overview', 'talent', 'superpowers', 'certifications', 'journey'],
  },
}
