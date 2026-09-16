/**
 * Shared choreography anchors for the sequential Earth → Peru → Chile →
 * Convergence flow. These constants exist so Globe.tsx (Earth transform)
 * and CameraRig.tsx (camera transform) always agree on the exact frame
 * where one chapter's exit ends and the next chapter's entry begins —
 * guaranteeing a continuous, jump-free, reverse-safe transition without
 * any shared runtime state between chapters.
 */

export interface EarthComposition {
  position: [number, number, number]
  scale: number
}

export interface CameraComposition {
  camera: [number, number, number]
  lookAt: [number, number, number]
}

/**
 * "South America / Pacific" pass-through composition.
 * Peru's exit (.92 → 1) ends here; Chile's entry (0 → .16) starts here.
 */
export const bridgeEarthComposition: EarthComposition = { position: [0, -.15, 0], scale: 1.0 }
export const bridgeCameraComposition: CameraComposition = { camera: [0, -.05, 6.2], lookAt: [0, -.1, 0] }

/**
 * Convergence-entry composition. Chile's exit (.88 → 1) ends here, and
 * ConvergenceScene's own p=0 frame starts from the exact same values.
 */
export const convergenceStartEarthComposition: EarthComposition = { position: [.5, -.85, 0], scale: .94 }
export const convergenceStartCameraComposition: CameraComposition = { camera: [0, -.1, 7.0], lookAt: [.5, -.85, 0] }
