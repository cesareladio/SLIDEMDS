import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function OpeningScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'opening') return null
  const identities = fadeWindow(p, .12, .20, .42, .47)
  const team = fadeWindow(p, .48, .55, .98, 1.02)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 18}px)`, filter: `blur(${(1 - opacity) * 7}px)` })

  return <section className="scene opening-scene">
    <div className="opening-copy">
      <h1 className="opening-beat-h1" style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 className="opening-beat-h1" style={style(team)}>UN SOLO<br />EQUIPO</h1>
    </div>
  </section>
}
