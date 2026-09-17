import type { CountryData } from './types'

export const chile: CountryData = {
  id: 'chile', name: 'Chile', total: 609,
  operationalHubs: [
    { name: 'Temuco', people: 281, lat: -38.74, lon: -72.59 },
    { name: 'Concepción', people: 87, lat: -36.83, lon: -73.05 },
  ],
  territorialDistribution: [
    { label: 'La Araucanía', percent: 55, people: 281, lat: -38.74, lon: -72.59 },
    { label: 'Biobío', percent: 17, people: 87, lat: -36.83, lon: -73.05 },
    { label: 'Metropolitana', percent: 6, people: 33, lat: -33.45, lon: -70.67 },
    { label: 'Maule', percent: 6, people: 29, lat: -35.42, lon: -71.55 },
    { label: 'Los Ríos', percent: 4, people: 20, lat: -39.80, lon: -73.25 },
    { label: 'Los Lagos', percent: 3, people: 16, lat: -41.47, lon: -72.31 },
    { label: 'Coquimbo', percent: 3, people: 14, lat: -29.96, lon: -71.33 },
    { label: 'Ñuble', percent: 2, people: 12, lat: -36.31, lon: -71.94 },
  ],
  capabilities: [
    { id: 'backend', label: 'Back-End', value: 227, details: [{ label: 'Microservices', value: 110 }, { label: 'Java', value: 85 }] },
    { id: 'data', label: 'Data', value: 66 },
    { id: 'quality', label: 'Quality', value: 53 },
    { id: 'frontend', label: 'Front-End', value: 47 },
  ],
}
