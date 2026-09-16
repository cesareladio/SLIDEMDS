import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { countryPolygon } from '../../data/countryGeo'
import type { CountryId } from '../../data/countryProfiles'
import { latLonToVector3 } from './geo'

function createSurfaceGeometry(country: CountryId) {
  const polygon = countryPolygon(country)
  const boundary = polygon.slice(0, -1).map(([lon, lat]) => latLonToVector3(lat, lon, 2.475))
  const center = boundary.reduce((sum, point) => sum.add(point), new THREE.Vector3()).normalize().multiplyScalar(2.475)
  const positions: number[] = []
  for (let index = 0; index < boundary.length; index++) {
    const next = boundary[(index + 1) % boundary.length]
    positions.push(center.x, center.y, center.z, boundary[index].x, boundary[index].y, boundary[index].z, next.x, next.y, next.z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

export function CountrySurfaceHighlight({ country, visible, intensity }: { country: CountryId; visible: boolean; intensity: number }) {
  const surface = useMemo(() => createSurfaceGeometry(country), [country])
  const outline = useMemo(() => countryPolygon(country).map(([lon, lat]) => latLonToVector3(lat, lon, 2.49)), [country])
  const opacity = Number.isFinite(intensity) ? THREE.MathUtils.clamp(intensity, 0, 1) : 0

  if (!visible) return null
  return <group>
    <mesh geometry={surface} renderOrder={2}>
      <meshBasicMaterial color="#008fd5" transparent opacity={opacity * .28} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
    <Line points={outline} color="#bdf7ff" transparent opacity={opacity * .9} lineWidth={1.15} renderOrder={3} />
  </group>
}
