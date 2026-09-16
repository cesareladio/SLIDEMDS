import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { ibiol, finiteIBIOLPosition } from '../data/ibiol'

export function IBIOLScrollNetwork({ progress, visible, opacity = 1 }: { progress: number; visible: boolean; opacity?: number }) {
  if (!visible) return null
  const p = Math.min(1, Math.max(0, progress))
  const finalFade = p > .84 ? 1 - (p - .84) / .16 : 1
  opacity *= Math.max(0, Math.min(1, finalFade))
  const todayP = Math.min(1, p / .35)
  const growP = Math.min(1, Math.max(0, (p - .25) / .4))
  const askP = Math.min(1, Math.max(0, (p - .55) / .3))
  const positions = [...ibiol.todayCapabilities, ...ibiol.growthIndustries, ...ibiol.growthCapabilities].map(item => finiteIBIOLPosition(item.position))
  return <group>
    <mesh><icosahedronGeometry args={[.18, 2]} /><meshBasicMaterial color="#fff" transparent opacity={opacity} /></mesh>
    {ibiol.todayCapabilities.map((item, index) => { const pos = finiteIBIOLPosition(item.position); return <group key={item.label}><Line points={[[0,0,0], pos]} color="#00d4ff" transparent opacity={todayP * opacity * .42} lineWidth={1} /><mesh position={pos}><icosahedronGeometry args={[.095, 2]} /><meshBasicMaterial color="#bff8ff" transparent opacity={todayP * opacity} /></mesh><Html position={[pos[0] + .12, pos[1] + .12, pos[2]]} distanceFactor={8} style={{ opacity: todayP * opacity }} className="ibiol-node-label"><span>{item.label}</span></Html></group> })}
    {[...ibiol.growthIndustries, ...ibiol.growthCapabilities].map((item, index) => { const pos = finiteIBIOLPosition(item.position); const reveal = growP * opacity; return <group key={item.label}><Line points={[[0,0,0], pos]} color="#8defff" transparent opacity={reveal * .3} lineWidth={1} /><mesh position={pos}><icosahedronGeometry args={[index < 3 ? .12 : .075, 2]} /><meshBasicMaterial color={index < 3 ? '#dffcff' : '#37bde9'} transparent opacity={reveal} /></mesh><Html position={[pos[0] + .12, pos[1] + .12, pos[2]]} distanceFactor={8} style={{ opacity: reveal }} className="ibiol-node-label"><span>{item.label}</span></Html></group> })}
    {ibiol.asks.map((ask, index) => { const angle = index / ibiol.asks.length * Math.PI * 2; const pos: [number,number,number] = [Math.cos(angle) * 2.7, Math.sin(angle) * 1.45, Math.sin(angle * 2) * .7]; return <group key={ask}><Line points={[pos,[0,0,0]]} color="#d7faff" transparent opacity={askP * opacity * .35} lineWidth={1} /><mesh position={pos}><sphereGeometry args={[.07, 10, 10]} /><meshBasicMaterial color="#d7faff" transparent opacity={askP * opacity} /></mesh><Html position={pos} distanceFactor={8} style={{ opacity: askP * opacity }} className="ibiol-node-label"><span>{ask}</span></Html></group> })}
  </group>
}
