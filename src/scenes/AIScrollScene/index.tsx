import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function AIScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ai') return null
  const cert = fadeWindow(p, .12, .20, .46, .54)
  const gh = fadeWindow(p, .48, .56, .80, .87)
  const concepts = fadeWindow(p, .80, .88, 1, 1.02)
  const style = (opacity: number) => ({ opacity, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene ai-scroll-scene">
    <div className="ai-scroll-copy">
      <div className="ai-scroll-beat" style={style(cert)}>
        <strong>4,000</strong>
        <span>CERTIFICACIONES<br />IA / OPENAI</span>
      </div>
      <div className="ai-scroll-beat" style={style(gh)}>
        <strong>50%</strong>
        <span>GH-300<br /><small>DEL COLECTIVO PERÚ</small></span>
      </div>
      <div className="ai-scroll-beat ai-concepts-beat" style={style(concepts)}>
        <div className="ai-concepts-grid">
          <strong>PIMS</strong>
          <strong>SKILLING</strong>
          <strong className="ai-concepts-upskilling">UPSKILLING</strong>
        </div>
        <p className="ai-concepts-message">PREPARANDO EL TALENTO<br />PARA LO QUE VIENE</p>
      </div>
    </div>
  </section>
}
