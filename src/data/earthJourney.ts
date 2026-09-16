export type EarthJourneyPhase = 'space' | 'reveal' | 'southAmerica' | 'peru'

export interface EarthJourneyKeyframe {
  time: number
  position: [number, number, number]
  target: [number, number, number]
  phase: EarthJourneyPhase
}

function finiteVector(vector: readonly number[]): [number, number, number] {
  return vector.length === 3 && vector.every(Number.isFinite) ? vector as [number, number, number] : [0, 0, 8.5]
}

export const earthJourneyKeyframes: EarthJourneyKeyframe[] = [
  { time: 0, position: [.4, .6, 27], target: [0, 0, 0], phase: 'space' },
  { time: 2.2, position: [.3, .35, 15.5], target: [0, 0, 0], phase: 'space' },
  { time: 5, position: [-.5, -.15, 10.2], target: [-.6, -.65, 1.4], phase: 'reveal' },
  { time: 7.4, position: [-.05, -.35, 8.35], target: [-.85, -.95, 1.8], phase: 'southAmerica' },
  { time: 10.2, position: [.55, -.2, 6.9], target: [-.5, -.75, 2.1], phase: 'peru' },
  { time: 13, position: [1.05, .1, 6.3], target: [0, 0, 0], phase: 'peru' },
]

export const earthJourneyDuration = earthJourneyKeyframes[earthJourneyKeyframes.length - 1].time

export function sampleEarthJourney(elapsed: number) {
  const clamped = Math.min(Math.max(elapsed, 0), earthJourneyDuration)
  let index = 0
  while (index < earthJourneyKeyframes.length - 2 && earthJourneyKeyframes[index + 1].time <= clamped) index++
  const from = earthJourneyKeyframes[index]
  const to = earthJourneyKeyframes[index + 1]
  const span = Math.max(to.time - from.time, 0.0001)
  const rawMix = (clamped - from.time) / span
  const mix = rawMix * rawMix * (3 - 2 * rawMix)
  const position = finiteVector(from.position.map((value, axis) => value + (to.position[axis] - value) * mix))
  const target = finiteVector(from.target.map((value, axis) => value + (to.target[axis] - value) * mix))
  return { position, target, phase: to.phase }
}
