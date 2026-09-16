import { useMemo } from 'react'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'
import { capabilityNodes, finitePosition, type CapabilityFocus } from '../data/capabilityConstellation'
import { AIParticleMorph } from './AIParticleMorph'
import { JourneyFlight } from './JourneyFlight'
import { IBIOLNetwork } from './IBIOLNetwork'
import type { IBIOLPhase } from '../data/ibiol'

function CapabilityConstellation({ focus }: { focus: CapabilityFocus }) {
  const nodes = useMemo(() => capabilityNodes.map(node => ({ ...node, position: finitePosition(node.position) })), [])
  const selected = nodes.find(node => node.focus === focus)
  return <group>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[.08, 16, 16]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} /></mesh>
    {nodes.map((node, index) => {
      const active = node.focus === focus
      const emphasized = focus === 'overview' || active
      const opacity = focus === 'overview' ? .23 : active ? .72 : .055
      const position = node.position
      return <group key={node.id}>
        <Line points={[[0, 0, 0], position]} color={active ? '#9ff5ff' : '#168ac2'} transparent opacity={opacity} lineWidth={active ? 1.8 : 1} />
        {active && selected && <Line points={[position, [position[0] + .55, position[1] + .18, position[2] + .28]]} color="#d8fbff" transparent opacity={.42} lineWidth={1} />}
        <Float speed={.65 + index * .06} rotationIntensity={emphasized ? .16 : .04} floatIntensity={emphasized ? .2 : .04}>
          <group position={position} scale={active ? 1.34 : 1}>
            <mesh><icosahedronGeometry args={[.1 + node.value / 2100, 2]} /><meshBasicMaterial color={active || (focus === 'overview' && index < 3) ? '#00d4ff' : '#0878d2'} toneMapped={false} transparent opacity={focus === 'overview' || active ? 1 : .32} /></mesh>
            <mesh scale={1.7}><sphereGeometry args={[.14 + node.value / 2100, 16, 16]} /><meshBasicMaterial color="#00a6ff" transparent opacity={active ? .2 : focus === 'overview' ? .075 : .018} depthWrite={false} /></mesh>
          </group>
        </Float>
      </group>
    })}
  </group>
}

export function WorldObjects({ scene, capabilityFocus = 'overview', onAIPhase, ibiolPhase = 'today' }: { scene: number; capabilityFocus?: CapabilityFocus; onAIPhase?: (phase: 'certifications' | 'gh300' | 'concepts') => void; ibiolPhase?: IBIOLPhase }) {
  return <>
    {scene === 3 && <CapabilityConstellation focus={capabilityFocus} />}
    <AIParticleMorph visible={scene === 4} onPhase={onAIPhase} />
    <JourneyFlight visible={scene === 5} />
    <IBIOLNetwork visible={scene === 6} phase={ibiolPhase} />
  </>
}
