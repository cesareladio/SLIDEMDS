import { getSegmentProgress, segmentFadeOpacity } from '../../data/countryScroll'

export function CountryJourney({ history, progress }: { history: { year: number; people: number; milestone?: string; inflection?: boolean }[]; progress: number }) {
  const local = getSegmentProgress('peru', 'journey', progress)
  const opacity = segmentFadeOpacity('peru', 'journey', progress, .025)
  const visible = history.filter((_, index) => local >= index / (history.length - 1) - .04)
  const scale = Math.min(1, Math.max(0, (local - .55) / .2))

  return <section className="country-scroll-journey" style={{ opacity }}>
    <p className="country-scroll-kicker">NUESTRO CAMINO</p>
    <div className="country-scroll-journey-years">
      {visible.map(item => <span key={item.year} className={item.inflection ? 'inflection' : ''}>{item.year}<b>{item.people.toLocaleString('es-PE')}</b></span>)}
    </div>
    <div className="country-scroll-scale" style={{ opacity: scale, transform: `translateY(${(1 - scale) * 18}px)` }}>
      <strong>5×</strong><span>ESCALA EN<br />~24 MESES</span>
    </div>
  </section>
}
