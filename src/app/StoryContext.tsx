import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { sceneDurations, story } from '../data/story'
import { clamp } from '../utils/math'

interface StoryState {
  scene: number
  direction: number
  autoplay: boolean
  presenter: boolean
  elapsed: number
  goTo: (index: number) => void
  next: () => void
  previous: () => void
  toggleAutoplay: () => void
  togglePresenter: () => void
}

const StoryContext = createContext<StoryState | null>(null)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoplay, setAutoplay] = useState(false)
  const [presenter, setPresenter] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const sceneRef = useRef(scene)

  const goTo = (raw: number) => {
    const nextScene = clamp(raw, 0, story.length - 1)
    setDirection(nextScene >= sceneRef.current ? 1 : -1)
    sceneRef.current = nextScene
    setScene(nextScene)
  }
  const next = () => goTo(sceneRef.current === story.length - 1 ? 0 : sceneRef.current + 1)
  const previous = () => goTo(sceneRef.current - 1)

  useEffect(() => {
    const started = performance.now()
    const ticker = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 1000)
    return () => window.clearInterval(ticker)
  }, [])

  useEffect(() => {
    if (!autoplay) return
    const timeout = window.setTimeout(next, sceneDurations[scene] * 1000)
    return () => window.clearTimeout(timeout)
  }, [autoplay, scene])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'arrowright' || key === ' ') { event.preventDefault(); next() }
      if (key === 'arrowleft') previous()
      if (key === 'a') setAutoplay(value => !value)
      if (key === 'p') setPresenter(value => !value)
      if (key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
      if (key === 'escape') setPresenter(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo(() => ({ scene, direction, autoplay, presenter, elapsed, goTo, next, previous, toggleAutoplay: () => setAutoplay(v => !v), togglePresenter: () => setPresenter(v => !v) }), [scene, direction, autoplay, presenter, elapsed])
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}

export const useStory = () => {
  const value = useContext(StoryContext)
  if (!value) throw new Error('useStory debe utilizarse dentro de StoryProvider')
  return value
}
