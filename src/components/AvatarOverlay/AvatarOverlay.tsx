import { useEffect, useMemo, useState } from 'react'
import { avatarMoments, type AvatarMoment } from '../../data/avatar'
import { AvatarDialogue } from './AvatarDialogue'
import { AvatarVisual } from './AvatarVisual'

export function AvatarOverlay({ moment }: { moment?: AvatarMoment }) {
  const lines = useMemo(() => moment ? avatarMoments[moment] : [], [moment])
  const [index, setIndex] = useState(0)
  const line = lines[index]
  useEffect(() => { setIndex(0) }, [moment])
  useEffect(() => {
    if (!line) return
    const timeout = window.setTimeout(() => setIndex(current => current + 1), line.duration)
    return () => window.clearTimeout(timeout)
  }, [line])
  if (!line) return null
  return <aside className={`avatar-overlay avatar-tone-${line.tone}`} aria-live="polite" aria-label="Diálogo de B2">
    <AvatarVisual active />
    <AvatarDialogue line={line} onAdvance={() => setIndex(current => current + 1)} />
  </aside>
}
