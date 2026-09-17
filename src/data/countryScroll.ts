import type { CountryId } from './countryProfiles'
import type { ScrollChapter } from '../app/ScrollContext'
import { rangeProgress, fadeWindow } from '../utils/scrollMotion'

export interface CountryScrollSegment {
  id: string
  start: number
  end: number
}

/** Peru now owns its own dedicated ScrollChapter — these boundaries are
 * relative to that chapter's own chapterProgress (0..1). */
const peruSegments: CountryScrollSegment[] = [
  { id: 'geo-focus',   start: 0.00, end: 0.14 },
  { id: 'overview',    start: 0.14, end: 0.34 },
  { id: 'talent',      start: 0.34, end: 0.52 },
  { id: 'superpowers', start: 0.52, end: 0.72 },
  { id: 'journey',     start: 0.72, end: 0.92 },
  { id: 'exit',        start: 0.92, end: 1.00 },
]

/** Chile's own dedicated ScrollChapter — 6 canonical scenes.
 * Each segment boundary is designed so canonical landing targets fall in HOLD, not transition.
 * Canonical targets: .10 (scale), .24 (footprint), .40 (talent), .56 (capabilities), .72 (certifications), .91 (history)
 */
const chileSegments: CountryScrollSegment[] = [
  { id: 'geo-focus',      start: 0.00, end: 0.15 },  // Entry into scale, canonical lands at .10
  { id: 'overview',       start: 0.15, end: 0.32 },  // Scale hold, exit transition; footprint entry, canonical lands at .24
  { id: 'talent',         start: 0.32, end: 0.48 },  // Footprint transition out, talent entry; canonical lands at .40
  { id: 'superpowers',    start: 0.48, end: 0.64 },  // Talent transition out, capabilities entry; canonical lands at .56
  { id: 'certifications', start: 0.64, end: 0.80 },  // Capabilities transition out, certifications entry; canonical lands at .72
  { id: 'journey',        start: 0.80, end: 1.00 },  // Certifications transition out, history entry; canonical lands at .91
]

export const countryScrollSegments: Record<CountryId, CountryScrollSegment[]> = {
  peru: peruSegments,
  chile: chileSegments,
}

/** Derives the active country directly from the current ScrollChapter —
 * this replaces the legacy selectedCountry click-driven state for the
 * main sequential presentation path. */
export function countryFromChapter(chapter: ScrollChapter): CountryId | null {
  if (chapter === 'peru') return 'peru'
  if (chapter === 'chile') return 'chile'
  return null
}

export function getCountrySegments(country: CountryId) {
  return countryScrollSegments[country]
}

export function getSegmentProgress(country: CountryId, segmentId: string, chapterProgress: number) {
  const segments = countryScrollSegments[country]
  const seg = segments.find(s => s.id === segmentId)
  if (!seg) return 0
  return rangeProgress(chapterProgress, seg.start, seg.end)
}

export function getActiveSegment(country: CountryId, chapterProgress: number): CountryScrollSegment {
  const segments = countryScrollSegments[country]
  for (let i = segments.length - 1; i >= 0; i--) {
    if (chapterProgress >= segments[i].start) return segments[i]
  }
  return segments[0]
}

export function segmentFadeOpacity(
  country: CountryId,
  segmentId: string,
  chapterProgress: number,
  fadePad = 0.04
): number {
  const segments = countryScrollSegments[country]
  const seg = segments.find(s => s.id === segmentId)
  if (!seg) return 0
  return fadeWindow(chapterProgress, seg.start, seg.start + fadePad, seg.end - fadePad, seg.end)
}

export function journeyLocalProgress(country: CountryId, chapterProgress: number): number {
  return getSegmentProgress(country, 'journey', chapterProgress)
}
