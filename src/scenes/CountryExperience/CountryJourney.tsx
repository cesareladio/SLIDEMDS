import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'
import { rangeProgress } from '../../utils/scrollMotion'

const MILESTONES = [
  { year: 2016, people: 31 },
  { year: 2020, people: 373, inflection: true },
  { year: 2021, people: 897 },
  { year: 2022, people: 1195 },
  { year: 2026, people: 1408 },
]

export function CountryJourney({ history, progress }: { history: { year: number; people: number; milestone?: string; inflection?: boolean }[]; progress: number }) {
  const local = getSegmentProgress('peru', 'journey', progress)
  const opacity = segmentFadeOpacity('peru', 'journey', progress, .025)
  const scaleReveal = Math.min(1, Math.max(0, (local - .5) / .3))
  const lineProgress = Math.min(1, local)

  return <section className="country-scroll-journey editorial-timeline" style={{ opacity }}>
    <p className="country-scroll-kicker">NUESTRO CAMINO</p>

    {/* 5× hero */}
    <div className="timeline-hero" style={{ opacity: scaleReveal, transform: `translateY(${(1 - scaleReveal) * 18}px)` }}>
      <strong>5×</strong><span>CRECIMIENTO<br />~24 MESES</span>
    </div>

    {/* Editorial horizontal timeline */}
    <div className="editorial-timeline-track">
      {/* Line that draws proportional to scroll */}
      <div className="timeline-line" style={{ width: `${lineProgress * 100}%` }} />

      {MILESTONES.map((item, index) => {
        const itemFrac = index / (MILESTONES.length - 1)
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
