import { useScrollStory } from '../app/ScrollContext'

export function ScrollDebugOverlay() {
  if (!import.meta.env.DEV) return null
  const { chapter, chapterProgress, globalProgress, direction } = useScrollStory()
  return <div className="scroll-debug" aria-hidden="true">
    <b>{chapter.toUpperCase()}</b>
    <span>chapter {chapterProgress.toFixed(2)}</span>
    <span>global {globalProgress.toFixed(2)}</span>
    <span>dir {direction > 0 ? '↓' : '↑'}</span>
  </div>
}
