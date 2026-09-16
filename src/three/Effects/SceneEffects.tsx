import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { ScrollChapter } from '../../app/ScrollContext'

interface SceneEffectsProps { scrollChapter?: ScrollChapter }

export function SceneEffects({ scrollChapter = 'opening' }: SceneEffectsProps) {
  const isEarthChapter = scrollChapter === 'opening' || scrollChapter === 'earth' || scrollChapter === 'country'
  const bloomIntensity = scrollChapter === 'convergence' ? .14 : scrollChapter === 'ai' ? .28 : scrollChapter === 'ibiol' ? .18 : scrollChapter === 'closing' ? .08 : isEarthChapter ? .10 : .38
  const bloomThreshold = isEarthChapter ? 0.85 : .70
  const vignetteDark   = isEarthChapter ? 0.46 : .56
  return <EffectComposer multisampling={0}>
    <Bloom intensity={bloomIntensity} luminanceThreshold={bloomThreshold} mipmapBlur />
    <Vignette darkness={vignetteDark} offset={.34} />
  </EffectComposer>
}
