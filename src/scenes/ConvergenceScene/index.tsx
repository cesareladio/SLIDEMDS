import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function ConvergenceScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'convergence') return null
  const context = fadeWindow(p, 0, .06, .14, .18)
  const identities = fadeWindow(p, .34, .39, .52, .545)
  const team = fadeWindow(p, .56, .595, .73, .755)
  const one = p >= .82 ? 1 : fadeWindow(p, .78, .82, 2, 3)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 20}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene convergence-scene">
    <div className="convergence-copy">
      <p className="eyebrow" style={style(context)}>SUDAMÉRICA · ONE GDN-e</p>
      <h1 className="convergence-h1" style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 className="convergence-h1" style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="convergence-one-block" style={style(one)}>
        <strong className="convergence-one-headline">ONE<br /><em>GDN-e</em></strong>
      </div>
    </div>
  </section>
}
