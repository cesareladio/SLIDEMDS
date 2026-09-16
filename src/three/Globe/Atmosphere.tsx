import { useMemo } from 'react'
import * as THREE from 'three'
import { atmosphereFragmentShader, atmosphereVertexShader } from './earthShaders'

export function Atmosphere({ radius = 2.45 }: { radius?: number }) {
  const uniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color('#3db8e8') },
    intensity:  { value: 0.52 },
  }), [])
  return <mesh scale={1.028} renderOrder={2}>
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
