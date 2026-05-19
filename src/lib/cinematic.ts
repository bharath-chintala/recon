// Shared cinematic motion constants
export const CINEMATIC_EASE = 'power2.inOut' as const
export const CINEMATIC_EASE_OUT = 'power3.out' as const
export const CINEMATIC_DURATION = 1.4
export const CINEMATIC_STAGGER = 0.12

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export function remap(
  v: number,
  inLo: number,
  inHi: number,
  outLo: number,
  outHi: number,
) {
  return clamp(outLo + ((v - inLo) / (inHi - inLo)) * (outHi - outLo), outLo, outHi)
}

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}
