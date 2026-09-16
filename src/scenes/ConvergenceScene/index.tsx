import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function ConvergenceScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'convergence') return null
  const context = fadeWindow(p, 0, .08, .18, .34)
  const identities = fadeWindow(p, .34, .42, .54, .62)
  const team = fadeWindow(p, .54, .62, .73, .81)
  const one = fadeWindow(p, .76, .84, 1, 1.02)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 20}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene convergence-scene">
    <div className="convergence-copy">
      <p className="eyebrow" style={style(context)}>SUDAMÉRICA · ONE GDN-e</p>
      <h1 className="convergence-h1" style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 className="convergence-h1" style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="convergence-one-block" style={style(one)}>
        <p className="convergence-one-eyebrow">ONE GDN-e</p>
        <strong className="convergence-one-headline">DOS IDENTIDADES<br /><em>UN SOLO EQUIPO</em></strong>
      </div>
    </div>
  </section>
}
