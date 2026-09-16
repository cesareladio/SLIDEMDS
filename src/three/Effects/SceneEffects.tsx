import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { ScrollChapter } from '../../app/ScrollContext'

interface SceneEffectsProps { scrollChapter?: ScrollChapter }

export function SceneEffects({ scrollChapter = 'opening' }: SceneEffectsProps) {
  const isEarthChapter = scrollChapter === 'opening' || scrollChapter === 'earth' || scrollChapter === 'country'
  const bloomIntensity = isEarthChapter ? 0.10 : 0.38
  const bloomThreshold = isEarthChapter ? 0.85 : 0.70
  const vignetteDark   = isEarthChapter ? 0.46 : 0.56
  return <EffectComposer multisampling={0}>
    <Bloom intensity={bloomIntensity} luminanceThreshold={bloomThreshold} mipmapBlur />
    <Vignette darkness={vignetteDark} offset={0.34} />
  </EffectComposer>
}
