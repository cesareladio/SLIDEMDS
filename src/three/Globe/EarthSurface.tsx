import { useMemo } from 'react'
import * as THREE from 'three'
import { earthFragmentShader, earthVertexShader } from './earthShaders'
import type { EarthTextureSet } from './useEarthTextures'

export function EarthSurface({ textures, radius = 2.45 }: { textures: EarthTextureSet | null; radius?: number }) {
  // sun position: 45° above equator on the Americas side = gives volume on SA, partial night
  const sunDirection = useMemo(() => new THREE.Vector3(3.2, 1.8, 4.5).normalize(), [])

  const uniforms = useMemo(() => ({
    dayMap:       { value: textures?.day     ?? null },
    nightMap:     { value: textures?.night   ?? null },
    specularMap:  { value: textures?.specular ?? null },
    normalMap:    { value: textures?.normal  ?? null },
    sunDirection: { value: sunDirection },
    nightIntensity: { value: 1.6 },
    exposure:     { value: 1.05 },
  }), [textures, sunDirection])

  if (!textures) {
    return <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial color="#0b2143" emissive="#04162f" emissiveIntensity={.55} roughness={.85} metalness={.15} />
    </mesh>
  }

  return <mesh>
    <sphereGeometry args={[radius, 128, 128]} />
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={earthVertexShader}
      fragmentShader={earthFragmentShader}
      lights={false}
    />
  </mesh>
}
