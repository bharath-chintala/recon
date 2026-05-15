'use client'

import { useEffect, useRef, useMemo } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

interface ParticleFieldProps {
  count?: number
  className?: string
}

const COLORS = ['#335C8B', '#4a7ab5', '#6b9fd4', '#8bb8e8', '#a3caf0']

export function ParticleField({
  count = 60,
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003 - 0.0001,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  }, [count])

  useEffect(() => {
    particlesRef.current = particles.map((p) => ({ ...p }))
  }, [particles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = 1
        if (p.x > 1) p.x = 0
        if (p.y < -0.1) p.y = 1.1

        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  )
}

export default ParticleField
