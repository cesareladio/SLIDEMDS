import type { EarthTextureSet } from './useEarthTextures'

export function Clouds({ textures, radius = 2.45, opacity = 1 }: { textures: EarthTextureSet | null; radius?: number; opacity?: number }) {
  if (!textures) return null
  return <mesh scale={1.008} renderOrder={1}>
    <sphereGeometry args={[radius, 96, 96]} />
    <meshStandardMaterial map={textures.clouds} alphaMap={textures.clouds} transparent opacity={Math.min(1, Math.max(0, opacity)) * .55} depthWrite={false} roughness={1} metalness={0} />
  </mesh>
}
