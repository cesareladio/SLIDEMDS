export const oneGdneCertificationScale = {
  narrativeScope: 'one-gdne-after-convergence' as const,
  countrySplitStatus: 'not-validated' as const,
  sourceStatus: 'validated' as const,
  currentCertifications: 860,
  projectedCertifications: 1500,
  projectionLabel: 'CIERRE Q3',
  peruProgram: {
    sourceStatus: 'validated' as const,
    country: 'PERÚ',
    bonusCertificationSlots: 46,
    minimumApprovalTarget: 70,
  },
} as const

export const oneGdneCapabilityBuilding = {
  narrativeScope: 'one-gdne-after-convergence' as const,
  peru: {
    sourceStatus: 'validated' as const,
    upskillingRoutes: ['DATA', 'BACKEND', 'FRONTEND'],
    platforms: ['IA INTEGRADA', 'PERCIPIO'],
    strategicCertificationsFY26: 150,
    partners: ['ISTQB', 'SAP LEARNING HUB', 'GOOGLE', 'AWS'],
    microsoftPrograms: ['GH-300', 'AI-900', 'AI-103'],
  },
  chile: {
    sourceStatus: 'validated' as const,
    certifiedPeopleToday: 206,
    approvalFY26ToDate: 100,
    ambitionFY26: 332,
    percentOfHeadcount: 65,
    approvalTarget: 85,
  },
} as const
