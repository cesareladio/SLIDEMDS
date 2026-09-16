import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface ArcConfig {
  radius: number
  startAngle: number
  endAngle: number
  tilt: [number, number, number]
  offset: [number, number, number]
  opacity: number
}

const arcs: ArcConfig[] = [
  { radius: 4.6, startAngle: -.6, endAngle: 2.1, tilt: [.25, .4, 0], offset: [-1.4, .6, -1.2], opacity: .1 },
  { radius: 6.4, startAngle: .8, endAngle: 4.2, tilt: [-.35, -.15, .2], offset: [2.1, -1.8, -2.4], opacity: .07 },
  { radius: 3.4, startAngle: 1.4, endAngle: 3.6, tilt: [.5, .1, -.3], offset: [1.1, 1.6, .4], opacity: .09 },
]

function buildArcPoints(radius: number, start: number, end: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * .86, start, end, false, 0)
  return curve.getPoints(72).map(point => new THREE.Vector3(point.x, point.y, 0))
}

export function OrbitArcs({ visible = true }: { visible?: boolean }) {
  const geometries = useMemo(() => arcs.map(arc => buildArcPoints(arc.radius, arc.startAngle, arc.endAngle)), [])
  if (!visible) return null
  return <group>
    {arcs.map((arc, index) => <group key={index} position={arc.offset} rotation={arc.tilt}>
      <Line points={geometries[index]} color="#7fd8ff" transparent opacity={arc.opacity} lineWidth={1} />
    </group>)}
  </group>
}
