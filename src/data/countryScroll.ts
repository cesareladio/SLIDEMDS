import type { CountryId } from './countryProfiles'
import { rangeProgress, fadeWindow } from '../utils/scrollMotion'

export interface CountryScrollSegment {
  id: string
  start: number
  end: number
}

const peruSegments: CountryScrollSegment[] = [
  { id: 'geo-focus',   start: 0.00, end: 0.14 },
  { id: 'overview',    start: 0.14, end: 0.34 },
  { id: 'talent',      start: 0.34, end: 0.52 },
  { id: 'superpowers', start: 0.52, end: 0.72 },
  { id: 'journey',     start: 0.72, end: 0.94 },
  { id: 'exit',        start: 0.94, end: 1.00 },
]

const chileSegments: CountryScrollSegment[] = [
  { id: 'geo-focus',   start: 0.00, end: 0.24 },
  { id: 'overview',    start: 0.24, end: 0.58 },
  { id: 'superpowers', start: 0.58, end: 0.90 },
  { id: 'exit',        start: 0.90, end: 1.00 },
]

export const countryScrollSegments: Record<CountryId, CountryScrollSegment[]> = {
  peru: peruSegments,
  chile: chileSegments,
}

export function getCountrySegments(country: CountryId) {
  return countryScrollSegments[country]
}

export function getSegmentProgress(country: CountryId, segmentId: string, globalProgress: number) {
  const segments = countryScrollSegments[country]
  const seg = segments.find(s => s.id === segmentId)
  if (!seg) return 0
  return rangeProgress(globalProgress, seg.start, seg.end)
}

export function getActiveSegment(country: CountryId, globalProgress: number): CountryScrollSegment {
  const segments = countryScrollSegments[country]
  for (let i = segments.length - 1; i >= 0; i--) {
    if (globalProgress >= segments[i].start) return segments[i]
  }
  return segments[0]
}

export function segmentFadeOpacity(
  country: CountryId,
  segmentId: string,
  globalProgress: number,
  fadePad = 0.04
): number {
  const segments = countryScrollSegments[country]
  const seg = segments.find(s => s.id === segmentId)
  if (!seg) return 0
  return fadeWindow(globalProgress, seg.start, seg.start + fadePad, seg.end - fadePad, seg.end)
}

export function journeyLocalProgress(country: CountryId, globalProgress: number): number {
  return getSegmentProgress(country, 'journey', globalProgress)
}
