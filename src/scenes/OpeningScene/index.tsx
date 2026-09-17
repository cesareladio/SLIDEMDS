import { useScrollStory } from '../../app/ScrollContext'
import { openingPreludeState } from '../../data/openingPreludeState'

const smoothstep = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

export function OpeningScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'opening') return null

  // Single combined statement opacity — both titles share the SAME visibility state.
  // Driven by prelude progress (0.85–1.0) then locked at 1 while chapter is stable.
  // On exit (scroll toward earth chapter, p > 0.82) both fade together.
  let statement = 0

  if (!openingPreludeState.done) {
    // During prelude: reveal once Earth has landed (progress 0.85 → 1.0)
    if (openingPreludeState.progress >= 0.85) {
      statement = smoothstep((openingPreludeState.progress - 0.85) / 0.15)
    }
  } else {
    // After prelude: fully visible during Scene 01 hold,
    // then exit together as scroll advances toward earth chapter (p 0.82 → 1.0)
    const exitStart = 0.82
    const exitFade = smoothstep(Math.max(0, (p - exitStart) / (1 - exitStart)))
    statement = 1 - exitFade
  }

  // Tiny stagger: UN SOLO EQUIPO lags ~120ms behind DOS IDENTIDADES during reveal only
  const prelProg = openingPreludeState.progress
  const revealLag = !openingPreludeState.done && prelProg >= 0.85
    ? smoothstep(Math.max(0, (prelProg - 0.895) / 0.105))
    : statement

  const styleFor = (opacity: number) => ({
    opacity,
    transform: `translateY(${(1 - opacity) * 18}px)`,
    filter: `blur(${(1 - opacity) * 7}px)`,
  })

  return <section className="scene opening-scene">
    <div className="opening-copy">
      <h1 className="opening-beat-h1" style={styleFor(statement)}>DOS<br />IDENTIDADES</h1>
      <h1 className="opening-beat-h1" style={styleFor(revealLag)}>UN SOLO<br />EQUIPO</h1>
    </div>
  </section>
}
