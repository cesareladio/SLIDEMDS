import { Sparkles } from '@react-three/drei'
export function AmbientParticles({ intensity = 1 }: { intensity?: number }) {
  return <Sparkles count={Math.round(280 * intensity)} scale={[13, 8, 9]} size={1.2} speed={.16} opacity={.45} color="#54c9ff" />
}
