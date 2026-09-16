import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { capabilityNodes, finitePosition } from '../data/capabilityConstellation'
import type { Capability } from '../data/types'

interface Props { capabilities: Capability[]; progress: number; visible: boolean; opacity?: number }

export function CountryCapabilityConstellation({ capabilities, progress, visible, opacity = 1 }: Props) {
  const nodes = useMemo(() => capabilities.map((cap, index) => {
    const match = capabilityNodes.find(node => node.id === cap.id)
    const position = match ? finitePosition(match.position) : (() => {
      const angle = index / capabilities.length * Math.PI * 2
      return finitePosition([Math.cos(angle) * 2.2, Math.sin(angle) * 1.5, Math.sin(angle * 1.5) * .7])
    })()
    return { ...cap, position }
  }), [capabilities])

  if (!visible) return null
  const p = Math.min(1, Math.max(0, progress)) * opacity

  return <group>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[.07, 14, 14]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} transparent opacity={Math.min(1, p * 4)} /></mesh>
    {nodes.map((node, index) => {
      const reveal = Math.min(1, Math.max(0, (progress - (index / nodes.length) * .6) / .15)) * opacity
      const size = .08 + node.value / 2200
      const labelPos: [number, number, number] = [node.position[0] + .12, node.position[1] + .14, node.position[2]]
      return <group key={node.id}>
        <Line points={[[0, 0, 0], node.position]} color="#168ac2" transparent opacity={reveal * .22} lineWidth={1} />
        <group position={node.position}>
          <mesh><icosahedronGeometry args={[size, 2]} /><meshBasicMaterial color={index < 3 ? '#00d4ff' : '#0878d2'} toneMapped={false} transparent opacity={reveal} /></mesh>
          <mesh scale={1.7}><sphereGeometry args={[size, 14, 14]} /><meshBasicMaterial color="#00a6ff" transparent opacity={reveal * .07} depthWrite={false} /></mesh>
        </group>
        {reveal > .02 && <Html position={labelPos} distanceFactor={8} style={{ opacity: reveal }} className="country-cap-label"><span>{node.label}</span><b>{node.value}</b></Html>}
      </group>
    })}
  </group>
}
