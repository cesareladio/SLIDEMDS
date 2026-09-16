import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { countryPolygon } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'
import { latLonToVector3 } from './geo'

function createSurfaceGeometry(country: CountryId) {
  const polygon = countryPolygon(country)
  const ring = polygon.slice(0, -1) // remove closing duplicate

  // 2D projection for triangulation (Mercator-like, fine for country-level)
  const pts2d = ring.map(([lon, lat]) => new THREE.Vector2(lon, lat))
  const holes: THREE.Vector2[][] = []

  // Three.js built-in triangulation
  const indices = THREE.ShapeUtils.triangulateShape(pts2d, holes)

  // Lift projected vertices back to sphere
  const positions: number[] = []
  const normals: number[] = []
  const RADIUS = 2.478

  for (const [i0, i1, i2] of indices) {
    for (const i of [i0, i1, i2]) {
      const [lon, lat] = ring[i]
      const v = latLonToVector3(lat, lon, RADIUS)
      positions.push(v.x, v.y, v.z)
      const n = v.clone().normalize()
      normals.push(n.x, n.y, n.z)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3))
  return geometry
}

export function CountrySurfaceHighlight({ country, visible, intensity }: { country: CountryId; visible: boolean; intensity: number }) {
  const surface = useMemo(() => createSurfaceGeometry(country), [country])
  const outline = useMemo(() => countryPolygon(country).map(([lon, lat]) => latLonToVector3(lat, lon, 2.492)), [country])
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
    <Line points={outline} color="#d0f5ff" transparent opacity={opacity * .88} lineWidth={1.25} renderOrder={3} />
  </group>
}
