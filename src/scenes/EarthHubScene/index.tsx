import { useScrollStory } from '../../app/ScrollContext'

export function EarthHubScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'earth' || p <= 0.20) return null  // Handoff takes over until .20
  return (
    <section className="scene earth-hub-scene" aria-label="Earth Hub">
      <div className="earth-hub-copy">
        <p className="eyebrow">GDN-e · ONE TEAM</p>
        <h1>PERÚ <em>×</em> CHILE</h1>
        <p className="earth-hub-hint">DOS PAÍSES<br />UNA CAPACIDAD</p>
      </div>
    </section>
  )
}
