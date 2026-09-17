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
import type { ScrollChapter } from '../app/ScrollContext'

interface ExperienceCanvasProps {
  scrollChapter?: ScrollChapter
  scrollProgress?: number
  activeSceneIndex?: number
}

export function ExperienceCanvas({ scrollChapter = 'opening', scrollProgress = 0, activeSceneIndex = -1 }: ExperienceCanvasProps) {
  const isAI = scrollChapter === 'ai'
  const isIBIOL = scrollChapter === 'ibiol'
  const isClosing = scrollChapter === 'closing'
  const showSpaceBackdrop = scrollChapter !== 'ibiol' || scrollProgress < .9
    ? !isClosing || scrollProgress < .9
    : false

  return <Canvas className="experience-canvas" dpr={[1, 1.6]} camera={{ position: [0, .15, 8.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
    <Suspense fallback={null}>
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#040816', 8, 18]} />
      <Lights />
      <Starfield visible={showSpaceBackdrop} />
      <Globe scrollChapter={scrollChapter} scrollProgress={scrollProgress} activeSceneIndex={activeSceneIndex} />
      {isAI && <AIScrollParticleMorph progress={scrollProgress} visible />}
      {isIBIOL && <AIScrollParticleMorph progress={1} opacity={Math.max(0, 1 - Math.min(1, scrollProgress / .12))} visible />}
      {isIBIOL && <IBIOLScrollNetwork progress={scrollProgress} opacity={Math.min(1, scrollProgress / .12)} visible />}
      <WorldObjects scrollChapter={scrollChapter} countryScrollProgress={scrollProgress} />
      <CameraRig scrollChapter={scrollChapter} scrollProgress={scrollProgress} />
      <SceneEffects scrollChapter={scrollChapter} />
    </Suspense>
  </Canvas>
}
