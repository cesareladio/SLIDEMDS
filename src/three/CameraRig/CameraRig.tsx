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

const scenePositions: [number, number, number][] = [
  [0, .15, 8.5], [1.05, .1, 6.3], [.3, .2, 7.4], [0, 0, 7.1], [0, 0, 9.5], [-1.6, .1, 7.5], [0, -.2, 8.6], [0, .1, 8.2],
]
const focusTargets: Record<Exclude<CapabilityFocus, 'overview'>, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  backend: { camera: [-1.55, .55, 4.8], lookAt: [-2.35, .8, .65] }, testing: { camera: [-.1, -.65, 4.65], lookAt: [-.5, -1.05, -1.05] }, sap: { camera: [1.05, .65, 4.8], lookAt: [1.65, .95, .35] },
}
const ibiolTargets: Record<IBIOLPhase, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  today: { camera: [0, .25, 7.3], lookAt: [0, 0, 0] }, grow: { camera: [0, .5, 8.8], lookAt: [0, .15, .25] }, ask: { camera: [0, .1, 6.2], lookAt: [0, 0, 0] },
}
const countryFocusTargets: Record<CountryId, { camera: [number, number, number]; lookAt: [number, number, number] }> = {
  peru:  { camera: [.05, -.35, 5.4], lookAt: [.15, -.45, 0] },
  chile: { camera: [.1,  -.38, 5.2], lookAt: [.2,  -.52, 0] },
}
const earthHubCamera: [number, number, number] = [0, -.1, 7.0]
const earthHubLookAt: [number, number, number] = [.5, -.85, 0]

function finiteVector(vector: readonly number[]) { return vector.length === 3 && vector.every(Number.isFinite) ? vector as [number, number, number] : [0, 0, 8.5] as [number, number, number] }

export function CameraRig({
  scene, capabilityFocus = 'overview', ibiolPhase = 'today', selectedCountry = null, scrollChapter = 'opening', scrollProgress = 0,
}: {
  scene: number; capabilityFocus?: CapabilityFocus; ibiolPhase?: IBIOLPhase; selectedCountry?: CountryId | null; scrollChapter?: ScrollChapter; scrollProgress?: number
}) {
  const { camera } = useThree()
  const journeyStartedAt = useRef<number | null>(null)
  const countryLookAt    = useRef(new THREE.Vector3())

  useEffect(() => {
    // Opening and earth-hub are handled per-frame from scroll — no GSAP tween needed
    if (selectedCountry || scene === 5 || scrollChapter === 'opening' || scrollChapter === 'earth') {
      journeyStartedAt.current = null
      return
    }
    const target =
      scene === 6 ? ibiolTargets[ibiolPhase]
      : capabilityFocus === 'overview' || scene !== 3 ? { camera: scenePositions[scene] ?? scenePositions[0], lookAt: [0, 0, 0] as [number, number, number] }
      : focusTargets[capabilityFocus]
    const cameraTarget = finiteVector(target.camera)
    const lookAtTarget = finiteVector(target.lookAt)
    const tween = gsap.to(camera.position, { x: cameraTarget[0], y: cameraTarget[1], z: cameraTarget[2], duration: 1.8, ease: 'power3.inOut', onUpdate: () => camera.lookAt(...lookAtTarget) })
    return () => { tween.kill() }
  }, [camera, scene, capabilityFocus, ibiolPhase, selectedCountry, scrollChapter])

  useFrame(state => {
    // 1 — Country Focus has highest priority
    if (selectedCountry) {
      const target = countryFocusTargets[selectedCountry]
      countryLookAt.current.set(...target.lookAt)
      camera.position.lerp(new THREE.Vector3(...target.camera), 1 - Math.exp(-5.4 * state.clock.getDelta()))
      camera.lookAt(countryLookAt.current)
      return
    }

    // 2 — Scroll-driven Opening camera
    if (scrollChapter === 'opening') {
      const { position, target } = sampleOpeningCameraProgress(scrollProgress)
      camera.position.set(...position)
      camera.lookAt(...target)
      return
    }

    // 3 — Earth Hub: stable camera
    if (scrollChapter === 'earth') {
      const p = new THREE.Vector3(...earthHubCamera)
      camera.position.lerp(p, 1 - Math.exp(-3.5 * state.clock.getDelta()))
      camera.lookAt(...earthHubLookAt)
      return
    }

    // 4 — Journey
    if (scene !== 5) return
    if (journeyStartedAt.current === null) journeyStartedAt.current = state.clock.elapsedTime
    const elapsed  = state.clock.elapsedTime - journeyStartedAt.current
    const progress = Math.min(elapsed < 8 ? elapsed / 14 : .57 + (elapsed - 8) / 15, 1)
    const exact    = progress * (journeyCameraPath.length - 1)
    const index    = Math.min(Math.floor(exact), journeyCameraPath.length - 2)
    const mix      = exact - index
    const from     = finiteVector(journeyCameraPath[index])
    const to       = finiteVector(journeyCameraPath[index + 1])
    camera.position.lerpVectors(new THREE.Vector3(...from), new THREE.Vector3(...to), mix)
    camera.lookAt(...finiteVector(journeyWaypoints[Math.min(index + 1, journeyWaypoints.length - 1)].position))
  })
  return null
}
