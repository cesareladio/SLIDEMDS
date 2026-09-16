import { useScrollStory } from '../../app/ScrollContext'

export function EarthHubScene() {
  const { chapter } = useScrollStory()
  if (chapter !== 'earth') return null
  return (
    <section className="scene earth-hub-scene" aria-label="Earth Hub — selecciona un país">
      <div className="earth-hub-copy">
        <p className="eyebrow">GDN-e · ONE TEAM</p>
        <h1>SELECCIONA<br /><em>UN PAÍS</em></h1>
        <p className="earth-hub-hint">PERÚ &nbsp;·&nbsp; CHILE</p>
      </div>
    </section>
  )
}
