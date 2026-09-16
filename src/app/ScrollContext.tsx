import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export type ScrollChapter =
  | 'opening'
  | 'earth'
  | 'country'
  | 'convergence'
  | 'ai'
  | 'ibiol'
  | 'closing'

export interface ScrollStoryState {
  chapter: ScrollChapter
  chapterProgress: number
  globalProgress: number
  direction: 1 | -1
}

interface ScrollContextValue extends ScrollStoryState {
  setScrollState: (next: Partial<ScrollStoryState>) => void
}

const defaultState: ScrollStoryState = {
  chapter: 'opening',
  chapterProgress: 0,
  globalProgress: 0,
  direction: 1,
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

function clamp01(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollStoryState>(defaultState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setScrollState = (next: Partial<ScrollStoryState>) => {
    const current = stateRef.current
    const merged: ScrollStoryState = {
      chapter: next.chapter ?? current.chapter,
      chapterProgress: next.chapterProgress !== undefined ? clamp01(next.chapterProgress) : current.chapterProgress,
      globalProgress: next.globalProgress !== undefined ? clamp01(next.globalProgress) : current.globalProgress,
      direction: next.direction ?? current.direction,
    }
    if (
      merged.chapter === current.chapter &&
      merged.chapterProgress === current.chapterProgress &&
      merged.globalProgress === current.globalProgress &&
      merged.direction === current.direction
    ) return
    stateRef.current = merged
    setState(merged)
  }

  const value = useMemo<ScrollContextValue>(() => ({ ...state, setScrollState }), [state])
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export function useScrollStory() {
  const value = useContext(ScrollContext)
  if (!value) throw new Error('useScrollStory debe utilizarse dentro de ScrollProvider')
  return value
}
