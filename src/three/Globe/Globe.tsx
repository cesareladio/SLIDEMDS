import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { peru } from '../../data/peru'
import { chile } from '../../data/chile'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { OrbitArcs } from './OrbitArcs'
import { latLonToVector3, southAmericaOutline, geoAnchors, getGlobeOrientationForLatLon } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import { sampleEarthChoreography, earthChoreographyDuration, footprintComposition, closingComposition, type EarthChoreographyPhase } from '../../data/earthJourney'
import type { CountryId } from '../../data/countryProfiles'

function finiteScalar(value: number, fallback = 0) { return Number.isFinite(value) ? value : fallback }

const countryOrientations = {
  peru:  { lat: -10, lon: -75 },
  chile: { lat: -33, lon: -71 },
} as const

const countryCompositions: Record<CountryId, { position: [number, number, number]; scale: number }> = {
  peru:  { position: [.15, -.45, 0], scale: 1.28 },
  chile: { position: [.2, -.52, 0], scale: 1.22 },
}

function InteractiveHotspot({ point, label, color = '#bdf3ff', onSelect }: { point: THREE.Vector3; label: string; color?: string; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  const glowSize = hovered ? .032 : .018
  const halosOpacity = hovered ? .28 : .1
  return <group
    onPointerEnter={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
    onPointerLeave={e => { e.stopPropagation(); setHovered(false); document.body.style.cursor = '' }}
    onClick={e => { e.stopPropagation(); onSelect() }}
  >
    <mesh position={point}><sphereGeometry args={[glowSize, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <mesh position={point} scale={2.8}><sphereGeometry args={[glowSize, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={halosOpacity} depthWrite={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={hovered ? .7 : .42} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className={`hub-label hub-label-minimal${hovered ? ' hub-label-hover' : ''}`}><span>{label}</span></Html>
  </group>
}

function PlainHotspot({ point, label, color = '#eaffff' }: { point: THREE.Vector3; label: string; color?: string }) {
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  return <group>
    <mesh position={point}><sphereGeometry args={[.018, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={.42} lineWidth={.7} />
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

  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(geoAnchors.peru.lat, geoAnchors.peru.lon, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])
  const peruHubs = useMemo(() => peru.operationalHubs ?? [], [])
  const chileHubs = useMemo(() => chile.operationalHubs ?? [], [])

  const southAmericaQuaternion = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQuaternion = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon), [])
  const peruQuaternion = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat, countryOrientations.peru.lon), [])
  const chileQuaternion = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])

  useFrame(state => {
    if (scene !== 0) openingStartedAt.current = null

    let earthPosition: [number, number, number]
    let earthScale: number
    let targetQuaternion: THREE.Quaternion
    let nextPhase: EarthChoreographyPhase = 'settle'
    let outlineTarget = .38

    if (selectedCountry) {
      const comp = countryCompositions[selectedCountry]
      earthPosition = comp.position
      earthScale = comp.scale
      targetQuaternion = selectedCountry === 'peru' ? peruQuaternion : chileQuaternion
      outlineTarget = .52
    } else if (scene === 0) {
      if (openingStartedAt.current === null) openingStartedAt.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - openingStartedAt.current
      const sample = sampleEarthChoreography(Math.min(elapsed, earthChoreographyDuration))
      earthPosition = sample.position
      earthScale = sample.scale
      nextPhase = sample.phase
      targetQuaternion = nextPhase === 'hero' || nextPhase === 'shift' ? southAmericaQuaternion : peruChileQuaternion
      outlineTarget = nextPhase === 'hero' ? 0 : nextPhase === 'shift' ? .22 : .38
    } else if (scene === 1) {
      earthPosition = footprintComposition.position
      earthScale = footprintComposition.scale
      targetQuaternion = peruChileQuaternion
      outlineTarget = .38
    } else if (scene === 7) {
      earthPosition = closingComposition.position
      earthScale = closingComposition.scale
      targetQuaternion = peruChileQuaternion
      outlineTarget = .3
    } else {
      earthPosition = footprintComposition.position
      earthScale = footprintComposition.scale
      targetQuaternion = peruChileQuaternion
    }

    if (nextPhase !== visualPhase) setVisualPhase(nextPhase)

    if (transformGroup.current) {
      transformGroup.current.position.x = THREE.MathUtils.lerp(transformGroup.current.position.x, finiteScalar(earthPosition[0]), .045)
      transformGroup.current.position.y = THREE.MathUtils.lerp(transformGroup.current.position.y, finiteScalar(earthPosition[1]), .045)
      transformGroup.current.position.z = THREE.MathUtils.lerp(transformGroup.current.position.z, finiteScalar(earthPosition[2]), .045)
      const nextScale = THREE.MathUtils.lerp(transformGroup.current.scale.x, finiteScalar(earthScale, 1), .045)
      transformGroup.current.scale.setScalar(nextScale)
    }
    if (orientationGroup.current) orientationGroup.current.quaternion.slerp(targetQuaternion, .035)
    if (outlineRef.current?.material) outlineRef.current.material.opacity = THREE.MathUtils.lerp(outlineRef.current.material.opacity, outlineTarget, .05)
  })

  const globeVisible = scene === 0 || scene === 1 || scene === 7 || selectedCountry !== null
  const showSelectableHotspots = (visualPhase === 'focus' || visualPhase === 'settle') && !selectedCountry && scene === 0
  const showCountryHubs = scene === 1 || (selectedCountry !== null)
  const showEnergyArc = showSelectableHotspots || (scene === 1 && !selectedCountry)

  return <group ref={transformGroup} visible={globeVisible}>
    <group ref={orientationGroup}>
      <EarthSurface textures={failed ? null : textures} />
      {textures && !failed && <Clouds textures={textures} />}
      <Atmosphere />
      <Line ref={outlineRef} points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={0} />
      {showSelectableHotspots && <>
        <InteractiveHotspot point={peruPoint} label="PERÚ" color="#00e6ff" onSelect={() => onSelectCountry?.('peru')} />
        <InteractiveHotspot point={chilePoint} label="CHILE" color="#4aa8ff" onSelect={() => onSelectCountry?.('chile')} />
        {showEnergyArc && <EnergyArc from={chilePoint} to={peruPoint} visible />}
      </>}
      {showCountryHubs && peruHubs.map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} />)}
      {showCountryHubs && chileHubs.map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#8fd8ff" />)}
    </group>
    <OrbitArcs visible={globeVisible} />
  </group>
}
