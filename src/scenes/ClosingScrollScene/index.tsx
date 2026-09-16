import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function ClosingScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'closing') return null
  const chile = fadeWindow(p, .1, .18, .23, .3)
  const peru = fadeWindow(p, .23, .31, .38, .45)
  const identities = fadeWindow(p, .45, .51, .6, .66)
  const team = fadeWindow(p, .58, .65, .72, .78)
  const one = fadeWindow(p, .7, .77, .9, .94)
  const ntt = fadeWindow(p, .88, .93, .97, .99)
  const everywhere = fadeWindow(p, .96, .98, 1, 1.01)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 16}px)`, filter: `blur(${(1 - opacity) * 6}px)` })
  return <section className="scene closing-scroll-scene">
    <div className="closing-scroll-copy">
      <div className="closing-country" style={style(chile)}><strong>CHILE</strong><span>LA MAGIA DEL SUR</span></div>
      <div className="closing-country" style={style(peru)}><strong>PERÚ</strong><span>TALENTO QUE ENCIENDE EL FUTURO</span></div>
      <h1 style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="closing-one" style={style(one)}><strong>ONE GDN-e</strong><span>UNA CAPACIDAD SIN FRONTERAS</span></div>
      <strong className="closing-ntt" style={style(ntt)}>NTT DATA</strong>
      <strong className="closing-everywhere" style={style(everywhere)}>AI EVERYWHERE.</strong>
    </div>
  </section>
}
