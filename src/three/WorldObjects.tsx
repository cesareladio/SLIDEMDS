import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'
import { capabilities } from '../data/capabilities'
import { history } from '../data/history'

function Constellation({ visible }: { visible: boolean }) {
  const nodes = useMemo(() => capabilities.peru.map((capability, index) => {
    const angle = index / capabilities.peru.length * Math.PI * 2
    return { ...capability, position: new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 1.8, Math.sin(angle * 2) * .5) }
  }), [])
  if (!visible) return null
  return <group>
    {nodes.map((node, index) => <group key={node.id}>
      <Line points={[[0, 0, 0], node.position]} color="#168ac2" transparent opacity={.22} lineWidth={1} />
      <Float speed={1 + index * .08} rotationIntensity={.12} floatIntensity={.2}>
        <group position={node.position}>
          <mesh><icosahedronGeometry args={[.13 + node.value / 1800, 2]} /><meshBasicMaterial color={index < 3 ? '#00d4ff' : '#0878d2'} toneMapped={false} /></mesh>
          <mesh scale={1.6}><sphereGeometry args={[.15 + node.value / 1800, 16, 16]} /><meshBasicMaterial color="#00a6ff" transparent opacity={.08} /></mesh>
        </group>
      </Float>
    </group>)}
  </group>
}

const segments: Record<string, number[]> = {
  '0': [0, 1, 2, 3, 4, 5], '4': [1, 2, 5, 6], '5': [0, 1, 3, 4, 6],
}
const lines = [
  [[-.35, .72], [.35, .72]], [[-.35, .72], [-.35, 0]], [[.35, .72], [.35, 0]],
  [[-.35, -.72], [.35, -.72]], [[-.35, 0], [-.35, -.72]], [[.35, 0], [.35, -.72]], [[-.35, 0], [.35, 0]],
]

function numberPoints(text: string, total = 1600) {
  let seed = 107
  const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646
  const active = text.split('').flatMap((digit, digitIndex) => (segments[digit] ?? []).map(segment => ({ segment, digitIndex })))
  const positions = new Float32Array(total * 3)
  for (let i = 0; i < total; i++) {
    const item = active[i % active.length]
    const [[x1, y1], [x2, y2]] = lines[item.segment]
    const t = random()
    positions[i * 3] = (item.digitIndex - (text.length - 1) / 2) * 1.05 + x1 + (x2 - x1) * t + (random() - .5) * .035
    positions[i * 3 + 1] = y1 + (y2 - y1) * t + (random() - .5) * .035
    positions[i * 3 + 2] = (random() - .5) * .12
  }
  return positions
}

function AIParticles({ visible }: { visible: boolean }) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => numberPoints('4000'), [])
  useFrame(state => {
    if (!points.current || !visible) return
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * .25) * .08
    const material = points.current.material as THREE.PointsMaterial
    material.opacity = .72 + Math.sin(state.clock.elapsedTime * 1.4) * .16
  })
  if (!visible) return null
  return <points ref={points} position={[0, .3, 0]} scale={1.15}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial size={.035} color="#35dfff" transparent opacity={.85} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </points>
}

function Journey({ visible }: { visible: boolean }) {
  const points = useMemo(() => history.map((item, index) => new THREE.Vector3((index - 5) * .72, (item.people / 1417 - .5) * 2.7, Math.sin(index * .7) * .5)), [])
  if (!visible) return null
  return <group rotation={[0, -.18, 0]}>
    <Line points={points} color="#00d4ff" lineWidth={2.2} transparent opacity={.8} />
    {points.map((point, index) => <mesh key={history[index].year} position={point}>
      <sphereGeometry args={[history[index].milestone ? .1 : .045, 16, 16]} />
      <meshBasicMaterial color={history[index].inflection ? '#fff' : '#00a6ff'} toneMapped={false} />
    </mesh>)}
  </group>
}

function Future({ visible }: { visible: boolean }) {
  const portals = [[-2.7, 1.2, 0], [0, -.9, .4], [2.8, 1, -.2]] as [number, number, number][]
  if (!visible) return null
  return <group>{portals.map((position, index) => <group position={position} key={index}>
    <mesh rotation={[0, 0, index * .2]}><torusGeometry args={[.72, .025, 10, 80]} /><meshBasicMaterial color={index === 1 ? '#fff' : '#00a6ff'} transparent opacity={.8} toneMapped={false} /></mesh>
    <mesh><circleGeometry args={[.66, 64]} /><meshBasicMaterial color="#0072ce" transparent opacity={.035} side={THREE.DoubleSide} /></mesh>
  </group>)}</group>
}

export function WorldObjects({ scene }: { scene: number }) {
  return <><Constellation visible={scene === 3} /><AIParticles visible={scene === 4} /><Journey visible={scene === 5} /><Future visible={scene === 6} /></>
}
