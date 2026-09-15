import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
export function SceneEffects() { return <EffectComposer multisampling={0}><Bloom intensity={.42} luminanceThreshold={.72} mipmapBlur /><Vignette darkness={.58} offset={.32} /></EffectComposer> }
