import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'

export function AIScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ai') return null
  // Beat 1 — Peru Certifications (Scene 15 · canonical .32)
  const cert = fadeWindow(p, .12, .20, .46, .54)
  // Beat 2 — Peru Upskilling (Scene 16 · canonical .68)
  const upskill = fadeWindow(p, .48, .56, .80, .87)
  // Beat 3 — Capability orientation (canonical .92)
  const concepts = fadeWindow(p, .80, .88, 1, 1.02)
  const style = (opacity: number) => ({ opacity, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene ai-scroll-scene">
    <div className="ai-scroll-copy">

      {/* Scene 15 — Peru Certifications scale */}
      <div className="ai-scroll-beat" style={style(cert)}>
        <strong>860</strong>
        <span>CERTIFICACIONES<br /><small>HOY · PERÚ</small></span>
        <div className="ai-cert-progression">
          <div className="ai-cert-arrow">→</div>
          <strong>1,500</strong>
          <span>PROYECCIÓN<br />CIERRE Q3</span>
        </div>
        <div className="ai-cert-proof">
          <div><span>46 CUPOS</span><span>CERTIFICACIONES BONIFICADAS FY26</span></div>
          <div><span>≥70%</span><span>META MÍNIMA DE APROBACIÓN</span></div>
        </div>
        <p className="ai-cert-message">DE CERTIFICAR PERSONAS<br />A GESTIONAR CAPACIDADES</p>
      </div>

      {/* Scene 16 — Peru Upskilling routes + strategic certs */}
      <div className="ai-scroll-beat" style={style(upskill)}>
        <strong>3</strong>
        <span>RUTAS DE UPSKILLING</span>
        <div className="ai-upskill-routes">
          <span>DATA</span>
          <span>BACKEND</span>
          <span>FRONTEND</span>
        </div>
        <p className="ai-upskill-detail">IA INTEGRADA · PERCIPIO<br /><small>CAPACIDADES ALINEADAS A LA DEMANDA · BANCA</small></p>
        <div className="ai-cert-proof">
          <div><span>150</span><span>CERTIFICACIONES ESTRATÉGICAS FY26</span></div>
          <div><span>ISTQB · SAP LEARNING HUB · GOOGLE · AWS</span></div>
          <div><span>MICROSOFT</span><span>GH-300 · AI-900 · AI-103</span></div>
        </div>
      </div>

      {/* Beat 3 — Orientation message */}
      <div className="ai-scroll-beat ai-concepts-beat" style={style(concepts)}>
        <div className="ai-concepts-grid">
          <strong>SKILLING</strong>
          <strong>CERTIFICACIÓN</strong>
          <strong className="ai-concepts-upskilling">UPSKILLING</strong>
        </div>
        <p className="ai-concepts-message">PREPARANDO EL TALENTO<br />PARA LO QUE VIENE</p>
      </div>

    </div>
  </section>
}
