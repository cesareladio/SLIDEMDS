import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { JourneyWaypoint } from '../data/journeyPath'

function finitePos(position: readonly number[]): [number, number, number] { return position.length === 3 && position.every(Number.isFinite) ? position as [number, number, number] : [0, 0, 0] }
const smoothstep = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

const journeyCameraPositions = [new THREE.Vector3(-.45,.05,5.2), new THREE.Vector3(-.35,.08,5), new THREE.Vector3(-.1,.2,4.75), new THREE.Vector3(.15,.35,4.5), new THREE.Vector3(.5,.55,4.2), new THREE.Vector3(.9,.7,4)]
const journeyCameraTargets = [new THREE.Vector3(-2.5,-.8,-2.5), new THREE.Vector3(-1.5,-.4,-1.5), new THREE.Vector3(-.4,.1,-.2), new THREE.Vector3(.3,.5,.6), new THREE.Vector3(1,.9,1.4), new THREE.Vector3(2,1.1,2.5)]
const camPosCurve = new THREE.CatmullRomCurve3(journeyCameraPositions, false, 'catmullrom', .5)
const camTgtCurve = new THREE.CatmullRomCurve3(journeyCameraTargets, false, 'catmullrom', .5)

export function sampleJourneyCameraProgress(progress: number) {
  const t = smoothstep(Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)))
  const pos = camPosCurve.getPoint(t); const tgt = camTgtCurve.getPoint(t)
  return { position: [pos.x, pos.y, pos.z] as [number,number,number], target: [tgt.x,tgt.y,tgt.z] as [number,number,number] }
}

function seededUnit(index: number, axis: number) { return Math.sin(index * (axis === 0 ? 12.9898 : axis === 1 ? 78.233 : 37.719) + axis * 19.19) }
function particlePositions(points: THREE.Vector3[], count: number) {
  const output = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(count - 1, 1)
    const point = points[Math.min(points.length - 1, Math.floor(t * (points.length - 1)))]
    const radius = .08 + (i % 7) * .025
    output[i * 3] = point.x + seededUnit(i, 0) * radius
    output[i * 3 + 1] = point.y + seededUnit(i, 1) * radius
    output[i * 3 + 2] = point.z + seededUnit(i, 2) * radius
  }
  return output
}

function connectionPoints(points: THREE.Vector3[]) {
  const result: THREE.Vector3[][] = []
  for (let i = 4; i < points.length; i++) {
    const from = points[i]
    const to = points[Math.max(0, i - 3)]
    result.push([from, from.clone().lerp(to, .45).add(new THREE.Vector3(0, .28, .12)), to])
  }
  return result
}

export function JourneyScrollFlight({ waypoints, progress, visible, opacity = 1 }: { waypoints: JourneyWaypoint[]; progress: number; visible: boolean; opacity?: number }) {
  const points = useMemo(() => waypoints.map(w => new THREE.Vector3(...finitePos(w.position))), [waypoints])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const trail = useMemo(() => curve.getPoints(120), [curve])
  const particles = useMemo(() => particlePositions(trail, 420), [trail])
  const connections = useMemo(() => connectionPoints(points), [points])
  if (!visible) return null

  const p = Math.min(1, Math.max(0, progress)); const end = Math.floor(p * (trail.length - 1))
  const visibleTrail = trail.slice(0, Math.max(2, end + 1)); const recent = trail.slice(Math.max(0, end - 22), end + 1)
  const particleReveal = Math.min(1, Math.max(0, (p - .28) / .72)) * opacity
  const networkReveal = Math.min(1, Math.max(0, (p - .44) / .5)) * opacity

  return <group rotation={[0, -.14, 0]}>
    {visibleTrail.length > 1 && <Line points={visibleTrail} color="#00d4ff" transparent opacity={.23 * opacity} lineWidth={1.2} />}
    {recent.length > 1 && <Line points={recent} color="#9cefff" transparent opacity={.65 * opacity} lineWidth={1} />}
    {particleReveal > .01 && <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry><pointsMaterial size={.035} color="#39dfff" transparent opacity={particleReveal * .52} depthWrite={false} /></points>}
    {connections.map((connection, index) => {
      const revealAt = (index + 4) / (waypoints.length - 1)
      return p >= revealAt && <Line key={index} points={connection} color="#36bdeb" transparent opacity={networkReveal * .16} lineWidth={.65} />
    })}
    {waypoints.map((waypoint, index) => {
      const frac = index / (waypoints.length - 1); const nodeOpacity = Math.min(1, Math.max(0, (p - (frac - .05)) / .06)) * opacity
      if (nodeOpacity <= .01) return null
      const position = finitePos(waypoint.position); const size = (waypoint.milestone ? .09 + waypoint.people / 9000 : .034 + waypoint.people / 30000) * .74
      return <group key={waypoint.year} position={position}>
        <mesh><sphereGeometry args={[size, 14, 14]} /><meshBasicMaterial color={waypoint.inflection ? '#eaffff' : '#00c8f5'} transparent opacity={nodeOpacity} toneMapped={false} /></mesh>
        {waypoint.inflection && <pointLight color="#47dbff" intensity={nodeOpacity} distance={3} />}
        {index > 4 && <mesh position={[0,0,-.05]}><sphereGeometry args={[size * 2.4, 8, 8]} /><meshBasicMaterial color="#168ac2" transparent opacity={(.025 + index * .005) * nodeOpacity} depthWrite={false} /></mesh>}
      </group>
    })}
  </group>
}
