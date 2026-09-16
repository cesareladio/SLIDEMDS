import * as THREE from 'three'

export type EarthChoreographyPhase = 'hero' | 'shift' | 'focus' | 'settle'

interface EarthKeyframe {
  time: number
  position: [number, number, number]
  scale: number
  phase: EarthChoreographyPhase
}

const keyframes: EarthKeyframe[] = [
  { time: 0, position: [.85, -1.05, 0], scale: 1.16, phase: 'hero' },
  { time: 3, position: [.65, -1.2, 0], scale: 1.12, phase: 'hero' },
  { time: 5.5, position: [.25, -1.35, 0], scale: 1.02, phase: 'shift' },
  { time: 8, position: [1.05, -1.15, 0], scale: .95, phase: 'focus' },
  { time: 11, position: [1.35, -.95, 0], scale: .92, phase: 'settle' },
]

export const earthChoreographyDuration = keyframes[keyframes.length - 1].time

function finiteVector(vector: readonly number[]): [number, number, number] {
  return vector.length === 3 && vector.every(Number.isFinite) ? vector as [number, number, number] : [0, 0, 0]
}

export function sampleEarthChoreography(elapsed: number) {
  const clamped = Math.min(Math.max(elapsed, 0), earthChoreographyDuration)
  let index = 0
  while (index < keyframes.length - 2 && keyframes[index + 1].time <= clamped) index++
  const from = keyframes[index]
  const to = keyframes[index + 1]
  const span = Math.max(to.time - from.time, .0001)
  const raw = (clamped - from.time) / span
  const mix = raw * raw * (3 - 2 * raw)
  const position = finiteVector(from.position.map((value, axis) => value + (to.position[axis] - value) * mix))
  const rawScale = from.scale + (to.scale - from.scale) * mix
  const scale = Number.isFinite(rawScale) ? rawScale : 1
  return { position, scale, phase: to.phase }
}

export const footprintComposition = { position: [1.35, -.95, 0] as [number, number, number], scale: .92 }
export const closingComposition = { position: [1.1, -.7, 0] as [number, number, number], scale: .9 }

const cameraPositionPoints = [
  new THREE.Vector3(0, .12, 7.6),
  new THREE.Vector3(-.08, .05, 7.35),
  new THREE.Vector3(-.05, -.02, 7.05),
  new THREE.Vector3(.05, .02, 6.85),
  new THREE.Vector3(0, .05, 6.7),
]
const cameraTargetPoints = [
  new THREE.Vector3(.5, -.6, 0),
  new THREE.Vector3(.35, -.65, 0),
  new THREE.Vector3(.15, -.7, 0),
  new THREE.Vector3(.4, -.55, 0),
  new THREE.Vector3(.55, -.4, 0),
]
const cameraPositionCurve = new THREE.CatmullRomCurve3(cameraPositionPoints, false, 'catmullrom', .5)
const cameraTargetCurve = new THREE.CatmullRomCurve3(cameraTargetPoints, false, 'catmullrom', .5)

function finiteTuple(vector: THREE.Vector3): [number, number, number] {
  return Number.isFinite(vector.x) && Number.isFinite(vector.y) && Number.isFinite(vector.z) ? [vector.x, vector.y, vector.z] : [0, 0, 7]
}

export function sampleOpeningCamera(elapsed: number) {
  const t = Math.min(Math.max(elapsed / earthChoreographyDuration, 0), 1)
  const eased = t * t * (3 - 2 * t)
  const position = finiteTuple(cameraPositionCurve.getPoint(eased))
  const target = finiteTuple(cameraTargetCurve.getPoint(eased))
  return { position, target }
}
