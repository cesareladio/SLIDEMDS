import { Html } from '@react-three/drei'
import { latLonToVector3 } from './geo'

export interface PeruGeoAnchorSpec {
  id: string
  label: string
  lat: number
  lon: number
  value?: number
  tag?: string
  isTop3?: boolean
}

// Slightly above the CountrySurfaceHighlight outline radius (2.492) so the
// dot renders on top of the highlighted surface without z-fighting.
const ANCHOR_RADIUS = 2.5
const DOT_SIZE = 0.009

interface PeruGeoAnchors3DProps {
  anchors: PeruGeoAnchorSpec[]
  dimOpacity?: number
}

export function PeruGeoAnchors3D({ anchors, dimOpacity = 0.55 }: PeruGeoAnchors3DProps) {
  return <group>
    {anchors.map(anchor => {
      const position = latLonToVector3(anchor.lat, anchor.lon, ANCHOR_RADIUS)
      const opacity = anchor.isTop3 === false ? dimOpacity : 1
      const color = anchor.isTop3 ? '#00eaff' : '#7fd2e6'

      return (
        <group key={anchor.id} position={position}>
          <mesh>
            <sphereGeometry args={[DOT_SIZE, 10, 10]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
          </mesh>
          <Html transform={false} center={false} style={{ pointerEvents: 'none' }}>
            <div className={`peru-geo3d-callout${anchor.isTop3 ? ' top3' : ''}`} style={{ opacity }}>
              <div className="peru-geo3d-label">
                <span className="peru-geo3d-name">{anchor.label}</span>
                {anchor.value !== undefined && (
                  <span className="peru-geo3d-value">{anchor.value.toLocaleString('es-PE')}</span>
                )}
                {anchor.tag && <span className="peru-geo3d-tag">{anchor.tag}</span>}
              </div>
            </div>
          </Html>
        </group>
      )
    })}
  </group>
}
