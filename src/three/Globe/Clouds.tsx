import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { EarthTextureSet } from './useEarthTextures'

export function Clouds({ textures, radius = 2.45 }: { textures: EarthTextureSet | null; radius?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.0018
  })
  if (!textures) return null
  return <mesh ref={mesh} scale={1.012}>
    <sphereGeometry args={[radius, 72, 72]} />
    <meshStandardMaterial map={textures.clouds} transparent opacity={.42} depthWrite={false} roughness={1} />
  </mesh>
}
