import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { getSceneScrollTarget, presentationScenes } from '../data/presentationScenes'

interface PresentationValue {
  activeSceneIndex: number
  transitioning: boolean
  navigateToScene: (index: number) => void
}
const Context = createContext<PresentationValue | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const busy = useRef(false)
  const tween = useRef<gsap.core.Tween | null>(null)
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const state = useRef({ y: 0 })

  const navigateToScene = useCallback((raw: number) => {
    if (busy.current) return
    const targetIndex = Math.min(presentationScenes.length - 1, Math.max(0, raw))
    if (targetIndex === activeSceneIndex) return
    const targetY = getSceneScrollTarget(presentationScenes[targetIndex])
    if (targetY === null) return
    busy.current = true
    setTransitioning(true)
    state.current.y = window.scrollY
    const transition = presentationScenes[targetIndex].transitionType
    const duration = transition === 'cinematic' ? 1.5 : transition === 'editorial' ? 1.15 : .9
    tween.current = gsap.to(state.current, {
      y: targetY,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => window.scrollTo(0, state.current.y),
      onComplete: () => {
        window.scrollTo(0, targetY)
        setActiveSceneIndex(targetIndex)
        settle.current = setTimeout(() => { busy.current = false; setTransitioning(false) }, 400)
      },
      onInterrupt: () => { busy.current = false; setTransitioning(false) },
    })
  }, [activeSceneIndex])

  useEffect(() => {
    let accumulated = 0
    let resetTimer: ReturnType<typeof setTimeout> | null = null
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (busy.current) return
      accumulated += event.deltaY
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { accumulated = 0; resetTimer = null }, 160)
      if (accumulated >= 60) { accumulated = 0; navigateToScene(activeSceneIndex + 1) }
      else if (accumulated <= -60) { accumulated = 0; navigateToScene(activeSceneIndex - 1) }
    }
    const onResize = () => {
      const target = getSceneScrollTarget(presentationScenes[activeSceneIndex])
      if (target !== null && !busy.current) window.scrollTo(0, target)
    }
    const initial = window.setTimeout(() => { const target = getSceneScrollTarget(presentationScenes[0]); if (target !== null) window.scrollTo(0, target) }, 0)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('resize', onResize); if (resetTimer) clearTimeout(resetTimer); window.clearTimeout(initial); tween.current?.kill(); if (settle.current) clearTimeout(settle.current) }
  }, [activeSceneIndex, navigateToScene])

  const value = useMemo(() => ({ activeSceneIndex, transitioning, navigateToScene }), [activeSceneIndex, transitioning, navigateToScene])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const usePresentation = () => { const value = useContext(Context); if (!value) throw new Error('usePresentation debe utilizarse dentro de PresentationProvider'); return value }
