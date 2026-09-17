import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow, rangeProgress } from '../../utils/scrollMotion'
import { ClosingCountrySilhouette } from './ClosingCountrySilhouette'
import { CLOSING_SEGMENT_BY_ID, type ClosingSegment } from './segments'

function segmentOpacity(progress: number, segment: ClosingSegment) {
  const enterOpacity = rangeProgress(progress, segment.enter[0], segment.enter[1])
  if (!segment.exit) return enterOpacity
  return fadeWindow(progress, segment.enter[0], segment.enter[1], segment.exit[0], segment.exit[1])
}

export function ClosingScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'closing') return null
  const chile = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.chile)
  const peru = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.peru)
  const pair = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.pair)
  const identities = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.identities)
  const team = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.team)
  const one = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.one)
  const ntt = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.ntt)
  const everywhere = segmentOpacity(p, CLOSING_SEGMENT_BY_ID.everywhere)
  const finalBackdrop = rangeProgress(p, CLOSING_SEGMENT_BY_ID.one.exit![0], CLOSING_SEGMENT_BY_ID.ntt.enter[1])
  const style = (opacity: number) => ({ opacity, transform: `translateY(${(1 - opacity) * 16}px)`, filter: `blur(${(1 - opacity) * 6}px)` })
  return <section className="scene closing-scroll-scene">
    <div className="closing-final-backdrop" style={{ opacity: finalBackdrop }} aria-hidden="true" />
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
      <div className="closing-one" style={style(one)}><strong>ONE<br />GDN-e</strong><span>UNA CAPACIDAD SIN FRONTERAS</span></div>
      <strong className="closing-ntt" style={style(ntt)}>NTT DATA</strong>
      <strong className="closing-everywhere" style={style(everywhere)}>AI EVERYWHERE.</strong>
    </div>
  </section>
}
