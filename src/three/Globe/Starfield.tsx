import { useMemo } from 'react'
import * as THREE from 'three'

function finite(value: number) { return Number.isFinite(value) ? value : 0 }

export function Starfield({ count = 700, radius = 42 }: { count?: number; radius?: number }) {
  const positions = useMemo(() => {
    let seed = 4271
    const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646
    const output = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      const r = radius * (0.7 + random() * 0.3)
      output[i * 3] = finite(r * Math.sin(phi) * Math.cos(theta))
      output[i * 3 + 1] = finite(r * Math.cos(phi))
      output[i * 3 + 2] = finite(r * Math.sin(phi) * Math.sin(theta))
    }
    return output
  }, [count, radius])

  return <points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial size={.028} color="#cfe9ff" transparent opacity={.4} depthWrite={false} sizeAttenuation />
  </points>
}
