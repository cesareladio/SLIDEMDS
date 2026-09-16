import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { peru } from '../../data/peru'
import { chile } from '../../data/chile'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { latLonToVector3, southAmericaOutline } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import { Starfield } from './Starfield'
import { sampleEarthJourney, type EarthJourneyPhase } from '../../data/earthJourney'

function Hub({ name, lat, lon, visible }: { name: string; lat: number; lon: number; visible: boolean }) {
  const point = useMemo(() => latLonToVector3(lat, lon, 2.51), [lat, lon])
  if (!visible) return null
  return <group position={point}>
    <mesh><sphereGeometry args={[.035, 16, 16]} /><meshBasicMaterial color="#fff" toneMapped={false} /></mesh>
    <mesh><ringGeometry args={[.07, .09, 32]} /><meshBasicMaterial color="#00d4ff" transparent opacity={.8} side={THREE.DoubleSide} /></mesh>
    <Html center distanceFactor={8} className="hub-label"><span>{name}</span></Html>
  </group>
}

function focusForScene(scene: number, journeyPhase: EarthJourneyPhase): EarthJourneyPhase {
  if (scene === 0) return journeyPhase
  if (scene === 1 || scene === 7) return 'peru'
  return 'southAmerica'
}

const compositionOffsets: Record<number, [number, number]> = {
  0: [0, 0], 1: [1.35, -.95], 2: [0, 0], 3: [0, 0], 7: [0, 0],
}

export function Globe({ scene }: { scene: number }) {
  const root = useRef<THREE.Group>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outlineRef = useRef<any>(null)
  const openingStartedAt = useRef<number | null>(null)
  const { textures, failed } = useEarthTextures()
  const [focus, setFocus] = useState<EarthJourneyPhase>(scene === 0 ? 'space' : 'peru')

  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(-11, -75.2, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(-34.5, -71, 2.52), [])

  useFrame((state, delta) => {
    if (scene !== 0) openingStartedAt.current = null
    const journeyElapsed = scene === 0
      ? (() => {
        if (openingStartedAt.current === null) openingStartedAt.current = state.clock.elapsedTime
        return state.clock.elapsedTime - openingStartedAt.current
      })()
      : 0
    const journeyPhase = scene === 0 ? sampleEarthJourney(journeyElapsed).phase : 'peru'
    const nextFocus = focusForScene(scene, journeyPhase)
    if (nextFocus !== focus) setFocus(nextFocus)

    if (root.current) {
      if (scene === 0) root.current.rotation.y = .28
      else root.current.rotation.y += delta * .006
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, Math.sin(state.clock.elapsedTime * .16) * .012, .02)

      const [ox, oy] = compositionOffsets[scene] ?? [0, 0]
      root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, Number.isFinite(ox) ? ox : 0, .04)
      root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, Number.isFinite(oy) ? oy : 0, .04)
    }

    if (outlineRef.current?.material) {
      const targetOpacity = nextFocus === 'space' || nextFocus === 'reveal' ? 0 : nextFocus === 'southAmerica' ? .3 : .5
      outlineRef.current.material.opacity = THREE.MathUtils.lerp(outlineRef.current.material.opacity, targetOpacity, .05)
    }
  })

  const globeVisible = scene <= 3 || scene === 7
  const showHotspots = focus === 'peru'

  return <group ref={root} rotation={[0, .28, -.08]} visible={globeVisible}>
    <Starfield />
    <EarthSurface textures={failed ? null : textures} />
    {textures && !failed && <Clouds textures={textures} />}
    <Atmosphere />
    <Line ref={outlineRef} points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={0} />
    {peru.operationalHubs?.map(hub => <Hub key={hub.name} {...hub} visible={scene === 1} />)}
    {chile.operationalHubs?.map(hub => <Hub key={hub.name} {...hub} visible={scene === 1 || scene === 7} />)}
    {showHotspots && [peruPoint, chilePoint].map((point, index) => <group position={point} key={index}>
      <mesh><sphereGeometry args={[.05, 20, 20]} /><meshBasicMaterial color={index ? '#4aa8ff' : '#00e6ff'} toneMapped={false} /></mesh>
      <mesh scale={1 + Math.sin(index) * .1}><ringGeometry args={[.09, .12, 40]} /><meshBasicMaterial color="#00d4ff" transparent opacity={.5} side={THREE.DoubleSide} /></mesh>
      <Html center distanceFactor={8} className="hub-label"><span>{index ? 'CHILE' : 'PERÚ'}</span></Html>
    </group>)}
    <EnergyArc from={chilePoint} to={peruPoint} visible={showHotspots} />
  </group>
}
