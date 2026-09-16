export function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
}

export function rangeProgress(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0
  return clamp01((progress - start) / (end - start))
}

export function fadeWindow(progress: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number): number {
  const enterP = rangeProgress(progress, enterStart, enterEnd)
  const exitP  = rangeProgress(progress, exitStart,  exitEnd)
  const smoothEnter = enterP * enterP * (3 - 2 * enterP)
  const smoothExit  = exitP  * exitP  * (3 - 2 * exitP)
  return clamp01(smoothEnter - smoothExit)
}

export function lerpNumber(a: number, b: number, t: number): number {
  const s = clamp01(t)
  return Number.isFinite(a) && Number.isFinite(b) ? a + (b - a) * s : a
}
