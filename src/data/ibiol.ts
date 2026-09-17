export type IBIOLPhase = 'today' | 'grow' | 'ask'
export type SpatialPosition = [number, number, number]

// IBIOL data below is retained from previous version for visual continuity.
// Specific capabilities, industries, and growth targets have NOT been confirmed
// by the V3 executive script. All content marked validationStatus:
// 'pending-business-confirmation' must be reviewed before external delivery.
export const ibiol = {
  narrativeScope: 'one-gdne-after-convergence' as const,
  validationStatus: 'pending-business-confirmation' as const,
  subtitle: 'De capacidad disponible a crecimiento compartido.',
  todayCapabilities: [
    { label: 'Testing', position: [-2.1, .8, .3] as SpatialPosition },
    { label: 'SAP', position: [-.8, -1.1, -.6] as SpatialPosition },
    { label: 'Back-End', position: [.25, .95, .45] as SpatialPosition },
    { label: 'Data & AI', position: [1.5, -.45, .8] as SpatialPosition },
    { label: 'Cloud', position: [2.25, 1.15, -.25] as SpatialPosition },
  ],
  growthIndustries: [
    { label: 'Energy', position: [-3.25, 1.25, -1.4] as SpatialPosition },
    { label: 'Mining', position: [0, 1.7, .4] as SpatialPosition },
    { label: 'Insurance', position: [3.3, .9, -1.2] as SpatialPosition },
  ],
  growthCapabilities: [
    { label: 'AI', position: [-2.4, -1.35, 1.45] as SpatialPosition },
    { label: 'Cloud', position: [-.9, -1.75, .25] as SpatialPosition },
    { label: 'Data', position: [.7, -1.5, 1.35] as SpatialPosition },
    { label: 'Automation', position: [2.1, -1.2, .15] as SpatialPosition },
    { label: 'Enterprise Platforms', position: [3.15, -.35, 1.2] as SpatialPosition },
  ],
  // asks confirmed by V3 script — these six categories may remain as-is
  asks: ['Demanda', 'Visibilidad', 'Movilidad', 'Oportunidades', 'Inversión', 'Formación'],
  finalMessage: 'Tenemos capacidad. Tenemos talento. Ahora necesitamos escala.',
} as const

export function finiteIBIOLPosition(position: SpatialPosition): SpatialPosition {
  return position.every(Number.isFinite) ? position : [0, 0, 0]
}
