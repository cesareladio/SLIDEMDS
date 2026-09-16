import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { ibiol, finiteIBIOLPosition, type IBIOLPhase } from '../data/ibiol'

function NetworkNode({ position, active, size = .1 }: { position: [number, number, number]; active: boolean; size?: number }) {
  return <group position={finiteIBIOLPosition(position)}>
    <mesh><icosahedronGeometry args={[size, 2]} /><meshBasicMaterial color={active ? '#c6f8ff' : '#0878d2'} transparent opacity={active ? 1 : .22} toneMapped={false} /></mesh>
    <mesh scale={2.5}><sphereGeometry args={[size, 16, 16]} /><meshBasicMaterial color="#00d4ff" transparent opacity={active ? .1 : .018} depthWrite={false} /></mesh>
  </group>
}

export function IBIOLNetwork({ phase, visible }: { phase: IBIOLPhase; visible: boolean }) {
  if (!visible) return null
  const today = ibiol.todayCapabilities.map(item => finiteIBIOLPosition(item.position))
  const industries = ibiol.growthIndustries.map(item => finiteIBIOLPosition(item.position))
  const growth = ibiol.growthCapabilities.map(item => finiteIBIOLPosition(item.position))
  const expanded = phase !== 'today'
  const converged = phase === 'ask'
  return <group>
    <mesh position={[0, 0, 0]}><icosahedronGeometry args={[.18, 2]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
    <Line points={[[-1.15, .1, 0], [0, 0, 0], [1.15, -.1, 0]]} color="#75edff" transparent opacity={.4} lineWidth={1} />
    {today.map((position, index) => <group key={ibiol.todayCapabilities[index].label}><Line points={[[0, 0, 0], position]} color="#00bdec" transparent opacity={phase === 'today' ? .42 : .18} lineWidth={1} /><NetworkNode position={position} active={phase === 'today' || converged} size={.095} /></group>)}
    {expanded && industries.map((position, index) => <group key={ibiol.growthIndustries[index].label}><Line points={[[0, 0, 0], position]} color="#95f1ff" transparent opacity={phase === 'grow' ? .48 : .24} lineWidth={1} /><NetworkNode position={position} active={phase === 'grow' || converged} size={.13} /></group>)}
    {expanded && growth.map((position, index) => <group key={ibiol.growthCapabilities[index].label}><Line points={[[0, 0, 0], position]} color="#218cc5" transparent opacity={phase === 'grow' ? .35 : .2} lineWidth={1} /><NetworkNode position={position} active={phase === 'grow' || converged} size={.075} /></group>)}
    {converged && ibiol.asks.map((_, index) => { const angle = index / ibiol.asks.length * Math.PI * 2; const position: [number, number, number] = [Math.cos(angle) * 2.8, Math.sin(angle) * 1.5, Math.sin(angle * 2) * .8]; return <group key={index}><Line points={[position, [0, 0, 0]]} color="#d7faff" transparent opacity={.46} lineWidth={1.15} /><NetworkNode position={position} active size={.075} /></group> })}
  </group>
}
