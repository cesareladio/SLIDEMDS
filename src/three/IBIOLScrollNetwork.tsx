import { Html, Line } from '@react-three/drei'
import { ibiol, finiteIBIOLPosition } from '../data/ibiol'
import { fadeWindow } from '../utils/scrollMotion'

// The network is offset to the right so it never invades the left-side
// editorial copy safe zone (left 7-10vw / width 32-38vw).
const NETWORK_OFFSET: [number, number, number] = [1.2, -.05, -.2]
const DIM_RESIDUAL = .1

export function IBIOLScrollNetwork({ progress, visible, opacity = 1 }: { progress: number; visible: boolean; opacity?: number }) {
  if (!visible) return null
  const p = Math.min(1, Math.max(0, progress))
  const finalFade = 1 - fadeWindow(p, .84, .91, 1, 1.02)
  const globalOpacity = opacity * Math.max(0, Math.min(1, finalFade))

  const todayWindow = fadeWindow(p, 0, .10, .30, .40)
  const growWindow = fadeWindow(p, .28, .40, .58, .68)
  const askWindow = fadeWindow(p, .58, .68, .84, .95)

  const todayMesh = Math.max(todayWindow, DIM_RESIDUAL) * globalOpacity
  const todayLabel = todayWindow * globalOpacity
  const growMesh = Math.max(growWindow, DIM_RESIDUAL) * globalOpacity
  const growLabel = growWindow * globalOpacity
  const askMesh = Math.max(askWindow, DIM_RESIDUAL * .6) * globalOpacity
  const askLabel = askWindow * globalOpacity

  return <group position={NETWORK_OFFSET}>
    <mesh><icosahedronGeometry args={[.18, 2]} /><meshBasicMaterial color="#fff" transparent opacity={globalOpacity} /></mesh>
    {ibiol.todayCapabilities.map(item => {
      const pos = finiteIBIOLPosition(item.position)
      return <group key={item.label}>
        <Line points={[[0, 0, 0], pos]} color="#00d4ff" transparent opacity={todayMesh * .42} lineWidth={1} />
        <mesh position={pos}><icosahedronGeometry args={[.095, 2]} /><meshBasicMaterial color="#bff8ff" transparent opacity={todayMesh} /></mesh>
        {todayLabel > .2 && <Html position={[pos[0] + .12, pos[1] + .12, pos[2]]} distanceFactor={8} style={{ opacity: todayLabel }} className="ibiol-node-label"><span>{item.label}</span></Html>}
      </group>
    })}
    {[...ibiol.growthIndustries, ...ibiol.growthCapabilities].map((item, index) => {
      const pos = finiteIBIOLPosition(item.position)
      const isRightEdge = item.label === 'Enterprise Platforms' || item.label === 'Insurance'
      const labelClass = `ibiol-node-label${isRightEdge ? ' ibiol-node-label--right' : ''}`
      return <group key={item.label}>
        <Line points={[[0, 0, 0], pos]} color="#8defff" transparent opacity={growMesh * .3} lineWidth={1} />
        <mesh position={pos}><icosahedronGeometry args={[index < 3 ? .12 : .075, 2]} /><meshBasicMaterial color={index < 3 ? '#dffcff' : '#37bde9'} transparent opacity={growMesh} /></mesh>
        {growLabel > .2 && <Html position={[pos[0] + .12, pos[1] + .12, pos[2]]} distanceFactor={8} style={{ opacity: growLabel }} className={labelClass}><span>{item.label}</span></Html>}
      </group>
    })}
    {ibiol.asks.map((ask, index) => {
      const angle = index / ibiol.asks.length * Math.PI * 2
      const pos: [number, number, number] = [Math.cos(angle) * 2.7, Math.sin(angle) * 1.45, Math.sin(angle * 2) * .7]
      return <group key={ask}>
        <Line points={[pos, [0, 0, 0]]} color="#d7faff" transparent opacity={askMesh * .35} lineWidth={1} />
        <mesh position={pos}><sphereGeometry args={[.07, 10, 10]} /><meshBasicMaterial color="#d7faff" transparent opacity={askMesh} /></mesh>
        {askLabel > .2 && <Html position={pos} distanceFactor={8} style={{ opacity: askLabel }} className="ibiol-node-label"><span>{ask}</span></Html>}
      </group>
    })}
  </group>
}
