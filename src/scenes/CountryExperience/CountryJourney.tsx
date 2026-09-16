import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

const milestoneYears = [2016, 2020, 2021, 2022, 2026]

export function CountryJourney({ history, progress }: { history: { year: number; people: number; milestone?: string; inflection?: boolean }[]; progress: number }) {
  const local = getSegmentProgress('peru', 'journey', progress)
  const opacity = segmentFadeOpacity('peru', 'journey', progress, .025)
  const scaleReveal = Math.min(1, Math.max(0, (local - .5) / .3))
  const lineProgress = Math.min(1, local)
  const milestones = milestoneYears
    .map(year => history.find(item => item.year === year))
    .filter((item): item is { year: number; people: number; milestone?: string; inflection?: boolean } => Boolean(item))

  return <section className="country-scroll-journey editorial-timeline" style={{ opacity }}>
    <p className="country-scroll-kicker">NUESTRO CAMINO</p>
    <div className="timeline-hero" style={{ opacity: scaleReveal, transform: `translateY(${(1 - scaleReveal) * 18}px)` }}>
      <strong>5×</strong><span>CRECIMIENTO<br />~24 MESES</span>
    </div>
    <div className="editorial-timeline-track">
      <div className="timeline-line" style={{ width: `${lineProgress * 100}%` }} />
      {milestones.map((item, index) => {
        const itemFrac = milestones.length > 1 ? index / (milestones.length - 1) : 0
        const itemReveal = Math.min(1, Math.max(0, (local - itemFrac * .7) / .15))
        return <div key={item.year} className={`timeline-node ${item.inflection ? 'inflection' : ''}`} style={{ left: `${itemFrac * 100}%`, opacity: itemReveal }}>
          <i className="timeline-dot" />
          <span className="timeline-year">{item.year}</span>
          <span className="timeline-people">{item.people.toLocaleString('es-PE')}</span>
          {item.inflection && <span className="timeline-label">PUNTO DE INFLEXIÓN</span>}
        </div>
      })}
    </div>
  </section>
}
