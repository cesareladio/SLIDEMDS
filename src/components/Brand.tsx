import { useScrollStory } from '../app/ScrollContext'
import { rangeProgress } from '../utils/scrollMotion'

export function Brand() {
  const { chapter, chapterProgress } = useScrollStory()
  const opacity = chapter === 'closing' ? 1 - rangeProgress(chapterProgress, .84, .92) : 1
  return <div className="brand" style={{ opacity }}><span className="brand-mark">NTT</span><span>DATA</span><small>GDN-e</small></div>
}
