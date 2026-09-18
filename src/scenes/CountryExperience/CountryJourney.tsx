import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'
import type { HistoryItem } from '../../data/countryProfiles'

export function CountryJourney({ history, progress, countryId = 'peru', heroLabel = 'NUESTRO CAMINO', heroValue = '5×', heroSupport = 'CRECIMIENTO~24 MESES' }: { history: HistoryItem[]; progress: number; countryId?: string; heroLabel?: string; heroValue?: string; heroSupport?: string }) {
  const local = getSegmentProgress(countryId as any, 'journey', progress)
  const opacity = segmentFadeOpacity(countryId as any, 'journey', progress, .025)
  const scaleReveal = Math.min(1, Math.max(0, (local - .22) / .2))
  const lineProgress = Math.min(1, local / .85)
  const milestones = history
  const supportLines = heroSupport.split('~')

  return <section className="country-scroll-journey editorial-timeline" style={{ opacity }}>
    <p className="country-scroll-kicker">{heroLabel}</p>
    <div className="timeline-hero" style={{ opacity: scaleReveal, transform: `translateY(${(1 - scaleReveal) * 18}px)` }}>
      <strong>{heroValue}</strong><span>{supportLines.map((line, i) => <>{line}{i < supportLines.length - 1 && <br />}</>)}</span>
    </div>
    <div className="editorial-timeline-track">
      <div className="timeline-line" style={{ width: `${lineProgress * 100}%` }} />
      {milestones.map((item, index) => {
        const itemFrac = milestones.length > 1 ? index / (milestones.length - 1) : 0
        const itemReveal = Math.min(1, Math.max(0, (local - itemFrac * .7) / .15))
        const edgeClass = index === 0 ? 'timeline-node--first'
          : index === milestones.length - 1 ? 'timeline-node--last'
          : ''
        return <div key={`${item.year}-${index}`} className={`timeline-node ${item.inflection ? 'inflection' : ''} ${edgeClass}`} style={{ left: `${itemFrac * 100}%`, opacity: itemReveal }}>
          <i className="timeline-dot" />
          <span className="timeline-year">{item.year}</span>
          {item.location && <span className="timeline-location">{item.location}</span>}
          {item.milestone && <span className="timeline-people">{item.milestone}</span>}
          {item.sublabel && <span className="timeline-sublabel">{item.sublabel}</span>}
          {item.inflection && <span className="timeline-label">PUNTO DE INFLEXIÓN</span>}
        </div>
      })}
    </div>
  </section>
}
