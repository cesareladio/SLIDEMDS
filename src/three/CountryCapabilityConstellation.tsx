import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { Capability } from '../data/types'
import { capabilityNodes, finitePosition } from '../data/capabilityConstellation'

interface Props { capabilities: Capability[]; progress: number; visible: boolean; opacity?: number }

// Atmospheric only: typography in CountrySuperpowers is the information hero.
const SAFE_AREA_SCALE = .76
const NODE_RADIUS_MIN = 0.012  // ~4–5px
const NODE_RADIUS_MAX = 0.018  // ~6px
const HALO_RADIUS = 0.024      // ~8px glow

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
    {/* Core hub node: reduced to a tiny premium point */}
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[NODE_RADIUS_MIN * 0.9, 10, 10]} />
      <meshBasicMaterial color="#e5fbff" toneMapped={false} transparent opacity={coreOpacity * .6} />
    </mesh>
    {nodes.map((node, index) => {
      const reveal = Math.min(1, Math.max(0, (progress - (index / nodes.length) * .6) / .15)) * opacity
      const t = Math.min(1, Math.max(0, node.value / 400))
      const radius = NODE_RADIUS_MIN + (NODE_RADIUS_MAX - NODE_RADIUS_MIN) * t
      return <group key={node.id}>
        {/* Subtle network line */}
        <Line
          points={[[0, 0, 0], node.position]}
          color="#5ddeff"
          transparent
          opacity={reveal * .12}
          lineWidth={0.45}
        />
        <group position={node.position}>
          {/* Micro-node: 4–6px solid dot */}
          <mesh>
            <sphereGeometry args={[radius, 10, 10]} />
            <meshBasicMaterial
              color={index < 3 ? '#00e6ff' : '#0b6fbf'}
              toneMapped={false}
              transparent
              opacity={reveal * .85}
            />
          </mesh>
          {/* Very soft 8px glow */}
          <mesh>
            <sphereGeometry args={[HALO_RADIUS, 10, 10]} />
            <meshBasicMaterial
              color="#00bfff"
              transparent
              opacity={reveal * .10}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    })}
  </group>
}
