export type CountryId = 'peru' | 'chile'

export interface Hub { name: string; people: number; lat: number; lon: number }
export interface Distribution { label: string; percent: number; people?: number }
export interface Capability { id: string; label: string; value: number; details?: { label: string; value: number }[] }
export interface CountryData {
  id: CountryId
  name: string
  total: number
  isMock?: boolean
  hubs?: Hub[]
  distribution?: Distribution[]
  operationalHubs?: Hub[]
  territorialDistribution?: Distribution[]
  capabilities: Capability[]
}
