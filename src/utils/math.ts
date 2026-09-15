export const finite = (value: unknown, fallback = 0) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, finite(value, min)))

export const formatNumber = (value: number) => new Intl.NumberFormat('es-PE').format(finite(value))
