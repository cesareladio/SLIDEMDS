import { useScrollStory } from '../app/ScrollContext'
import { fadeWindow } from '../utils/scrollMotion'

/**
 * OpeningEarthHandoff: Renders opening and earth chapter copy
 * during transition windows to avoid hard React mount/unmount
 * at the chapter boundary. Handles:
 * - Opening exit when navigating to Earth Hub
 * - Earth entry with progressive copy reveal
 */
export function OpeningEarthHandoff() {
  const { chapter, chapterProgress: p } = useScrollStory()

  // During opening chapter exit to earth: fade out opening copy and reframe Earth
  if (chapter === 'opening') {
    // Scene 01 occupies roughly .25–1.0 progress
    // Only handle transition window near the end when user navigates away
    // Don't render during normal Scene 01 viewing (OpeningScene handles that)
    // This handoff takes over ONLY during the actual scroll transition OUT of opening
    // For now, we skip this since Navigation handles the scroll programmatically
    return null
  }

  // During earth chapter entry: fade in earth copy progressively
  if (chapter === 'earth') {
    // Only render during Scene 02 entry (0–.20)
    if (p > 0.20) return null

    // Scene 02: Earth hub copy enters during earth chapter
    // Timing: GDN-e · ONE TEAM at 0.60–0.88, PERÚ × CHILE at 0.68–0.95, etc.
    const eyebrow = fadeWindow(p, 0.60, 0.68, 0.88, 0.95)
    const title = fadeWindow(p, 0.68, 0.78, 0.95, 1.0)
    const hint = fadeWindow(p, 0.78, 0.88, 1.0, 1.05)
    const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 16}px)`, filter: `blur(${(1 - opacity) * 6}px)` })

    return (
      <section className="scene earth-hub-handoff">
        <div className="earth-hub-copy">
          <p className="eyebrow" style={style(eyebrow)}>GDN-e · ONE TEAM</p>
          <h1 style={style(title)}>PERÚ <em>×</em> CHILE</h1>
          <p className="earth-hub-hint" style={style(hint)}>DOS PAÍSES<br />UNA CAPACIDAD</p>
        </div>
      </section>
    )
  }

  return null
}
