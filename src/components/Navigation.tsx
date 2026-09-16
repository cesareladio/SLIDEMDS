import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { story } from '../data/story'
import { useStory } from '../app/StoryContext'

const HIDE_DELAY = 2200

export function Navigation() {
  const { scene, goTo, next, previous, autoplay, toggleAutoplay, selectedCountry } = useStory()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    setVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }, [])

  useEffect(() => {
    const onMove = () => show()
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'arrowright', ' '].includes(k)) show()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('keydown', onKey) }
  }, [show])

  useEffect(() => { if (timerRef.current) clearTimeout(timerRef.current) }, [scene])

  if (selectedCountry) return null

  return <AnimatePresence>
    {visible && <motion.div
      className="navigation"
      aria-label="Navegación de escenas"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: .28 }}
    >
      <button onClick={previous} aria-label="Escena anterior"><ChevronLeft /></button>
      <div className="scene-dots">{story.map((item, index) => <button key={item.id} className={index === scene ? 'active' : ''} onClick={() => goTo(index)} aria-label={item.title}><span /></button>)}</div>
      <div className="scene-count"><b>{String(scene + 1).padStart(2, '0')}</b><i />{String(story.length).padStart(2, '0')}</div>
      <button onClick={toggleAutoplay} aria-label="Autoplay">{autoplay ? <Pause /> : <Play />}</button>
      <button onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()} aria-label="Pantalla completa"><Maximize2 /></button>
      <button onClick={next} aria-label="Siguiente escena"><ChevronRight /></button>
    </motion.div>}
  </AnimatePresence>
}
