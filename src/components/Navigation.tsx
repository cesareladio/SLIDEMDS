import { useCallback, useEffect, useState } from 'react'
import { usePresentation } from '../app/PresentationContext'
import { presentationScenes } from '../data/presentationScenes'

function isTypingTarget(target: EventTarget | null) { return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) }

export function Navigation() {
  const { activeSceneIndex, transitioning, navigateToScene } = usePresentation()
  const [visible, setVisible] = useState(false)
  const next = useCallback(() => navigateToScene(activeSceneIndex + 1), [activeSceneIndex, navigateToScene])
  const previous = useCallback(() => navigateToScene(activeSceneIndex - 1), [activeSceneIndex, navigateToScene])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.repeat || transitioning) return
      if (event.key === ' ' && event.shiftKey) { event.preventDefault(); previous(); return }
      if (['ArrowDown', 'ArrowRight', ' '].includes(event.key)) { event.preventDefault(); next(); return }
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); previous(); return }
      if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous, transitioning])
  return <nav className={`beat-nav ${transitioning ? 'busy' : ''}`} aria-label="Navegación de historia" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    <button className="beat-nav-btn" onClick={previous} disabled={transitioning} aria-label="Escena anterior">↑</button>
    <div className={`beat-nav-info ${visible ? 'visible' : ''}`}><span>{String(activeSceneIndex + 1).padStart(2, '0')} / {String(presentationScenes.length).padStart(2, '0')}</span></div>
    <button className="beat-nav-btn beat-nav-primary" onClick={next} disabled={transitioning} aria-label="Siguiente escena">↓</button>
  </nav>
}
