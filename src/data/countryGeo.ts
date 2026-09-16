/**
 * Country geometry sources
 *
 * peru.geo.json / chile.geo.json are sourced from:
 *   johan/world.geo.json (https://github.com/johan/world.geo.json)
 *   ISO3: PER.geo.json, CHL.geo.json
 *   Derived from Natural Earth admin-0 country boundaries (public domain).
 *
 * These are FeatureCollection wrappers around a single country Feature.
 * Chile is a MultiPolygon (mainland + islands + southern archipelago);
 * Peru is a single Polygon. Both are consumed through getCountryRings()
 * so every consumer (CountryMap, CountrySurfaceHighlight,
 * ClosingCountrySilhouette) renders identical geometry.
 */
import peruGeo from './geo/peru.geo.json'
import chileGeo from './geo/chile.geo.json'
import type { CountryId } from './countryProfiles'

export type GeoCoordinate = [number, number]
export type GeoRing = GeoCoordinate[]

interface PolygonGeometry { type: 'Polygon'; coordinates: GeoCoordinate[][] }
interface MultiPolygonGeometry { type: 'MultiPolygon'; coordinates: GeoCoordinate[][][] }
type CountryGeometry = PolygonGeometry | MultiPolygonGeometry
interface GeoFeature { type: 'Feature'; properties: { name: string }; geometry: CountryGeometry }
interface GeoFeatureCollection { type: 'FeatureCollection'; features: GeoFeature[] }

const rawGeo: Record<CountryId, GeoFeatureCollection> = {
  peru: peruGeo as unknown as GeoFeatureCollection,
  chile: chileGeo as unknown as GeoFeatureCollection,
}

function feature(country: CountryId): GeoFeature {
  return rawGeo[country].features[0]
}

/** Returns every closed ring (outer boundaries) for a country, flattening MultiPolygon. */
export function getCountryRings(country: CountryId): GeoRing[] {
  const geometry = feature(country).geometry
  if (geometry.type === 'Polygon') return geometry.coordinates
  return geometry.coordinates.flat()
}

/** Returns the largest ring by point span — used where a single silhouette is required. */
export function getPrimaryCountryRing(country: CountryId): GeoRing {
  const rings = getCountryRings(country)
  return rings.reduce((largest, ring) => (ring.length > largest.length ? ring : largest), rings[0])
}

/** Legacy single-polygon accessor kept for callers that only need the primary ring. */
export function countryPolygon(country: CountryId): GeoRing {
  return getPrimaryCountryRing(country)
}
