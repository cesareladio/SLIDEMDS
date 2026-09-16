import { useFrame, useThree } from '@react-three/fiber'
import type { CountryId } from '../../data/countryProfiles'
import type { ScrollChapter } from '../../app/ScrollContext'
import { sampleOpeningCameraProgress } from '../../data/earthJourney'
import { journeyLocalProgress } from '../../data/countryScroll'
import { sampleJourneyCameraProgress } from '../JourneyScrollFlight'
import { lerpNumber } from '../../utils/scrollMotion'

const countryFocusTargets: Record<CountryId, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  peru: { camera: [.05, -.35, 5.4], lookAt: [.15, -.45, 0] },
  chile: { camera: [.1, -.38, 5.2], lookAt: [.2, -.52, 0] },
}
const earthHubCamera: [number, number, number] = [0, -.1, 7.0]
const earthHubLookAt: [number, number, number] = [.5, -.85, 0]
const convergenceStartCamera: [number, number, number] = [0, -.1, 7.0]
const convergenceStartLookAt: [number, number, number] = [.5, -.85, 0]
const smoothstep = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t) }
const lerpTuple = (from: readonly number[], to: readonly number[], amount: number): [number, number, number] => [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount, from[2] + (to[2] - from[2]) * amount]

export function CameraRig({ selectedCountry = null, scrollChapter = 'opening', scrollProgress = 0 }: { scene: number; capabilityFocus?: unknown; ibiolPhase?: unknown; selectedCountry?: CountryId | null; scrollChapter?: ScrollChapter; scrollProgress?: number }) {
  const { camera } = useThree()

  useFrame(() => {
    const p = Math.min(1, Math.max(0, scrollProgress))

    if (scrollChapter === 'country' && selectedCountry) {
      const journeyProgress = journeyLocalProgress(selectedCountry, p)
      const countryTarget = countryFocusTargets[selectedCountry]
      const countryExitStart = selectedCountry === 'peru' ? .94 : .90
      const countryExit = smoothstep(Math.min(1, Math.max(0, (p - countryExitStart) / (1 - countryExitStart))))

      if (countryExit > 0) {
        const bridgeCamera = journeyProgress > .01 ? sampleJourneyCameraProgress(1).position : countryTarget.camera
        const bridgeTarget = journeyProgress > .01 ? sampleJourneyCameraProgress(1).target : countryTarget.lookAt
        camera.position.set(...lerpTuple(bridgeCamera, convergenceStartCamera, countryExit))
        camera.lookAt(...lerpTuple(bridgeTarget, convergenceStartLookAt, countryExit))
        return
      }

      const transitionEnd = .12
      if (journeyProgress <= transitionEnd) {
        const local = smoothstep(journeyProgress / transitionEnd)
        const journeyStart = sampleJourneyCameraProgress(0)
        camera.position.set(...lerpTuple(countryTarget.camera, journeyStart.position, local))
        camera.lookAt(...lerpTuple(countryTarget.lookAt, journeyStart.target, local))
      } else {
        const normalized = (journeyProgress - transitionEnd) / (1 - transitionEnd)
        const journey = sampleJourneyCameraProgress(normalized)
        camera.position.set(...journey.position)
        camera.lookAt(...journey.target)
      }
      return
    }

    if (scrollChapter === 'opening') {
      const { position, target } = sampleOpeningCameraProgress(p)
      camera.position.set(...position)
      camera.lookAt(...target)
      return
    }
    if (scrollChapter === 'earth') {
      camera.position.set(...earthHubCamera)
      camera.lookAt(...earthHubLookAt)
      return
    }
    if (scrollChapter === 'convergence') {
      camera.position.set(lerpNumber(0, 0, p), lerpNumber(-.1, .05, p), lerpNumber(7, 7.4, p))
      camera.lookAt(lerpNumber(.5, 0, p), lerpNumber(-.85, 0, p), 0)
      return
    }
    if (scrollChapter === 'ai') {
      camera.position.set(0, 0, lerpNumber(7.4, 7.9, p))
      camera.lookAt(0, 0, 0)
      return
    }
    if (scrollChapter === 'ibiol') {
      camera.position.set(0, lerpNumber(0, .12, p), lerpNumber(7.9, 8.2, p))
      camera.lookAt(0, 0, 0)
      return
    }
    if (scrollChapter === 'closing') {
      camera.position.set(0, lerpNumber(0, .08, p), lerpNumber(8.2, 9.2, p))
      camera.lookAt(0, 0, 0)
    }
  })
  return null
}
