import { useScrollStory } from '../../app/ScrollContext'
import { oneGdneCapabilityBuilding, oneGdneCertificationScale } from '../../data/oneGdne'
import { fadeWindow } from '../../utils/scrollMotion'

export function AIScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ai') return null
  // Beat 1 — One GDN-e certification scale (Scene 15 · canonical .32)
  const cert = fadeWindow(p, .12, .20, .46, .54)
  // Beat 2 — Complementary Peru + Chile capability building (Scene 16 · canonical .68)
  const upskill = fadeWindow(p, .48, .56, .80, .87)
  // Beat 3 — Capability orientation (canonical .92)
  const concepts = fadeWindow(p, .80, .88, 1, 1.02)
  const style = (opacity: number) => ({ opacity, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene ai-scroll-scene">
    <div className="ai-scroll-copy">

      {/* Scene 15 — First One GDN-e proof point: certification scale */}
      <div className="ai-scroll-beat" style={style(cert)}>
        <p className="one-gdne-identifier">GDN-e<br /><small>PERÚ · CHILE</small></p>
        <strong>{oneGdneCertificationScale.currentCertifications}</strong>
        <span>CERTIFICACIONES</span>
        <div className="ai-cert-progression">
          <div className="ai-cert-arrow">→</div>
          <strong>{oneGdneCertificationScale.projectedCertifications.toLocaleString('es-PE')}</strong>
          <span>PROYECCIÓN<br />{oneGdneCertificationScale.projectionLabel}</span>
        </div>
        <div className="ai-cert-proof ai-peru-program">
          <p>{oneGdneCertificationScale.peruProgram.country}</p>
          <div><span>{oneGdneCertificationScale.peruProgram.bonusCertificationSlots} CUPOS</span><span>CERTIFICACIONES BONIFICADAS FY26</span></div>
          <div><span>≥{oneGdneCertificationScale.peruProgram.minimumApprovalTarget}%</span><span>META MÍNIMA DE APROBACIÓN</span></div>
        </div>
        <p className="ai-cert-message">DE CERTIFICAR PERSONAS<br />A GESTIONAR CAPACIDADES</p>
      </div>

      {/* Scene 16 — Complementary country evidence, not an arithmetic comparison */}
      <div className="ai-scroll-beat ai-capability-building" style={style(upskill)}>
        <p className="one-gdne-identifier">GDN-e<br /><small>PERÚ · CHILE</small></p>
        <h2>CAPACIDAD<br /><em>QUE EVOLUCIONA</em></h2>
        <div className="ai-capability-countries">
          <article>
            <p>PERÚ</p>
            <strong>{oneGdneCapabilityBuilding.peru.upskillingRoutes.length}</strong><span>RUTAS DE UPSKILLING</span>
            <div className="ai-upskill-routes">{oneGdneCapabilityBuilding.peru.upskillingRoutes.map(route => <span key={route}>{route}</span>)}</div>
            <small>{oneGdneCapabilityBuilding.peru.platforms.join(' · ')}</small>
            <div className="ai-country-proof"><b>{oneGdneCapabilityBuilding.peru.strategicCertificationsFY26}</b><span>CERTIFICACIONES ESTRATÉGICAS FY26</span></div>
            <small>{oneGdneCapabilityBuilding.peru.partners.join(' · ')}</small>
            <small>MICROSOFT: {oneGdneCapabilityBuilding.peru.microsoftPrograms.join(' · ')}</small>
          </article>
          <i className="ai-capability-link">ONE GDN-e</i>
          <article>
            <p>CHILE</p>
            <strong>{oneGdneCapabilityBuilding.chile.certifiedPeopleToday}</strong><span>PERSONAS CERTIFICADAS HOY</span>
            <div className="ai-chile-progression"><b>{oneGdneCapabilityBuilding.chile.approvalFY26ToDate}%</b><span>APROBACIÓN FY26 A LA FECHA</span><i>→</i><b>{oneGdneCapabilityBuilding.chile.ambitionFY26}</b><span>AMBICIÓN FY26</span></div>
            <small>{oneGdneCapabilityBuilding.chile.percentOfHeadcount}% DEL HC · ≥{oneGdneCapabilityBuilding.chile.approvalTarget}% APROBACIÓN OBJETIVO</small>
          </article>
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
