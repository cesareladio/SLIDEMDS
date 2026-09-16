import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import type { CapabilityFocus } from '../../data/capabilityConstellation'
import type { IBIOLPhase } from '../../data/ibiol'
import type { CountryId } from '../../data/countryProfiles'
import type { ScrollChapter } from '../../app/ScrollContext'
import { journeyCameraPath, journeyWaypoints } from '../../data/journeyPath'
import { sampleOpeningCameraProgress } from '../../data/earthJourney'
import { journeyLocalProgress } from '../../data/countryScroll'
import { sampleJourneyCameraProgress } from '../JourneyScrollFlight'
import { lerpNumber } from '../../utils/scrollMotion'

const scenePositions: [number, number, number][] = [[0, .15, 8.5], [1.05, .1, 6.3], [.3, .2, 7.4], [0, 0, 7.1], [0, 0, 9.5], [-1.6, .1, 7.5], [0, -.2, 8.6], [0, .1, 8.2]]
const focusTargets: Record<Exclude<CapabilityFocus, 'overview'>, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  backend: { camera: [-1.55, .55, 4.8], lookAt: [-2.35, .8, .65] }, testing: { camera: [-.1, -.65, 4.65], lookAt: [-.5, -1.05, -1.05] }, sap: { camera: [1.05, .65, 4.8], lookAt: [1.65, .95, .35] },
}
const ibiolTargets: Record<IBIOLPhase, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  today: { camera: [0, .25, 7.3], lookAt: [0, 0, 0] }, grow: { camera: [0, .5, 8.8], lookAt: [0, .15, .25] }, ask: { camera: [0, .1, 6.2], lookAt: [0, 0, 0] },
}
const countryFocusTargets: Record<CountryId, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  peru: { camera: [.05, -.35, 5.4], lookAt: [.15, -.45, 0] }, chile: { camera: [.1, -.38, 5.2], lookAt: [.2, -.52, 0] },
}
const earthHubCamera: [number, number, number] = [0, -.1, 7.0]
const earthHubLookAt: [number, number, number] = [.5, -.85, 0]
const finiteVector = (vector: readonly number[]) => vector.length === 3 && vector.every(Number.isFinite) ? vector as [number, number, number] : [0, 0, 8.5] as [number, number, number]
const lerpTuple = (from: readonly number[], to: readonly number[], amount: number): [number, number, number] => [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount, from[2] + (to[2] - from[2]) * amount]
const smoothstep = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t) }

export function CameraRig({ scene, capabilityFocus = 'overview', ibiolPhase = 'today', selectedCountry = null, scrollChapter = 'opening', scrollProgress = 0 }: { scene: number; capabilityFocus?: CapabilityFocus; ibiolPhase?: IBIOLPhase; selectedCountry?: CountryId | null; scrollChapter?: ScrollChapter; scrollProgress?: number }) {
  const { camera } = useThree()
  const journeyStartedAt = useRef<number | null>(null)

  useEffect(() => {
    if (selectedCountry || scene === 5 || scrollChapter === 'opening' || scrollChapter === 'earth' || scrollChapter === 'country' || scrollChapter === 'convergence' || scrollChapter === 'ai') { journeyStartedAt.current = null; return }
    const target = scene === 6 ? ibiolTargets[ibiolPhase] : capabilityFocus === 'overview' || scene !== 3 ? { camera: scenePositions[scene] ?? scenePositions[0], lookAt: [0, 0, 0] as [number, number, number] } : focusTargets[capabilityFocus]
    const cameraTarget = finiteVector(target.camera)
    const lookAtTarget = finiteVector(target.lookAt)
    const tween = gsap.to(camera.position, { x: cameraTarget[0], y: cameraTarget[1], z: cameraTarget[2], duration: 1.8, ease: 'power3.inOut', onUpdate: () => camera.lookAt(...lookAtTarget) })
    return () => { tween.kill() }
  }, [camera, scene, capabilityFocus, ibiolPhase, selectedCountry, scrollChapter])

  useFrame(state => {
    if (scrollChapter === 'country' && selectedCountry) {
      const journeyProgress = journeyLocalProgress(selectedCountry, scrollProgress)
      const countryTarget = countryFocusTargets[selectedCountry]
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
    if (selectedCountry) return
    if (scrollChapter === 'opening') {
      const { position, target } = sampleOpeningCameraProgress(scrollProgress)
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
      const p = Math.min(1, Math.max(0, scrollProgress))
      camera.position.set(lerpNumber(0, 0, p), lerpNumber(-.1, .05, p), lerpNumber(7, 7.4, p))
      camera.lookAt(lerpNumber(.5, 0, p), lerpNumber(-.85, 0, p), 0)
      return
    }
    if (scrollChapter === 'ai') {
      const p = Math.min(1, Math.max(0, scrollProgress))
      camera.position.set(0, 0, lerpNumber(7.4, 7.9, p))
      camera.lookAt(0, 0, 0)
      return
    }
    if (scrollChapter === 'ibiol') {
      const p = Math.min(1, Math.max(0, scrollProgress))
      camera.position.set(0, lerpNumber(0, .12, p), lerpNumber(7.9, 8.2, p))
      camera.lookAt(0, 0, 0)
      return
    }
    if (scrollChapter === 'closing') {
      const p = Math.min(1, Math.max(0, scrollProgress))
      camera.position.set(0, lerpNumber(0, .08, p), lerpNumber(8.2, 9.2, p))
      camera.lookAt(0, 0, 0)
      return
    }
    if (scene !== 5) return
    if (journeyStartedAt.current === null) journeyStartedAt.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - journeyStartedAt.current
    const progress = Math.min(elapsed < 8 ? elapsed / 14 : .57 + (elapsed - 8) / 15, 1)
    const exact = progress * (journeyCameraPath.length - 1)
    const index = Math.min(Math.floor(exact), journeyCameraPath.length - 2)
    const mix = exact - index
    camera.position.lerpVectors(new THREE.Vector3(...finiteVector(journeyCameraPath[index])), new THREE.Vector3(...finiteVector(journeyCameraPath[index + 1])), mix)
    camera.lookAt(...finiteVector(journeyWaypoints[Math.min(index + 1, journeyWaypoints.length - 1)].position))
  })
  return null
}
