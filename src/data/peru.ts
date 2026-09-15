import type { CountryData } from './types'

export const peru: CountryData = {
  id: 'peru', name: 'Perú', total: 1408,
  hubs: [
    { name: 'Trujillo', people: 1048, lat: -8.11, lon: -79.03 },
    { name: 'Arequipa', people: 360, lat: -16.4, lon: -71.54 },
  ],
  distribution: [
    { label: 'Local', percent: 63, people: 894 },
    { label: 'Offshore', percent: 28, people: 399 },
    { label: 'Nearshore', percent: 8, people: 115 },
  ],
  capabilities: [
    { id: 'backend', label: 'Back-End', value: 368, details: [{ label: 'Microservices', value: 161 }, { label: 'Java', value: 146 }, { label: '.NET', value: 108 }] },
    { id: 'testing', label: 'Testing', value: 279, details: [{ label: 'Automation Testing', value: 156 }, { label: 'Functional Testing', value: 99 }] },
    { id: 'sap', label: 'SAP', value: 230, details: [{ label: 'ABAP', value: 99 }] },
    { id: 'microsoft', label: 'Microsoft', value: 115 },
    { id: 'frontend', label: 'Front-End', value: 77 },
    { id: 'data-ai', label: 'Data & AI', value: 54 },
  ],
}
