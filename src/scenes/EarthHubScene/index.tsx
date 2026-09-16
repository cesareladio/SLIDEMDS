import { useScrollStory } from '../../app/ScrollContext'

export function EarthHubScene() {
  const { chapter } = useScrollStory()
  if (chapter !== 'earth') return null
  return (
    <section className="scene earth-hub-scene" aria-label="Earth Hub">
      <div className="earth-hub-copy">
        <p className="eyebrow">GDN-e · ONE TEAM</p>
        <h1>PERÚ <em>×</em> CHILE</h1>
        <p className="earth-hub-hint">DOS PAÍSES · UNA CAPACIDAD</p>
      </div>
    </section>
  )
}
