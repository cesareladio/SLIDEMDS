import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'
import type { CertificationProfile } from '../../data/countryProfiles'

export function CountryCertifications({ certifications, progress, countryId = 'chile' }: { certifications: CertificationProfile; progress: number; countryId?: string }) {
  const locale = countryId === 'chile' ? 'es-CL' : 'es-PE'
  const local = getSegmentProgress(countryId as any, 'certifications', progress)
  const opacity = segmentFadeOpacity(countryId as any, 'certifications', progress, .025)
  const heroReveal = Math.min(1, local / .18)
  const timelineReveal = Math.min(1, Math.max(0, (local - .15) / .25))
  // Ambition must be fully visible by canonical landing (0.72 local = 0.72/1.0 = 72%)
  // So it must reach full by 0.55 local progress
  const ambitionReveal = Math.min(1, Math.max(0, (local - .45) / .2))

  return <section className="country-scroll-certifications editorial-timeline" style={{ opacity }}>
    <p className="country-scroll-kicker">CERTIFICACIONES</p>
    <div className="timeline-hero" style={{ opacity: heroReveal, transform: `translateY(${(1 - heroReveal) * 18}px)` }}>
      <strong>{certifications.milestones[certifications.milestones.length - 1].count}</strong>
      <span>CERTIFICADOS HOY</span>
    </div>
    
    <div className="certifications-timeline" style={{ opacity: timelineReveal }}>
      {certifications.milestones.map((m, i) => (
        <div key={`${m.year}-${i}`} className="cert-milestone">
          <span className="cert-year">{m.year}</span>
          <span className="cert-count">{m.count}</span>
          {m.approval !== undefined && <span className="cert-approval">{m.approval}%</span>}
          <span className="cert-label">{m.label}</span>
        </div>
      ))}
    </div>

    <div className="certifications-ambition" style={{ opacity: ambitionReveal, transform: `translateY(${(1 - ambitionReveal) * 14}px)` }}>
      <strong>{certifications.ambition.count}</strong>
      <span>AMBICIÓN {certifications.ambition.year}</span>
      <small>{certifications.ambition.percent}% DEL HC{certifications.ambition.approvalTarget ? ` · ≥${certifications.ambition.approvalTarget}% APROBACIÓN` : ''}</small>
    </div>
  </section>
}
