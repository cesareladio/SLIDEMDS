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

export const geoAnchors = {
  southAmerica: { lat: -17, lon: -60 },
  peru: { lat: -10, lon: -75 },
  peruChile: { lat: -23, lon: -71 },
} as const

export function getGlobeOrientationForLatLon(lat: number, lon: number): THREE.Quaternion {
  const surfacePoint = latLonToVector3(lat, lon, 1)
  const forward = surfacePoint.clone().normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(forward, new THREE.Vector3(0, 0, 1))
  const rotatedUp = up.clone().applyQuaternion(quaternion)
  const projectedUp = new THREE.Vector3(rotatedUp.x, rotatedUp.y, 0).normalize()
  if (Number.isFinite(projectedUp.x) && Number.isFinite(projectedUp.y) && projectedUp.lengthSq() > 0.0001) {
    const twist = new THREE.Quaternion().setFromUnitVectors(projectedUp, new THREE.Vector3(0, 1, 0))
    quaternion.premultiply(twist)
  }
  return quaternion
}

export function orientGlobeToLatLon(group: THREE.Object3D, lat: number, lon: number) {
  const quaternion = getGlobeOrientationForLatLon(lat, lon)
  group.quaternion.copy(quaternion)
}

