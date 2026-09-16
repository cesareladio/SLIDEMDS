import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { AmbientParticles } from './Particles/AmbientParticles'
import { CameraRig } from './CameraRig/CameraRig'
import { SceneEffects } from './Effects/SceneEffects'
import { Globe } from './Globe/Globe'
import { Starfield } from './Globe/Starfield'
import { Lights } from './Lights/Lights'
import { WorldObjects } from './WorldObjects'
import type { CapabilityFocus } from '../data/capabilityConstellation'
import type { IBIOLPhase } from '../data/ibiol'
import type { CountryId } from '../data/countryProfiles'
import type { ScrollChapter } from '../app/ScrollContext'

interface ExperienceCanvasProps {
  scene: number
  capabilityFocus?: CapabilityFocus
  onAIPhase?: (phase: 'certifications' | 'gh300' | 'concepts') => void
  ibiolPhase?: IBIOLPhase
  selectedCountry?: CountryId | null
  onSelectCountry?: (id: CountryId) => void
  scrollChapter?: ScrollChapter
  scrollProgress?: number
  globalScrollProgress?: number
}

export function ExperienceCanvas({
  scene, capabilityFocus = 'overview', onAIPhase, ibiolPhase = 'today',
  selectedCountry = null, onSelectCountry,
  scrollChapter = 'opening', scrollProgress = 0,
}: ExperienceCanvasProps) {
  const isOpeningOrEarth = scrollChapter === 'opening' || scrollChapter === 'earth'
  const showSpaceBackdrop = isOpeningOrEarth || scene === 1 || scene === 7
  const ambientActive = !isOpeningOrEarth && scene === 4
  return <Canvas className="experience-canvas" dpr={[1, 1.6]} camera={{ position: [0, .15, 8.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
    <Suspense fallback={null}>
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#040816', 8, 18]} />
      <Lights />
      <Starfield visible={showSpaceBackdrop} />
      {ambientActive && <AmbientParticles intensity={1.5} />}
      <Globe
        scene={scene}
        selectedCountry={selectedCountry}
        onSelectCountry={onSelectCountry}
        scrollChapter={scrollChapter}
        scrollProgress={scrollProgress}
      />
      {scene !== 0 && <WorldObjects scene={scene} capabilityFocus={capabilityFocus} onAIPhase={onAIPhase} ibiolPhase={ibiolPhase} />}
      <CameraRig
        scene={scene}
        capabilityFocus={capabilityFocus}
        ibiolPhase={ibiolPhase}
        selectedCountry={selectedCountry}
        scrollChapter={scrollChapter}
        scrollProgress={scrollProgress}
      />
      <SceneEffects scrollChapter={scrollChapter} />
    </Suspense>
  </Canvas>
}
