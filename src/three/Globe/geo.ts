import * as THREE from 'three'
import { finite } from '../../utils/math'

export function latLonToVector3(lat: number, lon: number, radius = 2.45) {
  const safeLat = finite(lat)
  const safeLon = finite(lon)
  const safeRadius = Math.max(0.01, finite(radius, 2.45))
  const phi = (90 - safeLat) * Math.PI / 180
  const theta = (safeLon + 180) * Math.PI / 180
  return new THREE.Vector3(
    -safeRadius * Math.sin(phi) * Math.cos(theta),
    safeRadius * Math.cos(phi),
    safeRadius * Math.sin(phi) * Math.sin(theta),
  )
}

export const southAmericaOutline: [number, number][] = [
  [11, -73], [7, -77], [2, -80], [-5, -81], [-12, -77], [-18, -70], [-25, -68],
  [-34, -71], [-43, -73], [-55, -69], [-47, -65], [-38, -62], [-30, -53], [-22, -43],
  [-12, -37], [-5, -35], [1, -50], [7, -59], [11, -64], [11, -73],
]
