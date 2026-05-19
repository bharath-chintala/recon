'use client'

import { useEffect, useRef, useCallback } from 'react'
import { remap, smoothstep } from '@/lib/cinematic'

interface Dust {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  phase: number
  warm: number
}

interface FogBlob {
  x: number
  y: number
  w: number
  h: number
  a: number
  speed: number
  hue: number
}

/**
 * Fixed full-viewport atmospheric canvas — fog, dust, breathing glow.
 * Scroll depth warms the palette (spiritual energy buildup).
 */
export function GlobalAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const dustRef = useRef<Dust[]>([])
  const fogRef = useRef<FogBlob[]>([])
  const scrollRef = useRef(0)
  const timeRef = useRef(0)
  const rafRef = useRef(0)
  const dprRef = useRef(1)

  const init = useCallback(() => {
    dustRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00004,
      vy: -(Math.random() * 0.00006 + 0.00002),
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.12 + 0.02,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random(),
    }))
    fogRef.current = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random(),
      y: 0.2 + (i / 5) * 0.6,
      w: 0.4 + Math.random() * 0.35,
      h: 0.06 + Math.random() * 0.1,
      a: 0.03 + Math.random() * 0.04,
      speed: (Math.random() - 0.5) * 0.00003,
      hue: 210 + Math.random() * 25,
    }))
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dprRef.current
    canvas.height = h * dprRef.current
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d', { alpha: true })
    if (ctx) {
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
      ctxRef.current = ctx
    }
  }, [])

  useEffect(() => {
    init()
    resize()

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)

    let last = 0
    const loop = (ts: number) => {
      if (!last) last = ts
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      timeRef.current += dt

      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const w = canvas.width / dprRef.current
      const h = canvas.height / dprRef.current
      const depth = scrollRef.current
      const warmth = smoothstep(remap(depth, 0, 0.85, 0, 1))
      const breath = 0.5 + Math.sin(timeRef.current * 0.35) * 0.5

      ctx.clearRect(0, 0, w, h)

      // Soft vignette haze at edges
      const edge = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.72)
      edge.addColorStop(0, 'rgba(0,0,0,0)')
      edge.addColorStop(1, `rgba(3,8,22,${0.06 + warmth * 0.04})`)
      ctx.fillStyle = edge
      ctx.fillRect(0, 0, w, h)

      // Fog layers
      const fogMult = 0.35 + warmth * 0.45 + breath * 0.08
      fogRef.current.forEach((f) => {
        f.x += f.speed
        if (f.x > 1.2) f.x = -0.2
        if (f.x < -0.2) f.x = 1.2

        const hue = f.hue - warmth * 40
        const grd = ctx.createRadialGradient(f.x * w, f.y * h, 0, f.x * w, f.y * h, f.w * w)
        const a = f.a * fogMult
        grd.addColorStop(0, `hsla(${hue},28%,78%,${a})`)
        grd.addColorStop(1, `hsla(${hue},20%,65%,0)`)
        ctx.beginPath()
        ctx.ellipse(f.x * w, f.y * h, f.w * w, f.h * h, 0, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      // Golden / cool dust
      dustRef.current.forEach((p) => {
        const bob = Math.sin(timeRef.current * 0.45 + p.phase) * 0.00004
        p.x += p.vx
        p.y += p.vy + bob
        if (p.y < -0.05) p.y = 1.05
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05

        const hue = 38 + p.warm * warmth * 28 + (1 - warmth) * (200 + p.warm * 20)
        const alpha = p.a * (0.6 + warmth * 0.8 + breath * 0.15)
        const grd = ctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, p.r * 5)
        grd.addColorStop(0, `hsla(${hue},75%,72%,${alpha})`)
        grd.addColorStop(1, `hsla(${hue},60%,60%,0)`)
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [init, resize])

  return (
    <canvas
      ref={canvasRef}
      className="cinematic-atmosphere-canvas pointer-events-none fixed inset-0 z-[2]"
      aria-hidden
    />
  )
}
