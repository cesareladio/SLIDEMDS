import { useEffect, useMemo, useRef, useState } from 'react'
import { avatarMoments, type AvatarMoment } from '../../data/avatar'
import { AvatarDialogue } from './AvatarDialogue'
import { AvatarVisual } from './AvatarVisual'

const OPENING_DELAY_MS = 0 // Opening is now scroll-driven; timer disabled

export function AvatarOverlay({ moment }: { moment?: AvatarMoment }) {
  const lines = useMemo(() => moment ? avatarMoments[moment] : [], [moment])
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const line = lines[index]

  useEffect(() => {
    setIndex(0)
    setReady(false)
    if (delayRef.current) clearTimeout(delayRef.current)
    if (!moment) return
    const delay = moment === 'opening' ? OPENING_DELAY_MS : 0
    delayRef.current = setTimeout(() => setReady(true), delay)
    return () => { if (delayRef.current) clearTimeout(delayRef.current) }
  }, [moment])

  useEffect(() => {
    if (!line || !ready) return
    const timeout = window.setTimeout(() => setIndex(current => current + 1), line.duration)
    return () => window.clearTimeout(timeout)
  }, [line, ready])

  if (!line || !ready) return null
  return <aside className={`avatar-overlay avatar-tone-${line.tone}`} aria-live="polite" aria-label="Diálogo de B2">
    <AvatarVisual active />
    <AvatarDialogue line={line} onAdvance={() => setIndex(current => current + 1)} />
  </aside>
}
