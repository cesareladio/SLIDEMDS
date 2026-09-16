import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function ConvergenceScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'convergence') return null
  const context = fadeWindow(p, 0, .08, .18, .34)
  const countries = fadeWindow(p, .12, .24, .72, .9)
  const identities = fadeWindow(p, .34, .42, .55, .64)
  const team = fadeWindow(p, .54, .62, .75, .83)
  const one = fadeWindow(p, .76, .84, 1, 1.02)
  const style = (opacity: number, y = 0) => ({ opacity, transform: `translateY(${y}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene convergence-scene">
    <div className="convergence-copy">
      <p className="eyebrow" style={style(context)}>SUDAMÉRICA · ONE GDN-e</p>
      <p className="convergence-countries" style={style(countries)}>PERÚ <em>×</em> CHILE</p>
      <h1 style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="convergence-one" style={style(one)}><span>ONE GDN-e</span><strong>DOS IDENTIDADES<br /><em>UN SOLO EQUIPO</em></strong></div>
    </div>
  </section>
}
