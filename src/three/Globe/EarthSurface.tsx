import { useMemo } from 'react'
import * as THREE from 'three'
import { earthFragmentShader, earthVertexShader } from './earthShaders'
import type { EarthTextureSet } from './useEarthTextures'

export function EarthSurface({ textures, radius = 2.45, opacity = 1 }: { textures: EarthTextureSet | null; radius?: number; opacity?: number }) {
  const sunDirection = useMemo(() => new THREE.Vector3(3.2, 1.8, 4.5).normalize(), [])
  const uniforms = useMemo(() => ({
    dayMap: { value: textures?.day ?? null }, nightMap: { value: textures?.night ?? null },
    specularMap: { value: textures?.specular ?? null }, normalMap: { value: textures?.normal ?? null },
    sunDirection: { value: sunDirection }, nightIntensity: { value: 1.6 }, exposure: { value: 1.05 }, opacity: { value: 1 },
  }), [textures, sunDirection])
  uniforms.opacity.value = Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : 1

  if (!textures) return <mesh><sphereGeometry args={[radius, 64, 64]} /><meshStandardMaterial color="#0b2143" emissive="#04162f" emissiveIntensity={.55} roughness={.85} metalness={.15} transparent opacity={uniforms.opacity.value} /></mesh>

  return <mesh>
    <sphereGeometry args={[radius, 128, 128]} />
    <shaderMaterial uniforms={uniforms} vertexShader={earthVertexShader} fragmentShader={earthFragmentShader} lights={false} transparent />
  </mesh>
}
