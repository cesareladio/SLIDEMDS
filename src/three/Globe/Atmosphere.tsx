import { useMemo } from 'react'
import * as THREE from 'three'
import { atmosphereFragmentShader, atmosphereVertexShader } from './earthShaders'

export function Atmosphere({ radius = 2.45 }: { radius?: number }) {
  const uniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color('#5fd3ff') },
    intensity: { value: .85 },
  }), [])
  return <mesh scale={1.045}>
    <sphereGeometry args={[radius, 64, 64]} />
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={atmosphereVertexShader}
      fragmentShader={atmosphereFragmentShader}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      side={THREE.FrontSide}
    />
  </mesh>
}
