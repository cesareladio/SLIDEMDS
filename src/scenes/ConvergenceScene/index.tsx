import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function ConvergenceScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'convergence') return null
  const context = fadeWindow(p, 0, .06, .14, .18)
  const identities = fadeWindow(p, .10, .16, .42, .48)
  const team = fadeWindow(p, .34, .40, .66, .72)
  const one = p >= .78 ? 1 : fadeWindow(p, .68, .78, 2, 3)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 20}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene convergence-scene">
    <div className="convergence-copy">
      <p className="eyebrow" style={style(context)}>GDN-e · PERÚ <i className="convergence-flag convergence-flag-peru" aria-hidden="true" /> · CHILE <i className="convergence-flag convergence-flag-chile" aria-hidden="true" /></p>
      <h1 className="convergence-h1" style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 className="convergence-h1" style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="convergence-one-block" style={style(one)}>
        <strong className="convergence-one-headline">ONE<br /><em>GDN-e</em></strong>
      </div>
    </div>
  </section>
}
