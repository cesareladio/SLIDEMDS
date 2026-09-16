import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { OrbitArcs } from './OrbitArcs'
import { CountrySurfaceHighlight } from './CountrySurfaceHighlight'
import { latLonToVector3, southAmericaOutline, geoAnchors, getGlobeOrientationForLatLon } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import { sampleEarthChoreographyProgress, earthHubComposition } from '../../data/earthJourney'
import { bridgeEarthComposition, convergenceStartEarthComposition } from '../../data/sequentialCountryChoreography'
import { countryFromChapter, segmentFadeOpacity } from '../../data/countryScroll'
import type { ScrollChapter } from '../../app/ScrollContext'
import { fadeWindow, lerpNumber, rangeProgress } from '../../utils/scrollMotion'

const countryOrientations = { peru: { lat: -10, lon: -75 }, chile: { lat: -33, lon: -71 } } as const
const countryCompositions = {
  peru: { position: [.15, -.45, 0] as [number,number,number], scale: 1.28 },
  chile: { position: [.2, -.52, 0] as [number,number,number], scale: 1.22 },
} as const
const smoothstep = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t) }

function CountryLabel({ point, label, color = '#bdf3ff' }: { point: THREE.Vector3; label: string; color?: string }) {
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  return <group>
    <mesh position={point}><sphereGeometry args={[.016, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={.38} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className="hub-label hub-label-minimal"><span>{label}</span></Html>
  </group>
}

export function Globe({ scrollChapter = 'opening', scrollProgress = 0 }: { scrollChapter?: ScrollChapter; scrollProgress?: number }) {
  const { textures, failed } = useEarthTextures()
  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(geoAnchors.peru.lat, geoAnchors.peru.lon, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])
  const southAmericaQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon), [])
  const peruQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat, countryOrientations.peru.lon), [])
  const chileQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])

  const p = Number.isFinite(scrollProgress) ? Math.min(1, Math.max(0, scrollProgress)) : 0
  const activeCountry = countryFromChapter(scrollChapter)
  const isPeru = scrollChapter === 'peru'
  const isChile = scrollChapter === 'chile'
  const isConvergence = scrollChapter === 'convergence'
  const isClosing = scrollChapter === 'closing'

  // ----- Earth position / scale / orientation / outline ----- //
  let position: [number, number, number] = earthHubComposition.position
  let scale = earthHubComposition.scale
  let quaternion = peruChileQ
  let outlineOpacity = .38

  if (isPeru) {
    const comp = countryCompositions.peru
    // 0→.14: Earth zooms in to Peru focus. .92→1: pullback to SA bridge.
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
    outlineOpacity = .18 + entry * .34 + segmentFadeOpacity('peru', 'exit', p, .04) * .24

  } else if (isChile) {
    const comp = countryCompositions.chile
    // 0→.16: inherit SA bridge, zoom to Chile. .88→1: pullback to convergence.
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
    outlineOpacity = .18 + entry * .34 + segmentFadeOpacity('chile', 'exit', p, .04) * .24

  } else if (scrollChapter === 'opening') {
    const sample = sampleEarthChoreographyProgress(p)
    position = sample.position; scale = sample.scale
    quaternion = sample.phase === 'hero' || sample.phase === 'shift' ? southAmericaQ : peruChileQ
    outlineOpacity = sample.phase === 'hero' ? 0 : sample.phase === 'shift' ? .22 : .38

  } else if (scrollChapter === 'earth') {
    position = earthHubComposition.position; scale = earthHubComposition.scale
    quaternion = peruChileQ; outlineOpacity = .42

  } else if (isConvergence) {
    position = [lerpNumber(convergenceStartEarthComposition.position[0], 0, p),
                lerpNumber(convergenceStartEarthComposition.position[1], -.05, p), 0]
    scale = lerpNumber(convergenceStartEarthComposition.scale, .9, p)
    quaternion = peruChileQ; outlineOpacity = .35

  } else if (isClosing) {
    if (p < .65)       { position = [0, -.05, 0]; scale = .9; quaternion = southAmericaQ; outlineOpacity = 0 }
    else if (p < .72)  { const l = rangeProgress(p, .65, .72); position = [0, -.05, 0]; scale = lerpNumber(1.05, .98, l); quaternion = southAmericaQ.clone().slerp(peruChileQ, smoothstep(l * .35)); outlineOpacity = l * .42 }
    else if (p < .84)  { const l = rangeProgress(p, .72, .84); position = [0, lerpNumber(-.05, 0, l), 0]; scale = lerpNumber(.98, .8, l); quaternion = southAmericaQ.clone().slerp(peruChileQ, smoothstep(l)); outlineOpacity = lerpNumber(.42, .18, l) }
    else               { const l = rangeProgress(p, .84, .92); position = [0, 0, 0]; scale = lerpNumber(.8, .7, l); quaternion = peruChileQ; outlineOpacity = lerpNumber(.18, 0, l) }
  }

  // ----- Derived visual state ----- //
  const convergenceIntensity = isConvergence ? fadeWindow(p, .12, .24, .72, .9) : 0
  const earthOpacity = isPeru
    ? (p < .92 ? fadeWindow(p, 0, .12, .80, .92) : 0)
    : isChile
      ? (p < .88 ? (p < .16 ? p / .16 : 1) : 1 - rangeProgress(p, .88, 1))
      : scrollChapter === 'ai' ? 1 - rangeProgress(p, 0, .14)
      : isClosing ? (p < .65 ? 0 : p < .84 ? 1 : 1 - rangeProgress(p, .84, .92))
      : 1

  const peruHighlight = isPeru
    ? Math.max(segmentFadeOpacity('peru', 'geo-focus', p, .04), segmentFadeOpacity('peru', 'exit', p, .02))
    : 0
  const chileHighlight = isChile
    ? Math.max(segmentFadeOpacity('chile', 'geo-focus', p, .04), segmentFadeOpacity('chile', 'exit', p, .02))
    : 0

  const globeVisible = ['opening','earth','peru','chile','convergence','closing'].includes(scrollChapter)
    || (scrollChapter === 'ai' && p < .15)

  return <group position={position} scale={scale} visible={globeVisible && earthOpacity > .001}>
    <group quaternion={quaternion}>
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
        <CountryLabel point={peruPoint} label="PERÚ" color="#00e6ff" />
        <CountryLabel point={chilePoint} label="CHILE" color="#4aa8ff" />
        <EnergyArc from={chilePoint} to={peruPoint} visible opacity={.6} />
      </>}
    </group>
    <OrbitArcs visible={scrollChapter === 'opening' || scrollChapter === 'earth' || scrollChapter === 'convergence'} />
  </group>
}
