import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'
import { ClosingCountrySilhouette } from './ClosingCountrySilhouette'

export function ClosingScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'closing') return null
  const chile = fadeWindow(p, .02, .08, .22, .27)
  const peru = fadeWindow(p, .24, .29, .38, .43)
  const pair = fadeWindow(p, .40, .44, .50, .54)
  const identities = fadeWindow(p, .51, .54, .61, .635)
  const team = fadeWindow(p, .64, .67, .72, .745)
  const pullback = fadeWindow(p, .72, .75, .84, .87)
  const one = fadeWindow(p, .84, .865, .915, .935)
  const ntt = fadeWindow(p, .94, .95, .968, .98)
  const everywhere = fadeWindow(p, .982, .99, 1, 1.01)
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
      <h1 style={style(identities)}>DOS<br />IDENTIDADES</h1>
      <h1 style={style(team)}>UN SOLO<br />EQUIPO</h1>
      <div className="closing-pullback" style={style(pullback)}><span>SOUTH AMERICA</span></div>
      <div className="closing-one" style={style(one)}><strong>ONE<br />GDN-e</strong><span>UNA CAPACIDAD SIN FRONTERAS</span></div>
      <strong className="closing-ntt" style={style(ntt)}>NTT DATA</strong>
      <strong className="closing-everywhere" style={style(everywhere)}>AI EVERYWHERE.</strong>
    </div>
  </section>
}
