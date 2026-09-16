import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { getCountryRings } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'
import { latLonToVector3 } from './geo'

const RADIUS = 2.478
const OUTLINE_RADIUS = 2.492

function createSurfaceGeometry(country: CountryId) {
  const rings = getCountryRings(country)
  const positions: number[] = []
  const normals: number[] = []

  for (const ring of rings) {
    const closedRing = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring
    if (closedRing.length < 3) continue

    const pts2d = closedRing.map(([lon, lat]) => new THREE.Vector2(lon, lat))
    const indices = THREE.ShapeUtils.triangulateShape(pts2d, [])

    for (const [i0, i1, i2] of indices) {
      for (const i of [i0, i1, i2]) {
        const [lon, lat] = closedRing[i]
        const v = latLonToVector3(lat, lon, RADIUS)
        positions.push(v.x, v.y, v.z)
        const n = v.clone().normalize()
        normals.push(n.x, n.y, n.z)
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  return geometry
}

function outlineRings(country: CountryId) {
  return getCountryRings(country).map(ring => ring.map(([lon, lat]) => latLonToVector3(lat, lon, OUTLINE_RADIUS)))
}

export function CountrySurfaceHighlight({ country, visible, intensity }: { country: CountryId; visible: boolean; intensity: number }) {
  const surface = useMemo(() => createSurfaceGeometry(country), [country])
  const outlines = useMemo(() => outlineRings(country), [country])
  const opacity = Number.isFinite(intensity) ? THREE.MathUtils.clamp(intensity, 0, 1) : 0

  if (!visible) return null
  return <group>
    <mesh geometry={surface} renderOrder={2}>
      <meshBasicMaterial
        color="#22aaee"
        transparent
        opacity={opacity * .18}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
    {outlines.map((points, index) => <Line key={index} points={points} color="#d0f5ff" transparent opacity={opacity * .88} lineWidth={1.25} renderOrder={3} />)}
  </group>
}
