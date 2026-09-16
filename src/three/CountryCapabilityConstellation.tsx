import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { Capability } from '../data/types'
import { capabilityNodes, finitePosition } from '../data/capabilityConstellation'

interface Props { capabilities: Capability[]; progress: number; visible: boolean; opacity?: number }

// Atmospheric only: typography in CountrySuperpowers is the information hero.
const SAFE_AREA_SCALE = .76
const NODE_SCALE = .44
const HALO_SCALE = 1.3

export function CountryCapabilityConstellation({ capabilities, progress, visible, opacity = 1 }: Props) {
  const nodes = useMemo(() => capabilities.map((cap, index) => {
    const match = capabilityNodes.find(node => node.id === cap.id)
    const base = match ? finitePosition(match.position) : (() => {
      const angle = index / capabilities.length * Math.PI * 2
      return finitePosition([Math.cos(angle) * 2.2, Math.sin(angle) * 1.5, Math.sin(angle * 1.5) * .7])
    })()
    return { ...cap, position: [base[0] * SAFE_AREA_SCALE, base[1] * SAFE_AREA_SCALE, base[2] * SAFE_AREA_SCALE] as [number, number, number] }
  }), [capabilities])

  if (!visible) return null
  const coreOpacity = Math.min(1, Math.max(0, progress)) * opacity

  return <group position={[1.15, -.05, 0]} scale={.86}>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[.035, 12, 12]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} transparent opacity={coreOpacity * .5} /></mesh>
    {nodes.map((node, index) => {
      const reveal = Math.min(1, Math.max(0, (progress - (index / nodes.length) * .6) / .15)) * opacity
      const size = (.08 + node.value / 2200) * NODE_SCALE
      return <group key={node.id}>
        <Line points={[[0, 0, 0], node.position]} color="#168ac2" transparent opacity={reveal * .09} lineWidth={.65} />
        <group position={node.position}>
          <mesh><icosahedronGeometry args={[size, 1]} /><meshBasicMaterial color={index < 3 ? '#00d4ff' : '#0878d2'} toneMapped={false} transparent opacity={reveal * .5} /></mesh>
          <mesh scale={HALO_SCALE}><sphereGeometry args={[size, 10, 10]} /><meshBasicMaterial color="#00a6ff" transparent opacity={reveal * .018} depthWrite={false} /></mesh>
        </group>
      </group>
    })}
  </group>
}
