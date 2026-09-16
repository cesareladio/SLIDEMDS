import { useMemo } from 'react'
import { useScrollStory } from '../app/ScrollContext'
import { AvatarVisual } from './AvatarOverlay/AvatarVisual'
import { avatarMoments } from '../data/avatar'
import { fadeWindow } from '../utils/scrollMotion'

type ScrollLine = { speaker: 'Bárbara' | 'B2'; text: string; tone: 'executive' | 'warm' | 'playful' | 'closing'; opacity: number }

export function ScrollAvatarOverlay() {
  const { chapter, chapterProgress: p } = useScrollStory()

  const line = useMemo<ScrollLine | null>(() => {
    if (chapter === 'opening') {
      const lines = avatarMoments.opening
      const first = fadeWindow(p, .08, .14, .20, .26)
      const second = fadeWindow(p, .28, .34, .40, .46)
      const third = fadeWindow(p, .48, .54, .60, .66)
      if (third > .02) return { ...lines[2], opacity: third }
      if (second > .02) return { ...lines[1], opacity: second }
      if (first > .02) return { ...lines[0], opacity: first }
      return null
    }
    if (chapter === 'earth') {
      const lines = avatarMoments.bridge
      const first = fadeWindow(p, .04, .10, .16, .22)
      const second = fadeWindow(p, .18, .24, .30, .36)
      if (second > .02) return { ...lines[1], opacity: second }
      if (first > .02) return { ...lines[0], opacity: first }
      return null
    }
    if (chapter === 'closing') {
      const lines = avatarMoments.closing
      const first = fadeWindow(p, .42, .48, .54, .60)
      const second = fadeWindow(p, .62, .68, .74, .80)
      const third = fadeWindow(p, .97, .985, 1, 1.01)
      if (third > .02) return { ...lines[2], opacity: third }
      if (second > .02) return { ...lines[1], opacity: second }
      if (first > .02) return { ...lines[0], opacity: first }
      return null
    }
    return null
  }, [chapter, p])

  if (!line) return null
  return <aside className={`avatar-overlay avatar-tone-${line.tone} scroll-avatar`} style={{ opacity: line.opacity }} aria-live="polite" aria-label="Diálogo de B2">
    <AvatarVisual active={false} />
    <div className="avatar-dialogue"><span>{line.speaker}</span><p>{line.text}</p></div>
  </aside>
}
