import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { JourneyWaypoint } from '../data/journeyPath'

function finitePos(position: readonly number[]): [number, number, number] {
  return position.length === 3 && position.every(Number.isFinite) ? position as [number, number, number] : [0, 0, 0]
}

const journeyCameraPositions = [
  new THREE.Vector3(-0.45, .05, 5.2),
  new THREE.Vector3(-0.35, .08, 5.0),
  new THREE.Vector3(-0.1,  .2,  4.75),
  new THREE.Vector3(0.15, .35,  4.5),
  new THREE.Vector3(0.5,  .55,  4.2),
  new THREE.Vector3(0.9,  .7,   4.0),
]
const journeyCameraTargets = [
  new THREE.Vector3(-2.5, -.8,  -2.5),
  new THREE.Vector3(-1.5, -.4,  -1.5),
  new THREE.Vector3(-.4,  .1,   -.2),
  new THREE.Vector3(.3,   .5,   .6),
  new THREE.Vector3(1.0,  .9,   1.4),
  new THREE.Vector3(2.0,  1.1,  2.5),
]
const camPosCurve = new THREE.CatmullRomCurve3(journeyCameraPositions, false, 'catmullrom', .5)
const camTgtCurve = new THREE.CatmullRomCurve3(journeyCameraTargets,   false, 'catmullrom', .5)

function smoothstep(t: number) { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

export function sampleJourneyCameraProgress(progress: number) {
  const t = smoothstep(Math.min(1, Math.max(0, progress)))
  const pos = camPosCurve.getPoint(t)
  const tgt = camTgtCurve.getPoint(t)
  return {
    position: [pos.x, pos.y, pos.z] as [number, number, number],
    target:   [tgt.x, tgt.y, tgt.z] as [number, number, number],
  }
}

interface JourneyScrollProps {
  waypoints: JourneyWaypoint[]
  progress: number
  visible: boolean
}

export function JourneyScrollFlight({ waypoints, progress, visible }: JourneyScrollProps) {
  const group = useRef<THREE.Group>(null)
  const points = useMemo(() => waypoints.map(w => new THREE.Vector3(...finitePos(w.position))), [waypoints])
  const curve  = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const trail  = useMemo(() => curve.getPoints(100), [curve])
  const p = Math.min(1, Math.max(0, progress))
  const trailEnd = Math.floor(p * 100)

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = -.14
  })

  if (!visible) return null

  const visiblePoints = trail.slice(0, Math.max(2, trailEnd + 1))
  const recentPoints  = trail.slice(Math.max(0, trailEnd - 18), trailEnd + 1)

  return <group ref={group}>
    {visiblePoints.length >= 2 && <Line points={visiblePoints} color="#00d4ff" transparent opacity={.24} lineWidth={1.2} />}
    {recentPoints.length >= 2 && <Line points={recentPoints} color="#9cefff" transparent opacity={.65} lineWidth={1} />}
    {waypoints.map((waypoint, index) => {
      const frac = index / (waypoints.length - 1)
      const revealed = p > frac - 0.05
      if (!revealed) return null
      const pos = finitePos(waypoint.position)
      const size = waypoint.milestone ? .09 + waypoint.people / 9000 : .034 + waypoint.people / 30000
      const nodeOpacity = Math.min(1, (p - (frac - 0.05)) / 0.06)
      return <group key={waypoint.year} position={pos}>
        <mesh>
          <sphereGeometry args={[size, 14, 14]} />
          <meshBasicMaterial color={waypoint.inflection ? '#eaffff' : '#00c8f5'} transparent opacity={nodeOpacity} toneMapped={false} />
        </mesh>
        {waypoint.inflection && <pointLight color="#47dbff" intensity={1.0 * nodeOpacity} distance={3.0} />}
        {index > 4 && <mesh position={[0, 0, -.05]}>
          <sphereGeometry args={[size * 2.4, 8, 8]} />
          <meshBasicMaterial color="#168ac2" transparent opacity={(.025 + index * .005) * nodeOpacity} depthWrite={false} />
        </mesh>}
      </group>
    })}
  </group>
}
