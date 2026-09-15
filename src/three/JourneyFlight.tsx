import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { journeyWaypoints } from '../data/journeyPath'

function finitePosition(position: readonly number[]) { return position.length === 3 && position.every(Number.isFinite) ? position as [number, number, number] : [0, 0, 0] as [number, number, number] }

export function JourneyFlight({ visible }: { visible: boolean }) {
  const group = useRef<THREE.Group>(null)
  const startedAt = useRef<number | null>(null)
  const points = useMemo(() => journeyWaypoints.map(item => new THREE.Vector3(...finitePosition(item.position))), [])
  const trail = useMemo(() => new THREE.CatmullRomCurve3(points).getPoints(100), [points])
  useEffect(() => { if (!visible) startedAt.current = null }, [visible])
  useFrame(state => {
    if (!group.current || !visible) return
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startedAt.current
    group.current.rotation.y = -.14 + Math.sin(elapsed * .12) * .025
  })
  if (!visible) return null
  return <group ref={group}>
    <Line points={trail} color="#00d4ff" transparent opacity={.26} lineWidth={1.3} />
    <Line points={trail.slice(38)} color="#9cefff" transparent opacity={.58} lineWidth={1} />
    {journeyWaypoints.map((waypoint, index) => {
      const position = finitePosition(waypoint.position)
      const size = waypoint.milestone ? .1 + waypoint.people / 8500 : .038 + waypoint.people / 28000
      return <group key={waypoint.year} position={position}>
        {waypoint.milestone && <mesh scale={1.9}><sphereGeometry args={[size, 16, 16]} /><meshBasicMaterial color={waypoint.inflection ? '#ffffff' : '#00bdeb'} transparent opacity={.075} depthWrite={false} /></mesh>}
        <mesh><sphereGeometry args={[size, 16, 16]} /><meshBasicMaterial color={waypoint.inflection ? '#eaffff' : '#00c8f5'} toneMapped={false} /></mesh>
        {waypoint.inflection && <pointLight color="#47dbff" intensity={1.1} distance={3.2} />}
        {index > 4 && <mesh position={[0, 0, -.05]}><sphereGeometry args={[size * 2.8, 10, 10]} /><meshBasicMaterial color="#168ac2" transparent opacity={.028 + index * .006} depthWrite={false} /></mesh>}
      </group>
    })}
  </group>
}
