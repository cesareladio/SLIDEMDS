import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { latLonToVector3 } from './geo'

const peruTerritories = [
  { label: 'Piura',       people: 91,  lat: -5.19,  lon: -80.63, side: 'left'  as const, kind: 'territory' as const },
  { label: 'Lambayeque',  people: 103, lat: -6.77,  lon: -79.84, side: 'left'  as const, kind: 'territory' as const },
  { label: 'La Libertad', people: 509, lat: -8.11,  lon: -79.03, side: 'left'  as const, kind: 'territory' as const },
  { label: 'Lima',        people: 192, lat: -12.05, lon: -77.04, side: 'left'  as const, kind: 'territory' as const },
  { label: 'Ica',         people: 62,  lat: -14.07, lon: -75.73, side: 'left'  as const, kind: 'territory' as const },
  { label: 'Arequipa',    people: 210, lat: -16.40, lon: -71.54, side: 'right' as const, kind: 'territory' as const },
  { label: 'Trujillo',    people: 1048, lat: -8.11,  lon: -79.03, side: 'right' as const, kind: 'hub' as const },
  { label: 'ArequipaHub', people: 360,  lat: -16.40, lon: -71.54, side: 'right' as const, kind: 'hub' as const },
] as const

const TOP3 = new Set(['La Libertad', 'Arequipa', 'Lima'])

// Anchor sphere sits on Earth surface
const ANCHOR_RADIUS = 2.52
// 3–4px dot: radius ~0.008 world units
const DOT_SIZE = 0.008
// Leader line offset from point to text in world units
const LEADER_LEN = 0.22

export interface PeruAnchorPoint {
  label: string
  people: number
  world: THREE.Vector3
  isTop3: boolean
  side: 'left' | 'right'
  kind: 'territory' | 'hub' | 'presence'
}

interface PeruTerritorialAnchorsProps {
  opacity?: number
  show?: boolean
  sceneProgress?: number
  onUpdate?: (points: PeruAnchorPoint[]) => void
}

export function PeruTerritorialAnchors({
  opacity = 1,
  show = true,
  sceneProgress = 0,
  onUpdate,
}: PeruTerritorialAnchorsProps) {
  const anchors = useMemo(() => {
    return peruTerritories.map(t => ({
      label: t.label,
      people: t.people,
      world: latLonToVector3(t.lat, t.lon, ANCHOR_RADIUS),
      isTop3: TOP3.has(t.label),
      side: t.side,
      kind: t.kind,
    }))
  }, [])

  useEffect(() => {
    if (!show || !onUpdate) return
    onUpdate(anchors)
  }, [show, onUpdate, anchors])

  if (!show) return null

  const scene03 = sceneProgress < .14
  const scene04 = sceneProgress >= .14 && sceneProgress < .34

  const visibleAnchors = useMemo(() => {
    if (scene03) {
      // Scene 03: show hub callouts + subtle territorial presence (no La Libertad label)
      return anchors.map(a => {
        if (a.kind === 'hub') return a
        if (a.label === 'La Libertad') {
          return { ...a, kind: 'presence', isTop3: false }
        }
        if (['Piura','Lambayeque','Lima','Ica'].includes(a.label)) {
          return { ...a, kind: 'presence', isTop3: false }
        }
        return { ...a, kind: 'presence', isTop3: false }
      })
    }
    if (scene04) {
      // Scene 04: full territorial footprint (no hub magnitudes)
      return anchors.filter(a => a.kind === 'territory')
    }
    // Scene 05+: hide all territorial marks
    return [] as PeruAnchorPoint[]
  }, [anchors, scene03, scene04])

  if (!visibleAnchors.length) return null

  return <group>
    {visibleAnchors.map(a => {
      const isHub = a.kind === 'hub'
      const isPresence = a.kind === 'presence'
      const radius = isHub ? DOT_SIZE * 1.4 : DOT_SIZE * 0.8
      const color = a.isTop3 && scene04 ? '#bdf3ff' : '#7fd2e6'
      const alpha = scene04
        ? (a.isTop3 ? opacity : opacity * .5)
        : (isHub ? opacity : opacity * .45)

      return (
        <mesh key={`${a.label}-${a.kind}`} position={a.world}>
          <sphereGeometry args={[radius, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={alpha} toneMapped={false} />
        </mesh>
      )
    })}
  </group>
}
