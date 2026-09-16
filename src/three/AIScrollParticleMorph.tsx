import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { blend } from './particleMorphMath'

export type AIScrollPhase = 'sphere' | 'certifications' | 'gh300' | 'expanded'

const segments: Record<string, number[]> = { '0': [0, 1, 2, 3, 4, 5], '4': [1, 2, 5, 6], '5': [0, 1, 3, 4, 6], '3': [0, 1, 2, 3, 6] }
const digitLines: [number, number][][] = [[[ -.35, .72], [.35, .72]], [[-.35, .72], [-.35, 0]], [[.35, .72], [.35, 0]], [[-.35, -.72], [.35, -.72]], [[-.35, 0], [-.35, -.72]], [[.35, 0], [.35, -.72]], [[-.35, 0], [.35, 0]]]
const smoothstep = (value: number) => { const t = THREE.MathUtils.clamp(value, 0, 1); return t * t * (3 - 2 * t) }

function seeded(index: number, salt: number) { return Math.sin(index * (12.9898 + salt * 17.31) + salt * 41.7) }
function textTarget(text: string, total: number, spread = 1) {
  const pieces = text.split('').flatMap((character, index) => {
    if (character === '%') return [{ line: [[-.1, .2], [.1, .2]] as [number, number][], index }, { line: [[.22, .62], [.42, -.65]] as [number, number][], index }]
    return (segments[character] ?? []).map(segment => ({ line: digitLines[segment], index }))
  })
  const output = new Float32Array(total * 3)
  for (let i = 0; i < total; i++) {
    const piece = pieces[i % pieces.length]; const t = (seeded(i, 1) + 1) * .5
    const x = (piece.index - (text.length - 1) / 2) * 1.05 + piece.line[0][0] + (piece.line[1][0] - piece.line[0][0]) * t
    const y = piece.line[0][1] + (piece.line[1][1] - piece.line[0][1]) * t
    output[i * 3] = x * spread + seeded(i, 2) * .035; output[i * 3 + 1] = y * spread + seeded(i, 3) * .035; output[i * 3 + 2] = seeded(i, 4) * .18
  }
  return output
}
function sphereTarget(total: number) {
  const output = new Float32Array(total * 3); const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < total; i++) { const y = 1 - (i / (total - 1)) * 2; const r = Math.sqrt(Math.max(0, 1 - y * y)); const theta = golden * i; output[i * 3] = Math.cos(theta) * r * 2.15; output[i * 3 + 1] = y * 2.15; output[i * 3 + 2] = Math.sin(theta) * r * 2.15 }
  return output
}
function expandedTarget(total: number) { const output = new Float32Array(total * 3); for (let i = 0; i < total; i++) { const a = (seeded(i, 5) + 1) * Math.PI; const r = 1.4 + ((seeded(i, 6) + 1) * .5) * 2.7; output[i * 3] = Math.cos(a) * r; output[i * 3 + 1] = Math.sin(a) * r * .62; output[i * 3 + 2] = seeded(i, 7) * 1.2 } return output }

export function AIScrollParticleMorph({ progress, visible }: { progress: number; visible: boolean }) {
  const points = useRef<THREE.Points>(null)
  const { sphere, certifications, gh300, expanded, current } = useMemo(() => { const total = 2800; return { sphere: sphereTarget(total), certifications: textTarget('4000', total), gh300: textTarget('50%', total, .92), expanded: expandedTarget(total), current: new Float32Array(total * 3) } }, [])
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  useEffect(() => { if (!visible || !points.current) return; let from = sphere; let to = certifications; let local = p / .14; if (p > .14 && p <= .49) { from = certifications; to = gh300; local = (p - .14) / .35 } else if (p > .49 && p <= .82) { from = gh300; to = expanded; local = (p - .49) / .33 } else if (p > .82) { from = gh300; to = expanded; local = (p - .49) / .33 }; blend(from, to, local, current); const position = points.current.geometry.attributes.position as THREE.BufferAttribute; position.array.set(current); position.needsUpdate = true; points.current.rotation.y = p * .08; (points.current.material as THREE.PointsMaterial).opacity = p < .14 ? p / .14 : 1 }, [p, visible, sphere, certifications, gh300, expanded, current])
  if (!visible) return null
  return <points ref={points} position={[0, .2, 0]} scale={1.2}><bufferGeometry><bufferAttribute attach="attributes-position" args={[current, 3]} /></bufferGeometry><pointsMaterial size={.035} color="#35dfff" transparent opacity={.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></points>
}
