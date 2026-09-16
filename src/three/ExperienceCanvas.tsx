import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { CameraRig } from './CameraRig/CameraRig'
import { SceneEffects } from './Effects/SceneEffects'
import { Globe } from './Globe/Globe'
import { Starfield } from './Globe/Starfield'
import { Lights } from './Lights/Lights'
import { WorldObjects } from './WorldObjects'
import { AIScrollParticleMorph } from './AIScrollParticleMorph'
import { IBIOLScrollNetwork } from './IBIOLScrollNetwork'
import type { CountryId } from '../data/countryProfiles'
import type { ScrollChapter } from '../app/ScrollContext'

interface ExperienceCanvasProps {
  selectedCountry?: CountryId | null
  onSelectCountry?: (id: CountryId) => void
  scrollChapter?: ScrollChapter
  scrollProgress?: number
}

export function ExperienceCanvas({ selectedCountry = null, onSelectCountry, scrollChapter = 'opening', scrollProgress = 0 }: ExperienceCanvasProps) {
  const isOpeningOrEarth = scrollChapter === 'opening' || scrollChapter === 'earth'
  const isCountry = scrollChapter === 'country'
  const isConvergence = scrollChapter === 'convergence'
  const isAI = scrollChapter === 'ai'
  const isIBIOL = scrollChapter === 'ibiol'
  const isClosing = scrollChapter === 'closing'
  const showSpaceBackdrop = isOpeningOrEarth || isCountry || isConvergence || isAI || isIBIOL || (isClosing && scrollProgress < .9)

  return <Canvas className="experience-canvas" dpr={[1, 1.6]} camera={{ position: [0, .15, 8.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
    <Suspense fallback={null}>
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#040816', 8, 18]} />
      <Lights />
      <Starfield visible={showSpaceBackdrop} />
      <Globe selectedCountry={selectedCountry} onSelectCountry={onSelectCountry} scrollChapter={scrollChapter} scrollProgress={scrollProgress} scene={0} />
      {isAI && <AIScrollParticleMorph progress={scrollProgress} visible />}
      {isIBIOL && <AIScrollParticleMorph progress={1} opacity={Math.max(0, 1 - Math.min(1, scrollProgress / .12))} visible />}
      {isIBIOL && <IBIOLScrollNetwork progress={scrollProgress} opacity={Math.min(1, scrollProgress / .12)} visible />}
      <WorldObjects selectedCountry={selectedCountry} countryScrollProgress={scrollProgress} scrollChapter={scrollChapter} />
      <CameraRig selectedCountry={selectedCountry} scrollChapter={scrollChapter} scrollProgress={scrollProgress} scene={0} />
      <SceneEffects scrollChapter={scrollChapter} />
    </Suspense>
  </Canvas>
}
