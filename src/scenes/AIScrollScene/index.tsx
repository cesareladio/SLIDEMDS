import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function AIScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ai') return null
  const cert = fadeWindow(p, .12, .20, .46, .54)
  const gh = fadeWindow(p, .48, .56, .80, .87)
  const concepts = fadeWindow(p, .80, .88, 1, 1.02)
  const style = (opacity: number, y = 0) => ({ opacity, transform: `translateY(${y}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene ai-scroll-scene">
    <div className="ai-scroll-copy">
      <div style={style(cert)}><strong>4,000</strong><span>CERTIFICACIONES IA / OPENAI</span></div>
      <div style={style(gh)}><strong>50%</strong><span>GH-300<br /><small>DEL COLECTIVO PERÚ</small></span></div>
      <div className="ai-scroll-concepts" style={style(concepts)}><strong>PIMS</strong><strong>SKILLING</strong><strong>UPSKILLING</strong><p>PREPARANDO EL TALENTO<br />PARA LO QUE VIENE</p></div>
    </div>
  </section>
}
