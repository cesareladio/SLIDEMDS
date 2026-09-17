import { useFrame, useThree } from '@react-three/fiber'
import type { ScrollChapter } from '../../app/ScrollContext'
import { sampleOpeningCameraProgress, openingLockedCameraComposition } from '../../data/earthJourney'
import { journeyLocalProgress } from '../../data/countryScroll'
import { sampleJourneyCameraProgress } from '../JourneyScrollFlight'
import { bridgeCameraComposition, convergenceStartCameraComposition } from '../../data/sequentialCountryChoreography'
import { lerpNumber } from '../../utils/scrollMotion'

const earthHubCamera: [number, number, number] = [0, -.1, 7.0]
const earthHubLookAt: [number, number, number] = [.5, -.85, 0]
const peruFocusCamera: [number, number, number] = [.05, -.35, 5.4]
const peruFocusLookAt: [number, number, number] = [.15, -.45, 0]
const chileFocusCamera: [number, number, number] = [.1, -.38, 5.2]
const chileFocusLookAt: [number, number, number] = [.2, -.52, 0]

const smoothstep = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t) }
const lerpTuple = (a: readonly number[], b: readonly number[], t: number): [number,number,number] =>
  [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]

export function CameraRig({ scrollChapter = 'opening', scrollProgress = 0 }: { scrollChapter?: ScrollChapter; scrollProgress?: number }) {
  const { camera } = useThree()

  useFrame(() => {
    const p = Math.min(1, Math.max(0, scrollProgress))

    // ---- OPENING ----
    if (scrollChapter === 'opening') {
      // Entire Scene 01 hold: locked frozen camera through end of chapter
      if (p >= 0.20) {
        const { position, target } = openingLockedCameraComposition
        camera.position.set(...position); camera.lookAt(...target); return
      }
      // Prelude entry (0–.20): continuous progression
      const { position, target } = sampleOpeningCameraProgress(p)
      camera.position.set(...position); camera.lookAt(...target); return
    }

    // ---- EARTH HUB ----
    // Blend from locked opening state to earth hub during 02→03 reframe
    if (scrollChapter === 'earth') {
      const reframeEnd = 0.82
      const blend = smoothstep(Math.min(1, p / reframeEnd))
      const { position: openingLocked, target: openingLockedTarget } = openingLockedCameraComposition
      camera.position.set(...lerpTuple(openingLocked, earthHubCamera, blend))
      camera.lookAt(...lerpTuple(openingLockedTarget, earthHubLookAt, blend))
      return
    }

    // ---- PERU ----
    if (scrollChapter === 'peru') {
      const jrProg = journeyLocalProgress('peru', p)
      const exitStart = .92
      const exit = smoothstep(Math.min(1, Math.max(0, (p - exitStart) / (1 - exitStart))))

      if (exit > 0) {
        // Peru exit: bridge to South America
        const journeyFinal = jrProg > .01 ? sampleJourneyCameraProgress(1).position : peruFocusCamera
        const journeyFinalTarget = jrProg > .01 ? sampleJourneyCameraProgress(1).target : peruFocusLookAt
        camera.position.set(...lerpTuple(journeyFinal, bridgeCameraComposition.camera, exit))
        camera.lookAt(...lerpTuple(journeyFinalTarget, bridgeCameraComposition.lookAt, exit))
        return
      }

      // Peru entry: Earth hub → Peru focus, then Journey
      const entryEnd = .12
      if (p <= entryEnd) {
        const local = smoothstep(p / entryEnd)
        camera.position.set(...lerpTuple(earthHubCamera, peruFocusCamera, local))
        camera.lookAt(...lerpTuple(earthHubLookAt, peruFocusLookAt, local))
        return
      }

      // Peru superpowers/journey camera
      if (jrProg <= .12) {
        const local = smoothstep(jrProg / .12)
        const journeyStart = sampleJourneyCameraProgress(0)
        camera.position.set(...lerpTuple(peruFocusCamera, journeyStart.position, local))
        camera.lookAt(...lerpTuple(peruFocusLookAt, journeyStart.target, local))
      } else {
        const { position, target } = sampleJourneyCameraProgress((jrProg - .12) / .88)
        camera.position.set(...position); camera.lookAt(...target)
      }
      return
    }

    // ---- CHILE ----
    if (scrollChapter === 'chile') {
      const entryEnd = .16
      const exitStart = .88
      const exitP = smoothstep(Math.min(1, Math.max(0, (p - exitStart) / (1 - exitStart))))

      if (exitP > 0) {
        // Chile exit → Convergence
        camera.position.set(...lerpTuple(chileFocusCamera, convergenceStartCameraComposition.camera, exitP))
        camera.lookAt(...lerpTuple(chileFocusLookAt, convergenceStartCameraComposition.lookAt, exitP))
        return
      }

      const entryP = smoothstep(Math.min(1, p / entryEnd))
      // Chile entry: South America bridge → Chile focus
      camera.position.set(...lerpTuple(bridgeCameraComposition.camera, chileFocusCamera, entryP))
      camera.lookAt(...lerpTuple(bridgeCameraComposition.lookAt, chileFocusLookAt, entryP))
      return
    }

    // ---- CONVERGENCE ----
    if (scrollChapter === 'convergence') {
      camera.position.set(lerpNumber(0, 0, p), lerpNumber(-.1, .05, p), lerpNumber(7, 7.4, p))
      camera.lookAt(lerpNumber(.5, 0, p), lerpNumber(-.85, 0, p), 0)
      return
    }

    if (scrollChapter === 'ai') {
      camera.position.set(0, 0, lerpNumber(7.4, 7.9, p)); camera.lookAt(0,0,0); return
    }
    if (scrollChapter === 'ibiol') {
      camera.position.set(0, lerpNumber(0,.12,p), lerpNumber(7.9,8.2,p)); camera.lookAt(0,0,0); return
    }
    if (scrollChapter === 'closing') {
      camera.position.set(0, lerpNumber(0,.08,p), lerpNumber(8.2,9.2,p)); camera.lookAt(0,0,0)
    }
  })
  return null
}
