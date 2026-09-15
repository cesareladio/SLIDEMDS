import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'

export type AIParticlePhase = 'certifications' | 'gh300' | 'concepts'

const segments: Record<string, number[]> = { '0': [0, 1, 2, 3, 4, 5], '4': [1, 2, 5, 6], '5': [0, 1, 3, 4, 6], '3': [0, 1, 2, 3, 6] }
const digitLines: [number, number][][] = [[[ -.35, .72], [.35, .72]], [[-.35, .72], [-.35, 0]], [[.35, .72], [.35, 0]], [[-.35, -.72], [.35, -.72]], [[-.35, 0], [-.35, -.72]], [[.35, 0], [.35, -.72]], [[-.35, 0], [.35, 0]]]

function randomSource() {
  let seed = 7919
  return () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646
}

function finite(value: number) { return Number.isFinite(value) ? value : 0 }
function textTarget(text: string, total: number, spread = 1) {
  const random = randomSource()
  const pieces = text.split('').flatMap((character, index) => {
    if (character === '%') return [{ line: [[-.1, .2], [.1, .2]] as [number, number][], index }, { line: [[.22, .62], [.42, -.65]] as [number, number][], index }]
    if (character === '.') return [{ line: [[-.05, -.65], [.05, -.65]] as [number, number][], index }]
    return (segments[character] ?? []).map(segment => ({ line: digitLines[segment], index }))
  })
  const output = new Float32Array(total * 3)
  for (let i = 0; i < total; i++) {
    const piece = pieces[i % pieces.length]
    const start = piece.line[0]
    const end = piece.line[1]
    const t = random()
    const x = (piece.index - (text.length - 1) / 2) * 1.05 + start[0] + (end[0] - start[0]) * t
    const y = start[1] + (end[1] - start[1]) * t
    output[i * 3] = finite(x * spread + (random() - .5) * .035)
    output[i * 3 + 1] = finite(y * spread + (random() - .5) * .035)
    output[i * 3 + 2] = finite((random() - .5) * .35)
  }
  return output
}

function dispersedTarget(total: number) {
  const random = randomSource()
  const output = new Float32Array(total * 3)
  for (let i = 0; i < total * 3; i++) output[i] = finite((random() - .5) * (i % 3 === 2 ? 5.5 : 7))
  return output
}

function expandedTarget(total: number) {
  const random = randomSource()
  const output = new Float32Array(total * 3)
  for (let i = 0; i < total; i++) {
    const angle = random() * Math.PI * 2
    const radius = 1.4 + random() * 2.7
    output[i * 3] = finite(Math.cos(angle) * radius)
    output[i * 3 + 1] = finite(Math.sin(angle) * radius * .62)
    output[i * 3 + 2] = finite((random() - .5) * 2.4)
  }
  return output
}

function smoothstep(value: number) { const t = THREE.MathUtils.clamp(value, 0, 1); return t * t * (3 - 2 * t) }
function blend(a: Float32Array, b: Float32Array, amount: number, output: Float32Array) { const t = smoothstep(amount); for (let i = 0; i < output.length; i++) output[i] = finite(a[i] + (b[i] - a[i]) * t) }

export function AIParticleMorph({ visible, onPhase }: { visible: boolean; onPhase?: (phase: AIParticlePhase) => void }) {
  const points = useRef<THREE.Points>(null)
  const startedAt = useRef<number | null>(null)
  const elapsed = useRef(0)
  const { dispersed, certifications, gh300, expanded, current } = useMemo(() => {
    const total = 2800
    return { dispersed: dispersedTarget(total), certifications: textTarget('4000', total), gh300: textTarget('50%', total, .92), expanded: expandedTarget(total), current: new Float32Array(total * 3) }
  }, [])
  useEffect(() => {
    if (!visible) {
      startedAt.current = null
      elapsed.current = 0
    }
  }, [visible])
  useFrame(state => {
    if (!points.current || !visible) return
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    elapsed.current = state.clock.elapsedTime - startedAt.current
    const time = elapsed.current
    let phase: AIParticlePhase = 'certifications'
    if (time >= 7) phase = 'gh300'
    if (time >= 12) phase = 'concepts'
    onPhase?.(phase)
    if (time < 1.8) blend(dispersed, certifications, time / 1.8, current)
    else if (time < 5.2) certifications.forEach((value, index) => { current[index] = value })
    else if (time < 9.5) blend(certifications, gh300, (time - 5.2) / 4.3, current)
    else if (time < 12) gh300.forEach((value, index) => { current[index] = value })
    else blend(gh300, expanded, Math.min((time - 12) / 3, 1), current)
    const position = points.current.geometry.attributes.position as THREE.BufferAttribute
    position.array.set(current)
    position.needsUpdate = true
    points.current.rotation.y = Math.sin(time * .18) * .08
    points.current.rotation.x = Math.sin(time * .13) * .025
    const material = points.current.material as THREE.PointsMaterial
    material.opacity = .67 + Math.sin(time * 1.4) * .1
  })
  if (!visible) return null
  return <points ref={points} position={[0, .2, 0]} scale={1.2}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[current, 3]} /></bufferGeometry>
    <pointsMaterial size={.035} color="#35dfff" transparent opacity={.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </points>
}
