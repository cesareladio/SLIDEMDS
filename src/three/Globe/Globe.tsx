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

function finiteScalar(value: number, fallback = 0) { return Number.isFinite(value) ? value : fallback }

function Hotspot({ point, label, color = '#bdf3ff' }: { point: THREE.Vector3; label: string; color?: string }) {
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  return <group>
    <mesh position={point}><sphereGeometry args={[.018, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <mesh position={point} scale={2.6}><sphereGeometry args={[.018, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={.14} depthWrite={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={.42} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className="hub-label hub-label-minimal"><span>{label}</span></Html>
  </group>
}

export function Globe({ scene }: { scene: number }) {
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

  useFrame(state => {
    if (scene !== 0) openingStartedAt.current = null

    let earthPosition: [number, number, number] = footprintComposition.position
    let earthScale = footprintComposition.scale
    let targetQuaternion = peruChileQuaternion
    let nextPhase: EarthChoreographyPhase = 'settle'
    let outlineTarget = .38

    if (scene === 0) {
      if (openingStartedAt.current === null) openingStartedAt.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - openingStartedAt.current
      const sample = sampleEarthChoreography(Math.min(elapsed, earthChoreographyDuration))
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

  const globeVisible = scene === 0 || scene === 1 || scene === 7
  const showCountryHotspots = visualPhase === 'focus' || visualPhase === 'settle'
  const showPeruHubs = scene === 1
  const showChileHubs = scene === 1 || scene === 7

  return <group ref={transformGroup} visible={globeVisible}>
    <group ref={orientationGroup}>
      <EarthSurface textures={failed ? null : textures} />
      {textures && !failed && <Clouds textures={textures} />}
      <Atmosphere />
      <Line ref={outlineRef} points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={0} />
      {showCountryHotspots && <>
        <Hotspot point={peruPoint} label="PERÚ" color="#00e6ff" />
        <Hotspot point={chilePoint} label="CHILE" color="#4aa8ff" />
        <EnergyArc from={chilePoint} to={peruPoint} visible />
      </>}
      {showPeruHubs && peruHubs.map(hub => <Hotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#eaffff" />)}
      {showChileHubs && chileHubs.map(hub => <Hotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#eaffff" />)}
    </group>
    <OrbitArcs visible={globeVisible} />
  </group>
}
