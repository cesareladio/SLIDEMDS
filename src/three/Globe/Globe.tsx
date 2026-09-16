import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { peru } from '../../data/peru'
import { chile } from '../../data/chile'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { OrbitArcs } from './OrbitArcs'
import { CountrySurfaceHighlight } from './CountrySurfaceHighlight'
import { latLonToVector3, southAmericaOutline, geoAnchors, getGlobeOrientationForLatLon } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import {
  sampleEarthChoreographyProgress,
  footprintComposition,
  closingComposition,
  earthHubComposition,
  type EarthChoreographyPhase,
} from '../../data/earthJourney'
import type { CountryId } from '../../data/countryProfiles'
import type { ScrollChapter } from '../../app/ScrollContext'
import { rangeProgress } from '../../utils/scrollMotion'

function dampScalar(current: number, target: number, delta: number, lambda = 5.0) {
  const next = THREE.MathUtils.damp(current, target, lambda, delta)
  return Math.abs(next - target) < .0001 ? target : next
}

const countryOrientations = { peru: { lat: -10, lon: -75 }, chile: { lat: -33, lon: -71 } } as const
const countryCompositions: Record<CountryId, { position: [number, number, number]; scale: number }> = {
  peru: { position: [.15, -.45, 0], scale: 1.28 },
  chile: { position: [.2, -.52, 0],  scale: 1.22 },
}

function InteractiveHotspot({ point, label, color = '#bdf3ff', onSelect, opacity = 1 }: { point: THREE.Vector3; label: string; color?: string; onSelect: () => void; opacity?: number }) {
  const [hovered, setHovered] = useState(false)
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  const size = hovered ? .026 : .016
  return <group
    onPointerEnter={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
    onPointerLeave={e => { e.stopPropagation(); setHovered(false); document.body.style.cursor = '' }}
    onClick={e => { e.stopPropagation(); onSelect() }}
  >
    <mesh position={point}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} /></mesh>
    <mesh position={point} scale={2.5}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={opacity * (hovered ? .2 : .07)} depthWrite={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={opacity * (hovered ? .7 : .38)} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className={`hub-label hub-label-minimal${hovered ? ' hub-label-hover' : ''}`} style={{ opacity }}><span>{label}</span></Html>
  </group>
}

function PlainHotspot({ point, label, color = '#eaffff' }: { point: THREE.Vector3; label: string; color?: string }) {
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .24), [point])
  return <group>
    <mesh position={point}><sphereGeometry args={[.014, 10, 10]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={.34} lineWidth={.55} />
    <Html position={leaderEnd} center distanceFactor={9} className="hub-label hub-label-minimal"><span>{label}</span></Html>
  </group>
}

export interface GlobeScrollProps {
  scrollChapter?: ScrollChapter
  scrollProgress?: number
}

export function Globe({
  scene,
  selectedCountry = null,
  onSelectCountry,
  scrollChapter = 'opening',
  scrollProgress = 0,
}: {
  scene: number
  selectedCountry?: CountryId | null
  onSelectCountry?: (id: CountryId) => void
  scrollChapter?: ScrollChapter
  scrollProgress?: number
}) {
  const transformGroup = useRef<THREE.Group>(null)
  const orientationGroup = useRef<THREE.Group>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outlineRef = useRef<any>(null)
  const { textures, failed } = useEarthTextures()
  const [visualPhase, setVisualPhase] = useState<EarthChoreographyPhase>('hero')
  const [highlightIntensity, setHighlightIntensity] = useState(0)

  const outline      = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint    = useMemo(() => latLonToVector3(geoAnchors.peru.lat,      geoAnchors.peru.lon,      2.52), [])
  const chilePoint   = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])

  const southAmericaQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQ    = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat,    geoAnchors.peruChile.lon),    [])
  const peruQ         = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat,  countryOrientations.peru.lon),  [])
  const chileQ        = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])

  // derived from scroll — deterministic, no clock
  const hotspotOpacity = scrollChapter === 'earth' ? 1 : rangeProgress(scrollProgress, 0.72, 1.0)

  useFrame((_, delta) => {
    let earthPosition: [number, number, number]
    let earthScale: number
    let targetQuaternion: THREE.Quaternion
    let nextPhase: EarthChoreographyPhase = 'settle'
    let outlineTarget = .38

    if (selectedCountry) {
      const comp = countryCompositions[selectedCountry]
      earthPosition    = comp.position
      earthScale       = comp.scale
      targetQuaternion = selectedCountry === 'peru' ? peruQ : chileQ
      outlineTarget    = .2
    } else if (scrollChapter === 'opening') {
      const sample     = sampleEarthChoreographyProgress(scrollProgress)
      earthPosition    = sample.position
      earthScale       = sample.scale
      nextPhase        = sample.phase
      targetQuaternion = nextPhase === 'hero' || nextPhase === 'shift' ? southAmericaQ : peruChileQ
      outlineTarget    = nextPhase === 'hero' ? 0 : nextPhase === 'shift' ? .22 : .38
    } else if (scrollChapter === 'earth') {
      earthPosition    = earthHubComposition.position
      earthScale       = earthHubComposition.scale
      targetQuaternion = peruChileQ
      outlineTarget    = .42
    } else if (scene === 7) {
      earthPosition    = closingComposition.position
      earthScale       = closingComposition.scale
      targetQuaternion = peruChileQ
      outlineTarget    = .3
    } else {
      earthPosition    = footprintComposition.position
      earthScale       = footprintComposition.scale
      targetQuaternion = peruChileQ
    }

    if (nextPhase !== visualPhase) setVisualPhase(nextPhase)
    const nextHI = THREE.MathUtils.damp(highlightIntensity, selectedCountry ? 1 : 0, 5.5, delta)
    if (Math.abs(nextHI - highlightIntensity) > .0001) setHighlightIntensity(nextHI)

    if (transformGroup.current) {
      transformGroup.current.position.set(
        dampScalar(transformGroup.current.position.x, earthPosition[0], delta),
        dampScalar(transformGroup.current.position.y, earthPosition[1], delta),
        dampScalar(transformGroup.current.position.z, earthPosition[2], delta),
      )
      transformGroup.current.scale.setScalar(dampScalar(transformGroup.current.scale.x, earthScale, delta))
    }
    if (orientationGroup.current) {
      const angle = orientationGroup.current.quaternion.angleTo(targetQuaternion)
      if (angle < .00015) orientationGroup.current.quaternion.copy(targetQuaternion)
      else orientationGroup.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-4.8 * delta))
    }
    if (outlineRef.current?.material) {
      outlineRef.current.material.opacity = dampScalar(outlineRef.current.material.opacity, outlineTarget, delta)
    }
  })

  const globeVisible = scrollChapter === 'opening' || scrollChapter === 'earth' || scene === 1 || scene === 7 || selectedCountry !== null
  const showHotspots = (scrollChapter === 'earth' || hotspotOpacity > 0.01) && !selectedCountry
  const showPeruHubs = scene === 1 || selectedCountry === 'peru'
  const showChileHubs = (scene === 1 && !selectedCountry) || selectedCountry === 'chile'

  return <group ref={transformGroup} visible={globeVisible}>
    <group ref={orientationGroup}>
      <EarthSurface textures={failed ? null : textures} />
      {textures && !failed && <Clouds textures={textures} />}
      <Atmosphere />
      <Line ref={outlineRef} points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={0} />
      {selectedCountry && <CountrySurfaceHighlight country={selectedCountry} visible intensity={highlightIntensity} />}
      {showHotspots && <>
        <InteractiveHotspot point={peruPoint} label="PERÚ" color="#00e6ff" onSelect={() => onSelectCountry?.('peru')} opacity={hotspotOpacity} />
        <InteractiveHotspot point={chilePoint} label="CHILE" color="#4aa8ff" onSelect={() => onSelectCountry?.('chile')} opacity={hotspotOpacity} />
        {scrollChapter === 'earth' && <EnergyArc from={chilePoint} to={peruPoint} visible />}
      </>}
      {showPeruHubs && (peru.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} />)}
      {showChileHubs && (chile.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#8fd8ff" />)}
    </group>
    <OrbitArcs visible={globeVisible && !selectedCountry} />
  </group>
}
