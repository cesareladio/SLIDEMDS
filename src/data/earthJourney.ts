import * as THREE from 'three'

export type EarthChoreographyPhase = 'hero' | 'shift' | 'focus' | 'settle'

interface EarthKeyframe {
  progress: number
  position: [number, number, number]
  scale: number
  phase: EarthChoreographyPhase
}

function finiteVector(vector: readonly number[]): [number, number, number] {
  return vector.length === 3 && vector.every(Number.isFinite) ? vector as [number, number, number] : [0, 0, 0]
}

function smoothstep(t: number) { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

const progressKeyframes: EarthKeyframe[] = [
  { progress: 0.00, position: [.55, -1.25, 0], scale: 1.35, phase: 'hero' },
  { progress: 0.27, position: [.45, -1.38, 0], scale: 1.32, phase: 'hero' },
  { progress: 0.50, position: [.15, -1.50, 0], scale: 1.12, phase: 'shift' },
  { progress: 0.73, position: [.95, -1.30, 0], scale:  .96, phase: 'focus' },
  { progress: 1.00, position: [1.45,-1.00, 0], scale:  .92, phase: 'settle' },
]

export function sampleEarthChoreographyProgress(progress: number) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0))
  let index = 0
  while (index < progressKeyframes.length - 2 && progressKeyframes[index + 1].progress <= p) index++
  const from = progressKeyframes[index]
  const to   = progressKeyframes[index + 1]
  const span = Math.max(to.progress - from.progress, 1e-5)
  const mix  = smoothstep((p - from.progress) / span)
  const position = finiteVector(from.position.map((v, i) => v + (to.position[i] - v) * mix))
  const scale = from.scale + (to.scale - from.scale) * mix
  return { position, scale: Number.isFinite(scale) ? scale : 1, phase: mix >= 0.5 ? to.phase : from.phase }
}

// --- legacy time-based API kept for non-opening scenes ---
export type { EarthChoreographyPhase as _LegacyPhase }

export const footprintComposition = { position: [1.45, -1.0, 0] as [number, number, number], scale: .76 }
export const closingComposition   = { position: [1.2, -.75, 0]  as [number, number, number], scale: .82 }

// --- camera: pure progress functions ---
const cameraPositionPoints = [
  new THREE.Vector3(0,   .12, 7.6),
  new THREE.Vector3(-.08, .05, 7.35),
  new THREE.Vector3(-.05,-.02, 7.05),
  new THREE.Vector3(.05,  .02, 6.85),
  new THREE.Vector3(0,   .05, 6.7),
]
const cameraTargetPoints = [
  new THREE.Vector3(.5,  -.6,  0),
  new THREE.Vector3(.35, -.65, 0),
  new THREE.Vector3(.15, -.7,  0),
  new THREE.Vector3(.4,  -.55, 0),
  new THREE.Vector3(.55, -.4,  0),
]
const cameraPositionCurve = new THREE.CatmullRomCurve3(cameraPositionPoints, false, 'catmullrom', .5)
const cameraTargetCurve   = new THREE.CatmullRomCurve3(cameraTargetPoints,   false, 'catmullrom', .5)

function finiteTuple(v: THREE.Vector3): [number, number, number] {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z) ? [v.x, v.y, v.z] : [0, 0, 7]
}

export function sampleOpeningCameraProgress(progress: number) {
  const eased = smoothstep(Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)))
  return {
    position: finiteTuple(cameraPositionCurve.getPoint(eased)),
    target:   finiteTuple(cameraTargetCurve.getPoint(eased)),
  }
}

// --- earth chapter hub composition ---
export const earthHubComposition = { position: [.5, -.85, 0] as [number, number, number], scale: 1.0 }
