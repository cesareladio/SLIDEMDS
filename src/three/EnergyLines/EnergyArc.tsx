import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

export function EnergyArc({ from, to, visible = true }: { from: THREE.Vector3; to: THREE.Vector3; visible?: boolean }) {
  const points = useMemo(() => {
    const middle = from.clone().add(to).multiplyScalar(.5).normalize().multiplyScalar(3.1)
    const curve = new THREE.QuadraticBezierCurve3(from, middle, to)
    return curve.getPoints(48)
  }, [from, to])
  if (!visible) return null
  return <group>
    <Line points={points} color="#00d4ff" transparent opacity={.08} lineWidth={3} />
    <Line points={points} color="#8cecff" transparent opacity={.55} lineWidth={.8} dashed dashScale={1.4} dashSize={.1} gapSize={.22} />
  </group>
}
