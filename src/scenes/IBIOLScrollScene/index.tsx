import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow } from '../../utils/scrollMotion'
import { ibiol } from '../../data/ibiol'

export function IBIOLScrollScene() {
  const { chapter, chapterProgress: p } = useScrollStory()
  if (chapter !== 'ibiol') return null
  const handoff = fadeWindow(p, 0, .08, .08, .14)
  const today = fadeWindow(p, .1, .18, .34, .42)
  const grow = fadeWindow(p, .36, .44, .60, .68)
  const ask = fadeWindow(p, .62, .70, .82, .89)
  const final = fadeWindow(p, .84, .91, 1, 1.02)
  const style = (opacity: number, y = 0) => ({ opacity, transform: `translateY(${y}px)`, filter: `blur(${(1 - opacity) * 7}px)` })
  return <section className="scene ibiol-scroll-scene">
    <div className="ibiol-scroll-copy">
      <p className="eyebrow" style={style(handoff)}>AI CAPABILITY → BUSINESS CAPABILITY</p>
      <div className="ibiol-scroll-stage">
        <div className="ibiol-scroll-beat" style={style(today)}><strong>HOY</strong><span>CAPACIDADES LISTAS PARA ESCALAR</span><p>{ibiol.todayCapabilities.map(item => item.label).join(' · ')}</p></div>
        <div className="ibiol-scroll-beat" style={style(grow)}><strong>CRECER</strong><span>FY26 / FY27</span><p>{ibiol.growthIndustries.map(item => item.label).join(' · ')}</p><small>{ibiol.growthCapabilities.map(item => item.label).join(' · ')}</small></div>
        <div className="ibiol-scroll-beat" style={style(ask)}><strong>ACELERAR</strong><span>{ibiol.asks.join(' · ')}</span></div>
        <div className="ibiol-scroll-beat ibiol-scroll-final" style={style(final)}><p>{ibiol.finalMessage}</p></div>
      </div>
    </div>
  </section>
}
