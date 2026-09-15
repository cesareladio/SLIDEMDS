import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from 'lucide-react'
import { story } from '../data/story'
import { useStory } from '../app/StoryContext'

export function Navigation() {
  const { scene, goTo, next, previous, autoplay, toggleAutoplay } = useStory()
  return <div className="navigation" aria-label="Navegación de escenas">
    <button onClick={previous} aria-label="Escena anterior"><ChevronLeft /></button>
    <div className="scene-dots">{story.map((item, index) => <button key={item.id} className={index === scene ? 'active' : ''} onClick={() => goTo(index)} aria-label={item.title}><span /></button>)}</div>
    <div className="scene-count"><b>{String(scene + 1).padStart(2, '0')}</b><i />{String(story.length).padStart(2, '0')}</div>
    <button onClick={toggleAutoplay} aria-label="Autoplay">{autoplay ? <Pause /> : <Play />}</button>
    <button onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()} aria-label="Pantalla completa"><Maximize2 /></button>
    <button onClick={next} aria-label="Siguiente escena"><ChevronRight /></button>
  </div>
}
