import type { CountryData } from './types'

export const chile: CountryData = {
  id: 'chile', name: 'Chile', total: 720, isMock: true,
  operationalHubs: [
    { name: 'Santiago', people: 430, lat: -33.45, lon: -70.67 },
    { name: 'Temuco', people: 180, lat: -38.74, lon: -72.59 },
    { name: 'Concepción', people: 110, lat: -36.83, lon: -73.05 },
  ],
  territorialDistribution: undefined,
  deliveryDistribution: [
    { label: 'Local', percent: 68 }, { label: 'Offshore', percent: 22 }, { label: 'Nearshore', percent: 10 },
  ],
  capabilities: [
    { id: 'salesforce', label: 'Salesforce', value: 180 },
    { id: 'testing-cl', label: 'Testing', value: 145 },
    { id: 'frontend-cl', label: 'Front-End', value: 110 },
    { id: 'cloud', label: 'Cloud', value: 95 },
  ],
}
