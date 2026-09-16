import { useCallback, useEffect, useState } from 'react'
import { useScrollStory } from '../app/ScrollContext'
import { storyBeats, getNextBeat, getPreviousBeat, scrollToBeat } from '../data/storyBeats'

export function Navigation() {
  const { chapter, chapterProgress } = useScrollStory()
  const [visible, setVisible] = useState(false)
  const [beatIndex, setBeatIndex] = useState(0)

  const next = useCallback(() => {
    const beat = getNextBeat(chapter, chapterProgress)
    if (beat) scrollToBeat(beat)
  }, [chapter, chapterProgress])

  const previous = useCallback(() => {
    const beat = getPreviousBeat(chapter, chapterProgress)
    if (beat) scrollToBeat(beat)
  }, [chapter, chapterProgress])

  useEffect(() => {
    const chapters = ['opening','earth','peru','chile','convergence','ai','ibiol','closing']
    const chapterIdx = chapters.indexOf(chapter)
    let closestBeatIdx = 0
    let minDist = Infinity
    storyBeats.forEach((beat, index) => {
      const beatChapterIdx = chapters.indexOf(beat.chapter)
      const isAfter = beatChapterIdx > chapterIdx || (beat.chapter === chapter && beat.progress <= chapterProgress)
      if (isAfter) {
        const dist = beatChapterIdx === chapterIdx ? chapterProgress - beat.progress : (beatChapterIdx - chapterIdx) * 2
        if (dist >= 0 && dist < minDist) { minDist = dist; closestBeatIdx = index }
      }
    })
    setBeatIndex(closestBeatIdx)
  }, [chapter, chapterProgress])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'arrowdown' || key === 'arrowright' || key === ' ') { event.preventDefault(); next() }
      if (key === 'arrowup' || key === 'arrowleft') { event.preventDefault(); previous() }
      if (key === ' ' && event.shiftKey) { event.preventDefault(); previous() }
      if (key === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous])

  return <nav className="beat-nav" aria-label="Navegación de historia" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    <button className="beat-nav-btn" onClick={previous} aria-label="Beat anterior" title="Anterior (↑)">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9L2 5h8L6 9z" fill="currentColor" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }} /></svg>
    </button>
    <div className={`beat-nav-info ${visible ? 'visible' : ''}`} aria-live="polite">
      <span>{String(beatIndex + 1).padStart(2, '0')} / {String(storyBeats.length).padStart(2, '0')}</span>
    </div>
    <button className="beat-nav-btn beat-nav-primary" onClick={next} aria-label="Siguiente beat" title="Siguiente (↓)">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 3L10 7H2L6 3z" fill="currentColor" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }} /></svg>
    </button>
  </nav>
}
