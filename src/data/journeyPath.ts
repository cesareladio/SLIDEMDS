import { history } from './history'

export type SpatialPoint = [number, number, number]

export interface JourneyWaypoint {
  year: number
  people: number
  milestone?: string
  inflection?: boolean
  position: SpatialPoint
}

const coordinates: SpatialPoint[] = [
  [-3.8, -1.3, -3.7], [-3.05, -1.1, -2.9], [-2.3, -.78, -2.1], [-1.52, -.5, -1.25], [-.72, -.05, -.35],
  [.2, .72, .55], [1.05, 1.15, 1.4], [1.86, 1.28, 2.1], [2.55, 1.3, 2.74], [3.25, 1.72, 3.55], [3.92, 1.6, 4.25],
]

function finitePosition(position: SpatialPoint): SpatialPoint {
  return position.every(Number.isFinite) ? position : [0, 0, 0]
}

export const journeyWaypoints: JourneyWaypoint[] = history.map((item, index) => ({ ...item, position: finitePosition(coordinates[index] ?? [0, 0, 0]) }))

export const journeyCameraPath = journeyWaypoints.map(({ position }) => finitePosition([position[0] - .25, position[1] + .24, position[2] + 4.85]))

export const editableBusinessMilestonePlaceholders = ['Remote work', 'Testing', 'SAP', 'BCP', 'Pandemia'] as const
