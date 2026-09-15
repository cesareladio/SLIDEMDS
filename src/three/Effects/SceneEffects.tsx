import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
export function SceneEffects() { return <EffectComposer multisampling={0}><Bloom intensity={.65} luminanceThreshold={.6} mipmapBlur /><Vignette darkness={.62} offset={.3} /></EffectComposer> }
