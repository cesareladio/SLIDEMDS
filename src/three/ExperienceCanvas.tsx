import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { AmbientParticles } from './Particles/AmbientParticles'
import { CameraRig } from './CameraRig/CameraRig'
import { SceneEffects } from './Effects/SceneEffects'
import { Globe } from './Globe/Globe'
import { Lights } from './Lights/Lights'
import { WorldObjects } from './WorldObjects'

export function ExperienceCanvas({ scene }: { scene: number }) {
  return <Canvas className="experience-canvas" dpr={[1, 1.6]} camera={{ position: [0, .15, 8.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}>
    <Suspense fallback={null}>
      <color attach="background" args={["#040816"]} />
      <fog attach="fog" args={["#040816", 8, 18]} />
      <Lights />
      <AmbientParticles intensity={scene === 4 ? 1.5 : 1} />
      <Globe scene={scene} />
      <WorldObjects scene={scene} />
      <CameraRig scene={scene} />
      <SceneEffects />
    </Suspense>
  </Canvas>
}
