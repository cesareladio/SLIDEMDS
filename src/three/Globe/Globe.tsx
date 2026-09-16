import { useMemo, useState } from 'react'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { peru } from '../../data/peru'
import { chile } from '../../data/chile'
import { EnergyArc } from '../EnergyLines/EnergyArc'
import { OrbitArcs } from './OrbitArcs'
import { CountrySurfaceHighlight } from './CountrySurfaceHighlight'
import { latLonToVector3, southAmericaOutline, geoAnchors, getGlobeOrientationForLatLon } from './geo'
import { useEarthTextures } from './useEarthTextures'
import { EarthSurface } from './EarthSurface'
import { Clouds } from './Clouds'
import { Atmosphere } from './Atmosphere'
import { sampleEarthChoreographyProgress, footprintComposition, closingComposition, earthHubComposition } from '../../data/earthJourney'
import type { CountryId } from '../../data/countryProfiles'
import type { ScrollChapter } from '../../app/ScrollContext'
import { fadeWindow, lerpNumber, rangeProgress } from '../../utils/scrollMotion'

const countryOrientations = { peru: { lat: -10, lon: -75 }, chile: { lat: -33, lon: -71 } } as const
const countryCompositions: Record<CountryId, { position: [number, number, number]; scale: number }> = {
  peru: { position: [.15, -.45, 0], scale: 1.28 }, chile: { position: [.2, -.52, 0], scale: 1.22 },
}

function InteractiveHotspot({ point, label, color = '#bdf3ff', onSelect, opacity = 1 }: { point: THREE.Vector3; label: string; color?: string; onSelect: () => void; opacity?: number }) {
  const [hovered, setHovered] = useState(false)
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .3), [point])
  const size = hovered ? .026 : .016
  return <group onPointerEnter={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }} onPointerLeave={e => { e.stopPropagation(); setHovered(false); document.body.style.cursor = '' }} onClick={e => { e.stopPropagation(); onSelect() }}>
    <mesh position={point}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} /></mesh>
    <mesh position={point} scale={2.5}><sphereGeometry args={[size, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={opacity * (hovered ? .2 : .07)} depthWrite={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={opacity * (hovered ? .7 : .38)} lineWidth={.7} />
    <Html position={leaderEnd} center distanceFactor={9} className={`hub-label hub-label-minimal${hovered ? ' hub-label-hover' : ''}`} style={{ opacity }}><span>{label}</span></Html>
  </group>
}

function PlainHotspot({ point, label, color = '#eaffff' }: { point: THREE.Vector3; label: string; color?: string }) {
  const leaderEnd = useMemo(() => point.clone().normalize().multiplyScalar(point.length() + .24), [point])
  return <group>
    <mesh position={point}><sphereGeometry args={[.014, 10, 10]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <Line points={[point, leaderEnd]} color={color} transparent opacity={.34} lineWidth={.55} />
    <Html position={leaderEnd} center distanceFactor={9} className="hub-label hub-label-minimal"><span>{label}</span></Html>
  </group>
}

export function Globe({ scene, selectedCountry = null, onSelectCountry, scrollChapter = 'opening', scrollProgress = 0 }: { scene: number; selectedCountry?: CountryId | null; onSelectCountry?: (id: CountryId) => void; scrollChapter?: ScrollChapter; scrollProgress?: number }) {
  const { textures, failed } = useEarthTextures()
  const outline = useMemo(() => southAmericaOutline.map(([lat, lon]) => latLonToVector3(lat, lon, 2.47)), [])
  const peruPoint = useMemo(() => latLonToVector3(geoAnchors.peru.lat, geoAnchors.peru.lon, 2.52), [])
  const chilePoint = useMemo(() => latLonToVector3(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon, 2.52), [])
  const southAmericaQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.southAmerica.lat, geoAnchors.southAmerica.lon), [])
  const peruChileQ = useMemo(() => getGlobeOrientationForLatLon(geoAnchors.peruChile.lat, geoAnchors.peruChile.lon), [])
  const peruQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.peru.lat, countryOrientations.peru.lon), [])
  const chileQ = useMemo(() => getGlobeOrientationForLatLon(countryOrientations.chile.lat, countryOrientations.chile.lon), [])

  const p = Number.isFinite(scrollProgress) ? Math.min(1, Math.max(0, scrollProgress)) : 0
  const isCountry = scrollChapter === 'country' && selectedCountry !== null
  let position = footprintComposition.position
  let scale = footprintComposition.scale
  let quaternion = peruChileQ
  let outlineOpacity = .38

  if (isCountry && selectedCountry) {
    const composition = countryCompositions[selectedCountry]
    const exit = rangeProgress(p, .90, 1)
    position = [lerpNumber(composition.position[0], .5, exit), lerpNumber(composition.position[1], -.85, exit), 0]
    scale = lerpNumber(composition.scale + .08, .94, Math.max(rangeProgress(p, .14, .52), exit))
    quaternion = exit > 0 ? peruChileQ : selectedCountry === 'peru' ? peruQ : chileQ
    outlineOpacity = .18 + rangeProgress(p, 0, .14) * .34 + exit * .24
  } else if (scrollChapter === 'opening') {
    const sample = sampleEarthChoreographyProgress(p)
    position = sample.position
    scale = sample.scale
    quaternion = sample.phase === 'hero' || sample.phase === 'shift' ? southAmericaQ : peruChileQ
    outlineOpacity = sample.phase === 'hero' ? 0 : sample.phase === 'shift' ? .22 : .38
  } else if (scrollChapter === 'earth') {
    position = earthHubComposition.position
    scale = earthHubComposition.scale
    quaternion = peruChileQ
    outlineOpacity = .42
  } else if (scene === 7) {
    position = closingComposition.position
    scale = closingComposition.scale
    outlineOpacity = .3
  }

  const hotspotOpacity = scrollChapter === 'earth' ? 1 : rangeProgress(p, .72, 1)
  const earthOpacity = isCountry ? Math.max(0, 1 - rangeProgress(p, .14, .48) - rangeProgress(p, .72, .92) * .5) : 1
  const highlightIntensity = isCountry ? fadeWindow(p, 0, .05, .18, .52) + fadeWindow(p, .90, .95, 1, 1.02) : 0
  const globeVisible = scrollChapter === 'opening' || scrollChapter === 'earth' || scrollChapter === 'country' || scene === 1 || scene === 7 || selectedCountry !== null
  const showHotspots = (scrollChapter === 'earth' || hotspotOpacity > .01) && !selectedCountry
  const showPeruHubs = scene === 1 && !isCountry
  const showChileHubs = scene === 1 && !isCountry

  return <group position={position} scale={scale} visible={globeVisible}>
    <group quaternion={quaternion}>
      <EarthSurface textures={failed ? null : textures} opacity={earthOpacity} />
      {textures && !failed && <Clouds textures={textures} opacity={earthOpacity} />}
      <Atmosphere opacity={earthOpacity} />
      <Line points={outline} color="#8fe6ff" lineWidth={1} transparent opacity={outlineOpacity * earthOpacity} />
      {selectedCountry && <CountrySurfaceHighlight country={selectedCountry} visible intensity={highlightIntensity} />}
      {showHotspots && <>
        <InteractiveHotspot point={peruPoint} label="PERÚ" color="#00e6ff" onSelect={() => onSelectCountry?.('peru')} opacity={hotspotOpacity} />
        <InteractiveHotspot point={chilePoint} label="CHILE" color="#4aa8ff" onSelect={() => onSelectCountry?.('chile')} opacity={hotspotOpacity} />
        {scrollChapter === 'earth' && <EnergyArc from={chilePoint} to={peruPoint} visible />}
      </>}
      {showPeruHubs && (peru.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} />)}
      {showChileHubs && (chile.operationalHubs ?? []).map(hub => <PlainHotspot key={hub.name} point={latLonToVector3(hub.lat, hub.lon, 2.52)} label={hub.name} color="#8fd8ff" />)}
    </group>
    <OrbitArcs visible={globeVisible && !selectedCountry} />
  </group>
}
