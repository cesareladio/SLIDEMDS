import { useMemo } from 'react'
import type { PeruAnchorPoint } from '../three/Globe/PeruTerritorialAnchors'

const ORDER = ['Piura','Lambayeque','La Libertad','Lima','Ica','Arequipa'] as const

interface Props {
  points: PeruAnchorPoint[]
  sceneProgress: number // chapterProgress in peru chapter
}

export function PeruTerritorialLegend({ points, sceneProgress }: Props) {
  if (!points.length || sceneProgress >= 0.34) return null  // hide from Scene 05 onward

  const byLabel = useMemo(() => {
    const map = new Map(points.map(p => [p.label, p]))
    return ORDER.map(label => map.get(label)!).filter(Boolean)
  }, [points])

  const isScene03 = sceneProgress < 0.14

  const rows = byLabel.map((p, idx) => {
    const index = String(idx + 1).padStart(2, '0')
    const isTop3 = ['La Libertad','Lima','Arequipa'].includes(p.label)
    const base = isScene03 ? 0.6 : (isTop3 ? 1 : 0.5)
    const label = isScene03 && (p.label === 'La Libertad' || p.label === 'Arequipa')
      ? `${p.label} · HUB OPERATIVO`
      : p.label
    const value = isScene03
      ? (p.label === 'La Libertad' ? 1048 : p.label === 'Arequipa' ? 360 : undefined)
      : p.people

    return (
      <div key={p.label} className="peru-legend-row" style={{ opacity: base }}>
        <span className="peru-legend-index">{index}</span>
        <span className="peru-legend-name">{label}</span>
        {value !== undefined && <span className="peru-legend-count">{value}</span>}
      </div>
    )
  })

  return (
    <aside className="peru-legend">
      <div className="peru-legend-heading">HUELLA TERRITORIAL</div>
      <div className="peru-legend-list">{rows}</div>
    </aside>
  )
}
