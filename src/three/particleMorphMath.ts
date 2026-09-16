export function blend(a: Float32Array, b: Float32Array, amount: number, output: Float32Array) {
  const t = Math.min(1, Math.max(0, amount))
  const eased = t * t * (3 - 2 * t)
  for (let i = 0; i < output.length; i++) output[i] = a[i] + (b[i] - a[i]) * eased
}
