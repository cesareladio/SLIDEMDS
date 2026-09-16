import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollStory } from '../app/ScrollContext'
import { storyBeats, getNextBeat, getPreviousBeat, getStoryBeatIndex, scrollToBeat } from '../data/storyBeats'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function Navigation() {
  const { chapter, chapterProgress } = useScrollStory()
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const beatIndex = getStoryBeatIndex(chapter, chapterProgress)

  const unlock = useCallback(() => {
    busyRef.current = false
    setBusy(false)
    if (settleTimer.current) { clearTimeout(settleTimer.current); settleTimer.current = null }
  }, [])

  const goToStoryBeat = useCallback((beat: typeof storyBeats[number] | null) => {
    if (!beat || busyRef.current) return
    busyRef.current = true
    setBusy(true)
    scrollToBeat(beat)
    if ('onscrollend' in window) window.addEventListener('scrollend', unlock, { once: true })
    else settleTimer.current = setTimeout(unlock, 750)
  }, [unlock])

  const next = useCallback(() => goToStoryBeat(getNextBeat(chapter, chapterProgress)), [chapter, chapterProgress, goToStoryBeat])
  const previous = useCallback(() => goToStoryBeat(getPreviousBeat(chapter, chapterProgress)), [chapter, chapterProgress, goToStoryBeat])

  useEffect(() => () => { if (settleTimer.current) clearTimeout(settleTimer.current) }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.repeat || busyRef.current) return
      const key = event.key.toLowerCase()
      if (key === ' ' && event.shiftKey) { event.preventDefault(); previous(); return }
      if (key === 'arrowdown' || key === 'arrowright' || key === ' ') { event.preventDefault(); next(); return }
      if (key === 'arrowup' || key === 'arrowleft') { event.preventDefault(); previous(); return }
      if (key === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous])

  return <nav className={`beat-nav ${busy ? 'busy' : ''}`} aria-label="Navegación de historia" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    <button className="beat-nav-btn" onClick={previous} aria-label="Beat anterior" title="Anterior (↑)" disabled={busy}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9L2 5h8L6 9z" fill="currentColor" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }} /></svg>
    </button>
    <div className={`beat-nav-info ${visible ? 'visible' : ''}`} aria-live="polite"><span>{String(beatIndex + 1).padStart(2, '0')} / {String(storyBeats.length).padStart(2, '0')}</span></div>
    <button className="beat-nav-btn beat-nav-primary" onClick={next} aria-label="Siguiente beat" title="Siguiente (↓)" disabled={busy}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 3L10 7H2L6 3z" fill="currentColor" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }} /></svg>
    </button>
  </nav>
}
