import { useMemo } from 'react'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'
import { capabilityNodes, finitePosition, type CapabilityFocus } from '../data/capabilityConstellation'
import { AIParticleMorph } from './AIParticleMorph'
import { JourneyFlight } from './JourneyFlight'
import { IBIOLNetwork } from './IBIOLNetwork'
import { CountryCapabilityConstellation } from './CountryCapabilityConstellation'
import { JourneyScrollFlight } from './JourneyScrollFlight'
import type { IBIOLPhase } from '../data/ibiol'
import type { CountryId } from '../data/countryProfiles'
import { countryProfiles } from '../data/countryProfiles'
import { journeyWaypoints } from '../data/journeyPath'
import { getSegmentProgress, journeyLocalProgress } from '../data/countryScroll'

function CapabilityConstellation({ focus }: { focus: CapabilityFocus }) {
  const nodes = useMemo(() => capabilityNodes.map(node => ({ ...node, position: finitePosition(node.position) })), [])
  const selected = nodes.find(node => node.focus === focus)
  return <group>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[.08, 16, 16]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} /></mesh>
    {nodes.map((node, index) => {
      const active = node.focus === focus
      const emphasized = focus === 'overview' || active
      const opacity = focus === 'overview' ? .23 : active ? .72 : .055
      const position = node.position
      return <group key={node.id}>
        <Line points={[[0, 0, 0], position]} color={active ? '#9ff5ff' : '#168ac2'} transparent opacity={opacity} lineWidth={active ? 1.8 : 1} />
        {active && selected && <Line points={[position, [position[0] + .55, position[1] + .18, position[2] + .28]]} color="#d8fbff" transparent opacity={.42} lineWidth={1} />}
        <Float speed={.65 + index * .06} rotationIntensity={emphasized ? .16 : .04} floatIntensity={emphasized ? .2 : .04}>
          <group position={position} scale={active ? 1.34 : 1}>
            <mesh><icosahedronGeometry args={[.1 + node.value / 2100, 2]} /><meshBasicMaterial color={active || (focus === 'overview' && index < 3) ? '#00d4ff' : '#0878d2'} toneMapped={false} transparent opacity={focus === 'overview' || active ? 1 : .32} /></mesh>
            <mesh scale={1.7}><sphereGeometry args={[.14 + node.value / 2100, 16, 16]} /><meshBasicMaterial color="#00a6ff" transparent opacity={active ? .2 : focus === 'overview' ? .075 : .018} depthWrite={false} /></mesh>
          </group>
        </Float>
      </group>
    })}
  </group>
}

interface WorldObjectsProps {
  scene: number
  capabilityFocus?: CapabilityFocus
  onAIPhase?: (phase: 'certifications' | 'gh300' | 'concepts') => void
  ibiolPhase?: IBIOLPhase
  selectedCountry?: CountryId | null
  countryScrollProgress?: number
  scrollChapter?: string
}

export function WorldObjects({
  scene, capabilityFocus = 'overview', onAIPhase, ibiolPhase = 'today',
  selectedCountry = null, countryScrollProgress = 0, scrollChapter = 'opening',
}: WorldObjectsProps) {
  const isCountryChapter = scrollChapter === 'country' && selectedCountry !== null

  if (isCountryChapter && selectedCountry) {
    const profile = countryProfiles[selectedCountry]
    const supProg = getSegmentProgress(selectedCountry, 'superpowers', countryScrollProgress)
    const jrProg = journeyLocalProgress(selectedCountry, countryScrollProgress)
    const supOpacity = Math.min(1, Math.max(0, Math.min(supProg / .15, (1 - supProg) / .22)))
    const jrOpacity = Math.min(1, Math.max(0, Math.min(jrProg / .12, (1 - jrProg) / .04)))
    const showSup = supOpacity > .01
    const showJrn = jrOpacity > .01 && profile.journeyHistory !== undefined
    return <>
      {showSup && <CountryCapabilityConstellation
        capabilities={profile.data.capabilities}
        progress={supProg}
        opacity={supOpacity}
        visible
      />}
      {showJrn && <JourneyScrollFlight
        waypoints={journeyWaypoints}
        progress={jrProg}
        opacity={jrOpacity}
        visible
      />}
    </>
  }

  return <>
    {scene === 3 && <CapabilityConstellation focus={capabilityFocus} />}
    <AIParticleMorph visible={scene === 4} onPhase={onAIPhase} />
    <JourneyFlight visible={scene === 5} />
    <IBIOLNetwork visible={scene === 6} phase={ibiolPhase} />
  </>
}
