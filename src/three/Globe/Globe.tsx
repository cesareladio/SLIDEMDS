import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { peru } from '../../data/peru'
import { chile } from '../../data/chile'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { latLonToVector3, southAmericaOutline } from './geo'

function Hub({ name, lat, lon, visible }: { name: string; lat: number; lon: number; visible: boolean }) {
  const point = useMemo(() => latLonToVector3(lat, lon, 2.51), [lat, lon])
  if (!visible) return null
  return <group position={point}>
    <mesh><sphereGeometry args={[.035, 16, 16]} /><meshBasicMaterial color="#fff" toneMapped={false} /></mesh>
    <mesh><ringGeometry args={[.07, .09, 32]} /><meshBasicMaterial color="#00d4ff" transparent opacity={.8} side={THREE.DoubleSide} /></mesh>
    <Html center distanceFactor={8} className="hub-label"><span>{name}</span></Html>
  </group>
}

export function Globe({ scene }: { scene: number }) {
  const root = useRef<THREE.Group>(null)
  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.505)), [])
  const peruPoint = useMemo(() => latLonToVector3(-11, -75.2, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(-34.5, -71, 2.52), [])
  useFrame((state, delta) => {
    if (!root.current) return
    root.current.rotation.y += delta * (scene === 0 ? .025 : .006)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, Math.sin(state.clock.elapsedTime * .18) * .015, .02)
  })
  const globeVisible = scene <= 3 || scene === 7
  return <group ref={root} rotation={[0, .28, -.08]} visible={globeVisible}>
    <mesh>
      <sphereGeometry args={[2.45, 64, 64]} />
      <meshStandardMaterial color="#06132d" emissive="#031633" emissiveIntensity={.7} roughness={.82} metalness={.25} transparent opacity={.94} />
    </mesh>
    <mesh scale={1.006}>
      <sphereGeometry args={[2.45, 32, 24]} />
      <meshBasicMaterial color="#1576b8" wireframe transparent opacity={.06} />
    </mesh>
    <mesh scale={1.04}>
      <sphereGeometry args={[2.45, 48, 48]} />
      <meshBasicMaterial color="#00a6ff" transparent opacity={.035} side={THREE.BackSide} />
    </mesh>
    <Line points={outline} color="#36ceff" lineWidth={1.2} transparent opacity={.74} />
    <group>
      {[peruPoint, chilePoint].map((point, index) => <group position={point} key={index}>
        <mesh><sphereGeometry args={[.055, 20, 20]} /><meshBasicMaterial color={index ? '#4aa8ff' : '#00e6ff'} toneMapped={false} /></mesh>
        <mesh scale={1 + Math.sin(index) * .1}><ringGeometry args={[.1, .13, 40]} /><meshBasicMaterial color="#00d4ff" transparent opacity={.55} side={THREE.DoubleSide} /></mesh>
      </group>)}
    </group>
    {peru.hubs.map(hub => <Hub key={hub.name} {...hub} visible={scene === 1} />)}
    {chile.hubs.map(hub => <Hub key={hub.name} {...hub} visible={scene === 1 || scene === 7} />)}
    <EnergyArc from={chilePoint} to={peruPoint} visible={scene === 1 || scene === 7} />
  </group>
}
