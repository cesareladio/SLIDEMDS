import peruGeo from './geo/peru.geo.json'
import chileGeo from './geo/chile.geo.json'
import type { CountryId } from './countryProfiles'

export type GeoCoordinate = [number, number]

interface PolygonGeometry { type: 'Polygon'; coordinates: GeoCoordinate[][] }
interface GeoFeature { type: 'Feature'; properties: { name: string }; geometry: PolygonGeometry }

export const countryGeo: Record<CountryId, GeoFeature> = {
  peru: peruGeo as GeoFeature,
  chile: chileGeo as GeoFeature,
}

export function countryPolygon(country: CountryId) {
  return countryGeo[country].geometry.coordinates[0]
}
