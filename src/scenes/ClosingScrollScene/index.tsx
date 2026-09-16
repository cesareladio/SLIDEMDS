import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'
import { ClosingCountrySilhouette } from './ClosingCountrySilhouette'

export function ClosingScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'closing') return null
  const chile = fadeWindow(p, .02, .10, .22, .30)
  const peru = fadeWindow(p, .24, .31, .36, .44)
  const pair = fadeWindow(p, .38, .44, .50, .56)
  const identities = fadeWindow(p, .50, .54, .61, .65)
  const team = fadeWindow(p, .62, .66, .71, .75)
  const pullback = fadeWindow(p, .72, .76, .84, .88)
  const one = fadeWindow(p, .84, .87, .92, .95)
  const ntt = fadeWindow(p, .92, .94, .97, .99)
  const everywhere = fadeWindow(p, .97, .985, 1, 1.01)
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 16}px)`, filter: `blur(${(1 - opacity) * 6}px)` })
  return <section className="scene closing-scroll-scene">
    <div className="closing-scroll-copy">
      <ClosingCountrySilhouette country="chile" opacity={chile} label="CHILE" subtitle="LA MAGIA DEL SUR" />
      <ClosingCountrySilhouette country="peru" opacity={peru} label="PERÚ" subtitle="TALENTO QUE ENCIENDE EL FUTURO" />
      <div className="closing-pair-stage" style={style(pair)}>
        <ClosingCountrySilhouette country="chile" opacity={pair} label="CHILE" subtitle="" pair />
        <i className="closing-pair-link" />
        <ClosingCountrySilhouette country="peru" opacity={pair} label="PERÚ" subtitle="" pair />
      </div>
      <div className="closing-pair" style={style(pair)}>PERÚ <em>×</em> CHILE</div>
      <h1 style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="closing-pullback" style={style(pullback)}><span>SOUTH AMERICA</span></div>
      <div className="closing-one" style={style(one)}><strong>ONE GDN-e</strong><span>UNA CAPACIDAD SIN FRONTERAS</span></div>
      <strong className="closing-ntt" style={style(ntt)}>NTT DATA</strong>
      <strong className="closing-everywhere" style={style(everywhere)}>AI EVERYWHERE.</strong>
    </div>
  </section>
}
