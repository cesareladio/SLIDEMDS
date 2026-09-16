import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useScrollStory } from '../app/ScrollContext'
import { storyBeats, getNextBeat, getPreviousBeat, getStoryBeatIndex, getStoryBeatTarget } from '../data/storyBeats'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function Navigation() {
  const { chapter, chapterProgress } = useScrollStory()
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const scrollState = useRef({ y: 0 })
  const beatIndex = getStoryBeatIndex(chapter, chapterProgress)

  const unlock = useCallback(() => {
    tweenRef.current = null
    busyRef.current = false
    setBusy(false)
  }, [])

  const goToStoryBeat = useCallback((beat: typeof storyBeats[number] | null) => {
    if (!beat || busyRef.current) return
    const targetY = getStoryBeatTarget(beat)
    if (targetY === null) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { window.scrollTo(0, targetY); return }
    busyRef.current = true
    setBusy(true)
    scrollState.current.y = window.scrollY
    tweenRef.current = gsap.to(scrollState.current, {
      y: targetY,
      duration: .7,
      ease: 'power2.inOut',
      onUpdate: () => window.scrollTo(0, scrollState.current.y),
      onComplete: unlock,
      onInterrupt: unlock,
    })
  }, [unlock])

  const next = useCallback(() => goToStoryBeat(getNextBeat(chapter, chapterProgress)), [chapter, chapterProgress, goToStoryBeat])
  const previous = useCallback(() => goToStoryBeat(getPreviousBeat(chapter, chapterProgress)), [chapter, chapterProgress, goToStoryBeat])

  useEffect(() => {
    const cancelForManualScroll = () => {
      if (tweenRef.current) { tweenRef.current.kill(); unlock() }
    }
    window.addEventListener('wheel', cancelForManualScroll, { passive: true })
    window.addEventListener('touchstart', cancelForManualScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', cancelForManualScroll)
      window.removeEventListener('touchstart', cancelForManualScroll)
      tweenRef.current?.kill()
    }
  }, [unlock])

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
