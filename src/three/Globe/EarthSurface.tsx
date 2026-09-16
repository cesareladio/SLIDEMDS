import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { earthFragmentShader, earthVertexShader } from './earthShaders'
import type { EarthTextureSet } from './useEarthTextures'

export function EarthSurface({ textures, radius = 2.45 }: { textures: EarthTextureSet | null; radius?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const sunDirection = useMemo(() => new THREE.Vector3(4, 1.4, 6).normalize(), [])
  const uniforms = useMemo(() => ({
    dayMap: { value: textures?.day ?? null },
    nightMap: { value: textures?.night ?? null },
    specularMap: { value: textures?.specular ?? null },
    normalMap: { value: textures?.normal ?? null },
    sunDirection: { value: sunDirection },
    nightIntensity: { value: 1.4 },
  }), [textures, sunDirection])

  useFrame(() => {
    if (material.current) material.current.uniformsNeedUpdate = true
  })

  if (!textures) {
    return <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial color="#0b2143" emissive="#04162f" emissiveIntensity={.55} roughness={.85} metalness={.15} />
    </mesh>
  }

  return <mesh>
    <sphereGeometry args={[radius, 96, 96]} />
    <shaderMaterial
      ref={material}
      uniforms={uniforms}
      vertexShader={earthVertexShader}
      fragmentShader={earthFragmentShader}
      lights={false}
    />
  </mesh>
}
