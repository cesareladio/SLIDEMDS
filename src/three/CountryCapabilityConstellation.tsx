import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { capabilityNodes, finitePosition } from '../data/capabilityConstellation'
import type { Capability } from '../data/types'

interface Props {
  capabilities: Capability[]
  progress: number
  visible: boolean
}

export function CountryCapabilityConstellation({ capabilities, progress, visible }: Props) {
  const nodes = useMemo(() => {
    // Map provided capabilities to the spatial positions from capabilityNodes by id match, fallback to spread layout
    return capabilities.map((cap, index) => {
      const match = capabilityNodes.find(n => n.id === cap.id)
      const position = match ? finitePosition(match.position) : (
        (() => {
          const angle = (index / capabilities.length) * Math.PI * 2
          return finitePosition([Math.cos(angle) * 2.2, Math.sin(angle) * 1.5, Math.sin(angle * 1.5) * 0.7])
        })()
      )
      return { ...cap, position }
    })
  }, [capabilities])

  const max = useMemo(() => Math.max(...nodes.map(n => n.value), 1), [nodes])

  if (!visible) return null

  return <group>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[.07, 14, 14]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} transparent opacity={Math.min(1, progress * 4)} /></mesh>
    {nodes.map((node, index) => {
      const frac = index / nodes.length
      const revealP = Math.min(1, Math.max(0, (progress - frac * 0.6) / 0.15))
      const size = .08 + node.value / 2200
      return <group key={node.id}>
        <Line
          points={[[0, 0, 0], node.position]}
          color="#168ac2"
          transparent
          opacity={revealP * 0.22}
          lineWidth={1}
        />
        <group position={node.position}>
          <mesh>
            <icosahedronGeometry args={[size, 2]} />
            <meshBasicMaterial color={index < 3 ? '#00d4ff' : '#0878d2'} toneMapped={false} transparent opacity={revealP} />
          </mesh>
          <mesh scale={1.7}>
            <sphereGeometry args={[size, 14, 14]} />
            <meshBasicMaterial color="#00a6ff" transparent opacity={revealP * 0.07} depthWrite={false} />
          </mesh>
        </group>
      </group>
    })}
  </group>
}
