import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { EarthTextureSet } from './useEarthTextures'

export function Clouds({ textures, radius = 2.45 }: { textures: EarthTextureSet | null; radius?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.0008   // barely perceptible over 10 seconds
  })
  if (!textures) return null
  return <mesh ref={mesh} scale={1.008} renderOrder={1}>
    <sphereGeometry args={[radius, 96, 96]} />
    <meshStandardMaterial
      map={textures.clouds}
      alphaMap={textures.clouds}
      transparent
      opacity={0.55}
      depthWrite={false}
      roughness={1}
      metalness={0}
    />
  </mesh>
}
