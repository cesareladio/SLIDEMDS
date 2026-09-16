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
import { sampleEarthChoreography, earthChoreographyDuration, footprintComposition, closingComposition, type EarthChoreographyPhase } from '../../data/earthJourney'
import type { CountryId } from '../../data/countryProfiles'

function dampScalar(current: number, target: number, delta: number, lambda = 4.6) {
  const next = THREE.MathUtils.damp(current, target, lambda, delta)
  return Math.abs(next - target) < .0001 ? target : next
}

const countryOrientations = { peru: { lat: -10, lon: -75 }, chile: { lat: -33, lon: -71 } } as const
const countryCompositions: Record<CountryId, { position: [number, number, number]; scale: number }> = {
  peru: { position: [.15, -.45, 0], scale: 1.28 },
  chile: { position: [.2, -.52, 0], scale: 1.22 },
}

function InteractiveHotspot({ point, label, color = '#bdf3ff', onSelect }: { point: THREE.Vector3; label: string; color?: string; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  const size = hovered ? .026 : .016
  return <group
    onPointerEnter={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
    onPointerLeave={e => { e.stopPropagation(); setHovered(false); document.body.style.cursor = '' }}
    onClick={e => { e.stopPropagation(); onSelect() }}
  >
    <mesh position={point}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <mesh position={point} scale={2.5}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={hovered ? .2 : .07} depthWrite={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={hovered ? .7 : .38} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className={`hub-label hub-label-minimal${hovered ? ' hub-label-hover' : ''}`}><span>{label}</span></Html>
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

export function Globe({ scene, selectedCountry = null, onSelectCountry }: { scene: number; selectedCountry?: CountryId | null; onSelectCountry?: (id: CountryId) => void }) {
  const transformGroup = useRef<THREE.Group>(null)
  const orientationGroup = useRef<THREE.Group>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outlineRef = useRef<any>(null)
  const openingStartedAt = useRef<number | null>(null)
  const { textures, failed } = useEarthTextures()
  const [visualPhase, setVisualPhase] = useState<EarthChoreographyPhase>(scene === 0 ? 'hero' : 'settle')
  const [highlightIntensity, setHighlightIntensity] = useState(0)

  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(geoAnchors.peru.lat, geoAnchors.peru.lon, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])
  const southAmericaQuaternion = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQuaternion = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon), [])
  const peruQuaternion = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat, countryOrientations.peru.lon), [])
  const chileQuaternion = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])

  useFrame((state, delta) => {
    if (scene !== 0) openingStartedAt.current = null
    let earthPosition = footprintComposition.position
    let earthScale = footprintComposition.scale
    let targetQuaternion = peruChileQuaternion
    let nextPhase: EarthChoreographyPhase = 'settle'
    let outlineTarget = .38

    if (selectedCountry) {
      const composition = countryCompositions[selectedCountry]
      earthPosition = composition.position
      earthScale = composition.scale
      targetQuaternion = selectedCountry === 'peru' ? peruQuaternion : chileQuaternion
      outlineTarget = .2
    } else if (scene === 0) {
      if (openingStartedAt.current === null) openingStartedAt.current = state.clock.elapsedTime
      const sample = sampleEarthChoreography(Math.min(state.clock.elapsedTime - openingStartedAt.current, earthChoreographyDuration))
      earthPosition = sample.position
      earthScale = sample.scale
      nextPhase = sample.phase
      targetQuaternion = nextPhase === 'hero' || nextPhase === 'shift' ? southAmericaQuaternion : peruChileQuaternion
      outlineTarget = nextPhase === 'hero' ? 0 : nextPhase === 'shift' ? .22 : .38
    } else if (scene === 7) {
      earthPosition = closingComposition.position
      earthScale = closingComposition.scale
      outlineTarget = .3
    }

    if (nextPhase !== visualPhase) setVisualPhase(nextPhase)
    const nextHighlightIntensity = THREE.MathUtils.damp(highlightIntensity, selectedCountry ? 1 : 0, 5.5, delta)
    if (Math.abs(nextHighlightIntensity - highlightIntensity) > .0001) setHighlightIntensity(nextHighlightIntensity)

    if (transformGroup.current) {
      transformGroup.current.position.set(
        dampScalar(transformGroup.current.position.x, earthPosition[0], delta),
        dampScalar(transformGroup.current.position.y, earthPosition[1], delta),
        dampScalar(transformGroup.current.position.z, earthPosition[2], delta),
      )
      const scale = dampScalar(transformGroup.current.scale.x, earthScale, delta)
      transformGroup.current.scale.setScalar(scale)
    }
    if (orientationGroup.current) {
      const angle = orientationGroup.current.quaternion.angleTo(targetQuaternion)
      if (angle < .00015) orientationGroup.current.quaternion.copy(targetQuaternion)
      else orientationGroup.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-4.8 * delta))
    }
    if (outlineRef.current?.material) outlineRef.current.material.opacity = dampScalar(outlineRef.current.material.opacity, outlineTarget, delta)
  })

  const globeVisible = scene === 0 || scene === 1 || scene === 7 || selectedCountry !== null
  const selectable = (visualPhase === 'focus' || visualPhase === 'settle') && !selectedCountry && scene === 0
  const showPeruHubs = scene === 1 || selectedCountry === 'peru'
  const showChileHubs = (scene === 1 && !selectedCountry) || selectedCountry === 'chile'

  return <group ref={transformGroup} visible={globeVisible}>
    <group ref={orientationGroup}>
      <EarthSurface textures={failed ? null : textures} />
      {textures && !failed && <Clouds textures={textures} />}
      <Atmosphere />
      <Line ref={outlineRef} points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={0} />
      {selectedCountry && <CountrySurfaceHighlight country={selectedCountry} visible intensity={highlightIntensity} />}
      {selectable && <>
        <InteractiveHotspot point={peruPoint} label="PERÚ" color="#00e6ff" onSelect={() => onSelectCountry?.('peru')} />
        <InteractiveHotspot point={chilePoint} label="CHILE" color="#4aa8ff" onSelect={() => onSelectCountry?.('chile')} />
        <EnergyArc from={chilePoint} to={peruPoint} visible />
      </>}
      {showPeruHubs && (peru.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} />)}
      {showChileHubs && (chile.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#8fd8ff" />)}
    </group>
    <OrbitArcs visible={globeVisible && !selectedCountry} />
  </group>
}
