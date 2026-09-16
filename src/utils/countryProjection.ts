import { getCountryRings } from '../data/countryGeo'
import type { CountryId } from '../data/countryProfiles'

export interface ProjectedPoint { x: number; y: number }

export interface CountryProjection {
  /** Projects a real lat/lon into the same viewBox space used for the country polygon. */
  project: (lat: number, lon: number) => ProjectedPoint
  /** Combined SVG path data across every ring (handles MultiPolygon countries like Chile). */
  ringsPath: string
}

/**
 * Single shared equirectangular-with-latitude-correction projection.
 *
 * projectedX = lon * cos(centerLatitude)
 * projectedY = -lat
 *
 * A single uniform scale (min of width/height fit) preserves the real
 * aspect ratio of the country — this is what keeps Chile tall/narrow and
 * Peru naturally proportioned instead of stretching to fill a square.
 *
 * Every consumer (CountryMap, ClosingCountrySilhouette, and indirectly
 * CountrySurfaceHighlight via getCountryRings) must go through this same
 * helper so pins/hubs/labels always land inside the drawn silhouette.
 */
export function projectCountryToViewBox(country: CountryId, width = 100, height = 100, padding = 8): CountryProjection {
  const rings = getCountryRings(country)
  const flatPoints = rings.flat()
  const centerLat = flatPoints.reduce((sum, [, lat]) => sum + lat, 0) / flatPoints.length
  const cosLat = Math.cos(centerLat * Math.PI / 180)

  const projectedRings = rings.map(ring => ring.map(([lon, lat]) => ({ x: lon * cosLat, y: -lat })))
  const flatProjected = projectedRings.flat()
  const minX = Math.min(...flatProjected.map(point => point.x))
  const maxX = Math.max(...flatProjected.map(point => point.x))
  const minY = Math.min(...flatProjected.map(point => point.y))
  const maxY = Math.max(...flatProjected.map(point => point.y))
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const availableW = width - padding * 2
  const availableH = height - padding * 2
  const scale = Math.min(availableW / spanX, availableH / spanY)
  const offsetX = width / 2 - (minX + spanX / 2) * scale
  const offsetY = height / 2 - (minY + spanY / 2) * scale

  const project = (lat: number, lon: number): ProjectedPoint => ({
    x: lon * cosLat * scale + offsetX,
    y: -lat * scale + offsetY,
  })

  const ringsPath = projectedRings
    .map(ring => ring.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x * scale + offsetX} ${point.y * scale + offsetY}`).join(' ') + ' Z')
    .join(' ')

  return { project, ringsPath }
}
