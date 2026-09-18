import { useScrollStory } from '../../app/ScrollContext'
import { oneGdneCapabilityBuilding, oneGdneCertificationScale } from '../../data/oneGdne'
import { fadeWindow } from '../../utils/scrollMotion'

export function AIScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ai') return null
  // Beat 1 — One GDN-e certification scale (Scene 15 · canonical .32)
  const cert = fadeWindow(p, .12, .20, .46, .54)
  // Beat 2 — Complementary Peru + Chile capability building (Scene 16 · canonical .68)
  const upskill = p >= .56 ? 1 : fadeWindow(p, .48, .56, 2, 3)
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
          <p className="ai-peru-inline">{oneGdneCertificationScale.peruProgram.country} · {oneGdneCertificationScale.peruProgram.bonusCertificationSlots} CUPOS · ≥{oneGdneCertificationScale.peruProgram.minimumApprovalTarget}% APROBACIÓN</p>
          <span>CERTIFICACIONES BONIFICADAS FY26</span>
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
            <div className="ai-country-proof"><b>{oneGdneCapabilityBuilding.peru.strategicCertificationsFY26}</b><span>CERTIFICACIONES ESTRATÉGICAS</span></div>
            <small>{oneGdneCapabilityBuilding.peru.platforms.join(' · ')} · {oneGdneCapabilityBuilding.peru.partners.join(' · ')} · MICROSOFT</small>
          </article>
          <i className="ai-capability-link">ONE GDN-e</i>
          <article>
            <p>CHILE</p>
            <strong>{oneGdneCapabilityBuilding.chile.certifiedPeopleToday}</strong><span>CERTIFICADOS HOY</span>
            <div className="ai-chile-progression"><i>→</i><b>{oneGdneCapabilityBuilding.chile.ambitionFY26}</b><span>FY26</span></div>
            <small>100% APROBACIÓN HOY · {oneGdneCapabilityBuilding.chile.percentOfHeadcount}% HC · OBJETIVO ≥{oneGdneCapabilityBuilding.chile.approvalTarget}%</small>
          </article>
        </div>
      </div>

    </div>
  </section>
}
