import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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
  { radius: 5.8, startAngle: -.4, endAngle: 2.4, tilt: [.22, .38, 0], offset: [-1.2, .5, -1.0], opacity: .09 },
  { radius: 7.8, startAngle: .9, endAngle: 4.4, tilt: [-.28, -.12, .18], offset: [2.4, -2.0, -2.8], opacity: .055 },
]

function buildArcPoints(radius: number, start: number, end: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * .84, start, end, false, 0)
  return curve.getPoints(88).map(p => new THREE.Vector3(p.x, p.y, 0))
}

function ArcTracer({ arc }: { arc: ArcConfig }) {
  const pointRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  const pts = useMemo(() => buildArcPoints(arc.radius, arc.startAngle, arc.endAngle), [arc])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts), [pts])
  useFrame((_, delta) => {
    if (!pointRef.current) return
    t.current = (t.current + delta * .045) % 1
    const pos = curve.getPoint(t.current)
    pointRef.current.position.copy(pos)
  })
  return <group position={arc.offset} rotation={arc.tilt}>
    <mesh ref={pointRef}><sphereGeometry args={[.028, 8, 8]} /><meshBasicMaterial color="#9ef3ff" transparent opacity={.72} toneMapped={false} /></mesh>
  </group>
}

export function OrbitArcs({ visible = true }: { visible?: boolean }) {
  const geometries = useMemo(() => arcs.map(a => buildArcPoints(a.radius, a.startAngle, a.endAngle)), [])
  if (!visible) return null
  return <group>
    {arcs.map((arc, i) => <group key={i} position={arc.offset} rotation={arc.tilt}>
      <Line points={geometries[i]} color="#7fd8ff" transparent opacity={arc.opacity} lineWidth={.8} />
    </group>)}
    <ArcTracer arc={arcs[0]} />
  </group>
}
