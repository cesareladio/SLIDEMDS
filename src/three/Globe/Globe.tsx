import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { OrbitArcs } from './OrbitArcs'
import { CountrySurfaceHighlight } from './CountrySurfaceHighlight'
import { PeruTerritorialAnchors } from './PeruTerritorialAnchors'
import { PeruGeoAnchors3D, type PeruGeoAnchorSpec } from './PeruGeoAnchors3D'
import { ChileGeoAnchors3D, type ChileGeoAnchorSpec } from './ChileGeoAnchors3D'
import { latLonToVector3, southAmericaOutline, geoAnchors, getGlobeOrientationForLatLon } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import { sampleEarthChoreographyProgress, earthHubComposition, openingLockedEarthComposition } from '../../data/earthJourney'
import { bridgeEarthComposition, convergenceStartEarthComposition } from '../../data/sequentialCountryChoreography'
import { countryFromChapter, segmentFadeOpacity } from '../../data/countryScroll'
import { openingPreludeState } from '../../data/openingPreludeState'
import type { ScrollChapter } from '../../app/ScrollContext'
import { fadeWindow, lerpNumber, rangeProgress } from '../../utils/scrollMotion'

const countryOrientations = { peru: { lat: -10, lon: -75 }, chile: { lat: -33, lon: -71 } } as const
const countryCompositions = {
  peru: { position: [.15, -.45, 0] as [number,number,number], scale: 1.28 },
  chile: { position: [.2, -.52, 0] as [number,number,number], scale: 1.22 },
} as const
const smoothstep = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t) }

// Prelude: Spain (lat 40, lon -3) → South America (lat -17, lon -60)
// Non-navigable — runs once when first landing on opening chapter
const SPAIN_LAT = 40; const SPAIN_LON = -3
const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Geographic anchor dots — no text labels during earth-hub
function AnchorDot({ point, color = '#bdf3ff' }: { point: THREE.Vector3; color?: string }) {
  return <mesh position={point}><sphereGeometry args={[.018, 10, 10]} /><meshBasicMaterial color={color} transparent opacity={.82} toneMapped={false} /></mesh>
}

// Scene 03 — operational hubs (real lat/lon)
const SCENE03_GEO_ANCHORS: PeruGeoAnchorSpec[] = [
  { id: 'trujillo-hub', label: 'Trujillo', lat: -8.1116, lon: -79.0287, value: 1048, tag: 'HUB OPERATIVO', isTop3: true },
  { id: 'arequipa-hub', label: 'Arequipa', lat: -16.4090, lon: -71.5375, value: 360, tag: 'HUB OPERATIVO', isTop3: true },
]

// Scene 04 — territorial distribution (real lat/lon)
const SCENE04_GEO_ANCHORS: PeruGeoAnchorSpec[] = [
  { id: 'piura', label: 'Piura', lat: -5.1945, lon: -80.6328, value: 91, isTop3: false },
  { id: 'lambayeque', label: 'Lambayeque', lat: -6.7714, lon: -79.8409, value: 103, isTop3: false },
  { id: 'la-libertad', label: 'La Libertad', lat: -8.1116, lon: -79.0287, value: 509, isTop3: true },
  { id: 'lima', label: 'Lima', lat: -12.0464, lon: -77.0428, value: 192, isTop3: true },
  { id: 'ica', label: 'Ica', lat: -14.0678, lon: -75.7286, value: 62, isTop3: false },
  { id: 'arequipa', label: 'Arequipa', lat: -16.4090, lon: -71.5375, value: 210, isTop3: true },
]

// Scene 08 — Chile operational hubs (real lat/lon)
const SCENE08_GEO_ANCHORS: ChileGeoAnchorSpec[] = [
  { id: 'temuco-hub', label: 'Temuco', lat: -38.7414, lon: -72.5883, value: 281, tag: 'HUB OPERATIVO', isTop3: true },
  { id: 'concepcion-hub', label: 'Concepción', lat: -36.8267, lon: -73.0502, value: 87, tag: 'HUB OPERATIVO', isTop3: true },
]

// Scene 09 — Chile territorial distribution (real lat/lon)
const SCENE09_GEO_ANCHORS: ChileGeoAnchorSpec[] = [
  { id: 'la-araucania', label: 'La Araucanía', lat: -38.7414, lon: -72.5883, value: 281, isTop3: true },
  { id: 'biobio', label: 'Biobío', lat: -36.8267, lon: -73.0502, value: 87, isTop3: true },
  { id: 'metropolitana', label: 'Metropolitana', lat: -33.4489, lon: -70.6693, value: 33, isTop3: false },
  { id: 'maule', label: 'Maule', lat: -35.4201, lon: -71.5495, value: 29, isTop3: false },
  { id: 'los-rios', label: 'Los Ríos', lat: -39.8018, lon: -73.2512, value: 20, isTop3: false },
  { id: 'los-lagos', label: 'Los Lagos', lat: -41.4735, lon: -72.3088, value: 16, isTop3: false },
  { id: 'coquimbo', label: 'Coquimbo', lat: -29.9597, lon: -71.3303, value: 14, isTop3: false },
  { id: 'nable', label: 'Ñuble', lat: -36.3114, lon: -71.9405, value: 12, isTop3: false },
]

export function Globe({ scrollChapter = 'opening', scrollProgress = 0, activeSceneIndex = -1 }: { scrollChapter?: ScrollChapter; scrollProgress?: number; activeSceneIndex?: number }) {
  const { textures, failed } = useEarthTextures()
  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(geoAnchors.peru.lat, geoAnchors.peru.lon, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])
  const southAmericaQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon), [])
  const peruQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat, countryOrientations.peru.lon), [])
  const chileQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])
  const spainQ = useMemo(() => getGlobeOrientationForLatLon(SPAIN_LAT, SPAIN_LON), [])

  // Prelude state — runs ONCE on mount, then latches
  const prelStartedAt = useRef<number | null>(null)
  const prelDone = useRef(prefersReduced)
  const prelQuaternion = useRef(prefersReduced ? peruChileQ.clone() : spainQ.clone())
  const orientationGroupRef = useRef<THREE.Group>(null)

  useFrame(state => {
    if (scrollChapter !== 'opening' || prelDone.current || prefersReduced) return
    if (prelStartedAt.current === null) prelStartedAt.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - prelStartedAt.current
    const duration = 2.7
    const t = smoothstep(Math.min(1, elapsed / duration))
    openingPreludeState.progress = t  // Track prelude progress globally
    prelQuaternion.current.slerpQuaternions(spainQ, peruChileQ, t)
    if (orientationGroupRef.current) orientationGroupRef.current.quaternion.copy(prelQuaternion.current)
    if (t >= 1) {
      prelDone.current = true
      openingPreludeState.done = true
    }
  })

  const p = Number.isFinite(scrollProgress) ? Math.min(1, Math.max(0, scrollProgress)) : 0
  const activeCountry = countryFromChapter(scrollChapter)
  const isPeru = scrollChapter === 'peru'
  const isChile = scrollChapter === 'chile'
  const isConvergence = scrollChapter === 'convergence'
  const isClosing = scrollChapter === 'closing'

  let position: [number, number, number] = earthHubComposition.position
  let scale = earthHubComposition.scale
  let quaternion = peruChileQ
  let outlineOpacity = 0

  if (isPeru) {
    const comp = countryCompositions.peru
    const entry = rangeProgress(p, 0, .14)
    const exitP = rangeProgress(p, .92, 1)
    if (exitP > 0) {
      position = [lerpNumber(comp.position[0], bridgeEarthComposition.position[0], exitP),
                  lerpNumber(comp.position[1], bridgeEarthComposition.position[1], exitP), 0]
      scale = lerpNumber(comp.scale, bridgeEarthComposition.scale, exitP)
      quaternion = peruQ.clone().slerp(southAmericaQ, smoothstep(exitP))
    } else {
      position = [lerpNumber(earthHubComposition.position[0], comp.position[0], smoothstep(entry)),
                  lerpNumber(earthHubComposition.position[1], comp.position[1], smoothstep(entry)), 0]
      scale = lerpNumber(earthHubComposition.scale, comp.scale + .08, smoothstep(entry))
      const hold = rangeProgress(p, .14, .92)
      scale -= hold * .08
      quaternion = peruChileQ.clone().slerp(peruQ, smoothstep(entry))
    }
    outlineOpacity = 0  // no SA outline during Peru chapter

  } else if (isChile) {
    const comp = countryCompositions.chile
    const entry = rangeProgress(p, 0, .16)
    const exitP = rangeProgress(p, .88, 1)
    if (exitP > 0) {
      position = [lerpNumber(comp.position[0], convergenceStartEarthComposition.position[0], exitP),
                  lerpNumber(comp.position[1], convergenceStartEarthComposition.position[1], exitP), 0]
      scale = lerpNumber(comp.scale, convergenceStartEarthComposition.scale, exitP)
      quaternion = chileQ.clone().slerp(peruChileQ, smoothstep(exitP))
    } else {
      position = [lerpNumber(bridgeEarthComposition.position[0], comp.position[0], smoothstep(entry)),
                  lerpNumber(bridgeEarthComposition.position[1], comp.position[1], smoothstep(entry)), 0]
      scale = lerpNumber(bridgeEarthComposition.scale, comp.scale + .08, smoothstep(entry))
      const hold = rangeProgress(p, .16, .88)
      scale -= hold * .08
      quaternion = southAmericaQ.clone().slerp(chileQ, smoothstep(entry))
    }
    outlineOpacity = 0  // no SA outline during Chile chapter

  } else if (scrollChapter === 'opening') {
    if (p >= 0.20) {
      // Entire Scene 01 hold: locked frozen composition through end of chapter
      position = openingLockedEarthComposition.position
      scale = openingLockedEarthComposition.scale
      if (prelDone.current) quaternion = peruChileQ
    } else {
      // Prelude entry (0–.20): use choreography
      const sample = sampleEarthChoreographyProgress(p)
      position = sample.position; scale = sample.scale
      if (prelDone.current) {
        quaternion = sample.phase === 'hero' || sample.phase === 'shift' ? southAmericaQ : peruChileQ
      }
    }
    outlineOpacity = 0  // no outline in opening

  } else if (scrollChapter === 'earth') {
    // 02→03 transition: smooth reframe from locked opening composition to earth hub
    // Main mechanism: GLOBE transform (position & scale)
    // Camera: only subtle supporting adjustment via CameraRig
    const reframeEnd = 0.82  // Earth finishes reframing at this point
    if (p <= reframeEnd) {
      // During 02→03 transition: interpolate from locked opening to earth hub
      const reframeProgress = smoothstep(p / reframeEnd)
      position = [
        lerpNumber(openingLockedEarthComposition.position[0], earthHubComposition.position[0], reframeProgress),
        lerpNumber(openingLockedEarthComposition.position[1], earthHubComposition.position[1], reframeProgress),
        0
      ]
      scale = lerpNumber(openingLockedEarthComposition.scale, earthHubComposition.scale, reframeProgress)
    } else {
      // After reframe complete: hold earth hub composition
      position = earthHubComposition.position
      scale = earthHubComposition.scale
    }
    quaternion = peruChileQ
    outlineOpacity = 0  // no outline in earth hub

  } else if (isConvergence) {
    position = [lerpNumber(convergenceStartEarthComposition.position[0], 0, p),
                lerpNumber(convergenceStartEarthComposition.position[1], -.05, p), 0]
    scale = lerpNumber(convergenceStartEarthComposition.scale, .9, p)
    quaternion = peruChileQ; outlineOpacity = 0  // no SA outline in Scenes 14–16

  } else if (isClosing) {
    if (p < .65)       { position = [0, -.05, 0]; scale = .9; quaternion = southAmericaQ; outlineOpacity = 0 }
    else if (p < .72)  { const l = rangeProgress(p, .65, .72); position = [0, -.05, 0]; scale = lerpNumber(1.05, .98, l); quaternion = southAmericaQ.clone().slerp(peruChileQ, smoothstep(l * .35)); outlineOpacity = 0 }
    else if (p < .84)  { const l = rangeProgress(p, .72, .84); position = [0, lerpNumber(-.05, 0, l), 0]; scale = lerpNumber(.98, .8, l); quaternion = southAmericaQ.clone().slerp(peruChileQ, smoothstep(l)); outlineOpacity = 0 }
    else               { const l = rangeProgress(p, .84, .92); position = [0, 0, 0]; scale = lerpNumber(.8, .7, l); quaternion = peruChileQ; outlineOpacity = 0 }  // no SA outline in Scenes 21–28
  }

  const convergenceIntensity = isConvergence ? fadeWindow(p, .12, .24, .72, .9) : 0

  // Peru Earth opacity: keep visible through Scene 07 (full chapter)
  // Scenes 03–04: full opacity
  // Scenes 05–07: gradient fade from .60 → .45 as chapter progresses
  // Only fade out on chapter exit
  const peruEarthOpacity = isPeru
    ? (p <= .34 ? 1
      : p <= .92 ? Math.max(.45, 1 - (p - .34) * .87)  // Gradual fade from .34 to .92
      : rangeProgress(p, .92, 1))
    : 0
  // Chile Earth opacity: keep visible through full chapter
  // Geo-focus: entry transition
  // Overview → Talent → Capabilities → Certifications: full opacity with slight fade
  // Journey: full opacity
  // Exit: fade out
  const chileEarthOpacity = isChile
    ? (p <= .18 ? 1
      : p <= .88 ? Math.max(.45, 1 - (p - .18) * .75)  // Gradual fade from .18 to .88
      : rangeProgress(p, .88, 1))
    : 0

  const earthOpacity = isPeru ? peruEarthOpacity
    : isChile ? chileEarthOpacity
    : scrollChapter === 'ai' ? 1 - rangeProgress(p, 0, .14)
    : isClosing ? (p < .65 ? 0 : p < .84 ? 1 : 1 - rangeProgress(p, .84, .92))
    : 1

  const peruHighlight = isPeru
    ? (p <= .92 ? Math.max(.4, 1 - (p - .14) * 0.75) : rangeProgress(p, .92, 1))
    : 0
  // Chile highlight: keep visible throughout chapter (09–13) with gentle fade on exit
  const chileHighlight = isChile
    ? (p <= .88 ? Math.max(.4, 1 - (p - .15) * 0.75) : rangeProgress(p, .88, 1))
    : 0

  const globeVisible = ['opening','earth','peru','chile','convergence','closing'].includes(scrollChapter)
    || (scrollChapter === 'ai' && p < .15)

  // Quaternion to apply: during prelude, orientation group is driven by useFrame above
  const staticQuaternion = (scrollChapter === 'opening' && !prelDone.current) ? undefined : quaternion

  return <group position={position} scale={scale} visible={globeVisible && earthOpacity > .001}>
    <group ref={orientationGroupRef} quaternion={staticQuaternion}>
      <EarthSurface textures={failed ? null : textures} opacity={earthOpacity} />
      {textures && !failed && <Clouds textures={textures} opacity={earthOpacity} />}
      <Atmosphere opacity={earthOpacity} />
      <Line points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={outlineOpacity * earthOpacity} />
      {peruHighlight > .01 && <CountrySurfaceHighlight country="peru" visible intensity={peruHighlight} />}
      {chileHighlight > .01 && <CountrySurfaceHighlight country="chile" visible intensity={chileHighlight} />}
      {isConvergence && <>
        <CountrySurfaceHighlight country="peru" visible intensity={convergenceIntensity} />
        <CountrySurfaceHighlight country="chile" visible intensity={convergenceIntensity} />
        <EnergyArc from={chilePoint} to={peruPoint} visible opacity={convergenceIntensity} />
      </>}
      {scrollChapter === 'earth' && <>
        <AnchorDot point={peruPoint} color="#00e6ff" />
        <AnchorDot point={chilePoint} color="#4aa8ff" />
        <EnergyArc from={chilePoint} to={peruPoint} visible opacity={.45} />
      </>}
      {/* Peru geo anchors — real lat/lon markers inside the SAME rotated Earth group as the highlight */}
      {isPeru && activeSceneIndex === 2 && <PeruGeoAnchors3D anchors={SCENE03_GEO_ANCHORS} />}
      {isPeru && activeSceneIndex === 3 && <PeruGeoAnchors3D anchors={SCENE04_GEO_ANCHORS} dimOpacity={0.55} />}
      {/* Chile geo anchors — real lat/lon markers inside the SAME rotated Earth group as the highlight */}
      {isChile && activeSceneIndex === 7 && <ChileGeoAnchors3D anchors={SCENE08_GEO_ANCHORS} />}
      {isChile && activeSceneIndex === 8 && <ChileGeoAnchors3D anchors={SCENE09_GEO_ANCHORS} dimOpacity={0.55} />}
      {/* Legacy territorial anchors — superseded by PeruGeoAnchors3D above */}
      {false && scrollChapter === 'peru' && (
        <PeruTerritorialAnchors
          show={p < .34}
          opacity={p < .14 ? p / .14 : 1}
        />
      )}
    </group>
    <OrbitArcs visible={false} />
  </group>
}
