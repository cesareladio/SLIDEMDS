import type { TransitionType } from '../../data/presentationScenes'

export type ClosingSegmentId = 'chile' | 'peru' | 'pair' | 'identities' | 'team' | 'one' | 'ntt' | 'everywhere'

export interface ClosingSegment {
  id: ClosingSegmentId
  sceneId: `closing-${ClosingSegmentId}`
  target: number
  enter: readonly [number, number]
  hold: readonly [number, number]
  exit: readonly [number, number] | null
  label: string
  transitionType: TransitionType
}

/**
 * Single source of truth for Closing 21–28.
 * Every canonical target sits inside its segment's full-opacity hold.
 * The final segment intentionally has no exit and therefore holds through 1.0.
 */
export const CLOSING_SEGMENTS: readonly ClosingSegment[] = [
  { id: 'chile', sceneId: 'closing-chile', target: .12, enter: [.03, .075], hold: [.075, .18], exit: [.18, .215], label: 'CHILE', transitionType: 'cinematic' },
  { id: 'peru', sceneId: 'closing-peru', target: .27, enter: [.215, .245], hold: [.245, .33], exit: [.33, .365], label: 'PERÚ', transitionType: 'editorial' },
  { id: 'pair', sceneId: 'closing-pair', target: .42, enter: [.365, .395], hold: [.395, .47], exit: [.47, .505], label: 'PERÚ + CHILE', transitionType: 'editorial' },
  { id: 'identities', sceneId: 'closing-identities', target: .56, enter: [.505, .535], hold: [.535, .60], exit: [.60, .635], label: 'DOS IDENTIDADES', transitionType: 'poster' },
  { id: 'team', sceneId: 'closing-team', target: .69, enter: [.635, .665], hold: [.665, .73], exit: [.73, .765], label: 'UN SOLO EQUIPO', transitionType: 'poster' },
  { id: 'one', sceneId: 'closing-one', target: .82, enter: [.765, .795], hold: [.795, .85], exit: [.85, .875], label: 'ONE GDN-e', transitionType: 'cinematic' },
  { id: 'ntt', sceneId: 'closing-ntt', target: .92, enter: [.875, .90], hold: [.90, .94], exit: [.94, .955], label: 'NTT DATA', transitionType: 'poster' },
  { id: 'everywhere', sceneId: 'closing-everywhere', target: .985, enter: [.955, .975], hold: [.975, 1], exit: null, label: 'AI EVERYWHERE', transitionType: 'poster' },
] as const

export const CLOSING_SEGMENT_BY_ID = Object.fromEntries(CLOSING_SEGMENTS.map(segment => [segment.id, segment])) as Record<ClosingSegmentId, ClosingSegment>
