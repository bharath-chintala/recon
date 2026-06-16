'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { fadeInUp, blurIn, stagger } from '@/animations/variants'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// ─── Frame Config ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 50
const FRAME_BASE = '/images/frames2/ezgif-frame-'
const HERO_BG = '#030816' // matches hero overlays — prevents flash through canvas
// 600vh = very slow, meditative cinematic pacing
const SCROLL_HEIGHT = '250vh'

function isFrameReady(img: HTMLImageElement | undefined): img is HTMLImageElement {
  return !!img?.complete && img.naturalWidth > 0
}

function padFrame(n: number) {
  return String(n).padStart(3, '0')
}
function getFrameSrc(i: number) {
  return `${FRAME_BASE}${padFrame(i + 1)}.webp`
}

// ─── Easing helpers ───────────────────────────────────────────────────────────
function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}
function easeInQuad(t: number) {
  return t * t
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
// Map a value from [inLo, inHi] → [outLo, outHi] clamped
function remap(v: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  return clamp(outLo + ((v - inLo) / (inHi - inLo)) * (outHi - outLo), outLo, outHi)
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface DustParticle {
  x: number; y: number
  vx: number; vy: number
  radius: number
  baseAlpha: number
  hue: number
  phase: number     // for gentle sine bob
}

interface FogLayer {
  x: number          // 0-1 normalised
  y: number
  w: number          // radius x (0-1)
  h: number          // radius y (0-1)
  alpha: number
  speed: number      // horizontal drift speed
  hue: number
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
export function HeroSection() {
  console.count('HeroSection Render')

  // ── DOM refs ──────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const frameCanvasRef = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const fogCanvasRef = useRef<HTMLCanvasElement>(null)
  const raysCanvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const textWrapRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)

  // ── State refs ──────────────────────────────────────────────────────────────
  const imagesRef = useRef<HTMLImageElement[]>([])
  const scrollProg = useRef(0)        // 0-1 raw GSAP progress
  const smoothProg = useRef(0)        // lerped version used in render
  const rafRef = useRef(0)
  const dustRef = useRef<DustParticle[]>([])
  const fogLayersRef = useRef<FogLayer[]>([])
  const timeRef = useRef(0)        // elapsed seconds for autonomous animation
  const lastTsRef = useRef(0)
  const dprRef = useRef(1)
  const loadedRef = useRef(0)
  const framesReadyRef = useRef(false)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(true)

  // ── Offscreen canvas refs for caching fog & god rays ───────────────────────
  const fogOffscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fogOffscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const raysOffscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const raysOffscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null)

  // ── Redundant frame rendering guards ────────────────────────────────────────
  const lastFramePosRef = useRef(-1)
  const lastZoomRef = useRef(-1)
  const lastPanYRef = useRef(-1)
  const lastDprRef = useRef(-1)

  // ── Pre-cache canvas contexts (avoid repeated getContext calls) ─────────────
  const frameCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const particleCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const fogCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const raysCtxRef = useRef<CanvasRenderingContext2D | null>(null)

  // ─── Init particles with adaptive counts based on window size ───────────────
  const initParticles = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024
    const count = w >= 1024 ? 60 : w >= 768 ? 40 : 20
    dustRef.current = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00009,
      vy: -(Math.random() * 0.00018 + 0.00003),
      radius: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.18 + 0.03,
      hue: Math.random() * 35 - 5,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  // ─── Init fog layers ─────────────────────────────────────────────────────────
  const initFog = useCallback(() => {
    fogLayersRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: 0.55 + (i / 6) * 0.35,
      w: 0.35 + Math.random() * 0.4,
      h: 0.08 + Math.random() * 0.12,
      alpha: 0.04 + Math.random() * 0.06,
      speed: (Math.random() - 0.5) * 0.00008,
      hue: 200 + Math.random() * 30,   // cool Himalayan blue-grey
    }))
  }, [])

  // ─── Draw a single image cover-fitted ───────────────────────────────────────
  const drawImgCover = useCallback((
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
    zoom: number,
    panY: number,    // vertical pan offset in px (parallax)
  ) => {
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = (w - dw) / 2
    const dy = (h - dh) / 2 + panY

    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.scale(zoom, zoom)
    ctx.translate(-w / 2, -h / 2)
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.restore()
  }, [])

  // ─── Draw frames with crossfade ───────────────────────────────────────────
  const drawFrames = useCallback((rawFrame: number, prog: number) => {
    const ctx = frameCtxRef.current
    const canvas = frameCanvasRef.current
    if (!ctx || !canvas) return

    const w = canvas.width / dprRef.current
    const h = canvas.height / dprRef.current

    // Linear frame index from scroll — matches wheel / scrub motion 1:1
    const framePos = clamp(rawFrame, 0, TOTAL_FRAMES - 1)
    const idxA = Math.floor(framePos)
    const idxB = Math.min(idxA + 1, TOTAL_FRAMES - 1)
    const blend = framePos - idxA

    // Slow cinematic zoom: 1.0 at start → 1.15 at end
    const zoom = 1 + prog * 0.15

    // Subtle vertical parallax: images drift up slightly as camera "orbits"
    const panY = prog * -h * 0.04

    // Render Guard: skip drawing entirely if parameters are unchanged
    if (
      framePos === lastFramePosRef.current &&
      zoom === lastZoomRef.current &&
      panY === lastPanYRef.current &&
      dprRef.current === lastDprRef.current
    ) {
      return
    }

    lastFramePosRef.current = framePos
    lastZoomRef.current = zoom
    lastPanYRef.current = panY
    lastDprRef.current = dprRef.current

    let imgA = imagesRef.current[idxA]
    let imgB = imagesRef.current[idxB]

    let aReady = isFrameReady(imgA)
    let bReady = isFrameReady(imgB)

    // Fallback: If target frame A is not loaded, find the closest loaded frame
    if (!aReady) {
      for (let dist = 1; dist < TOTAL_FRAMES; dist++) {
        const left = idxA - dist
        const right = idxA + dist
        if (left >= 0 && isFrameReady(imagesRef.current[left])) {
          imgA = imagesRef.current[left]
          aReady = true
          break
        }
        if (right < TOTAL_FRAMES && isFrameReady(imagesRef.current[right])) {
          imgA = imagesRef.current[right]
          aReady = true
          break
        }
      }
    }

    // Fallback: If target frame B is not loaded, find the closest loaded frame
    if (!bReady && idxA !== idxB) {
      for (let dist = 1; dist < TOTAL_FRAMES; dist++) {
        const left = idxB - dist
        const right = idxB + dist
        if (left >= 0 && isFrameReady(imagesRef.current[left])) {
          imgB = imagesRef.current[left]
          bReady = true
          break
        }
        if (right < TOTAL_FRAMES && isFrameReady(imagesRef.current[right])) {
          imgB = imagesRef.current[right]
          bReady = true
          break
        }
      }
    }

    // Never clear to transparent — that flashes the page background during crossfade
    if (!aReady && !bReady) return

    ctx.fillStyle = HERO_BG
    ctx.fillRect(0, 0, w, h)

    // Draw A at full opacity, then B on top — avoids see-through when blend < 1
    if (aReady) {
      ctx.globalAlpha = 1
      drawImgCover(ctx, imgA, w, h, zoom, panY)
    }

    if (idxA !== idxB && bReady) {
      ctx.globalAlpha = aReady ? blend : 1
      drawImgCover(ctx, imgB, w, h, zoom, panY)
    }

    ctx.globalAlpha = 1
  }, [drawImgCover])

  // ─── Draw fog layers with Cached Offscreen Scaling (Upscaled 4x for speed) ──
  const drawFog = useCallback((prog: number) => {
    const ctx = fogCtxRef.current
    const canvas = fogCanvasRef.current
    const offscreenCtx = fogOffscreenCtxRef.current
    const offscreenCanvas = fogOffscreenCanvasRef.current
    if (!ctx || !canvas || !offscreenCtx || !offscreenCanvas) return

    const w = canvas.width / dprRef.current
    const h = canvas.height / dprRef.current
    ctx.clearRect(0, 0, w, h)

    const offW = offscreenCanvas.width / (dprRef.current / 4)
    const offH = offscreenCanvas.height / (dprRef.current / 4)
    offscreenCtx.clearRect(0, 0, offW, offH)

    // Fog intensifies through mid-scroll (peaks at 0.5, eases at end)
    const fogMult = prog < 0.5
      ? remap(prog, 0, 0.5, 0.3, 1.0)
      : remap(prog, 0.5, 1.0, 1.0, 0.6)

    fogLayersRef.current.forEach((f) => {
      // Gentle horizontal drift
      f.x += f.speed
      if (f.x > 1.3) f.x = -0.3
      if (f.x < -0.3) f.x = 1.3

      const grd = offscreenCtx.createRadialGradient(
        f.x * offW, f.y * offH, 0,
        f.x * offW, f.y * offH, f.w * offW,
      )
      const a = f.alpha * fogMult
      grd.addColorStop(0, `hsla(${f.hue},35%,75%,${a})`)
      grd.addColorStop(0.5, `hsla(${f.hue},25%,65%,${a * 0.45})`)
      grd.addColorStop(1, `hsla(${f.hue},20%,60%,0)`)

      offscreenCtx.beginPath()
      offscreenCtx.ellipse(f.x * offW, f.y * offH, f.w * offW, f.h * offH, 0, 0, Math.PI * 2)
      offscreenCtx.fillStyle = grd
      offscreenCtx.fill()
    })

    // Blit onto main canvas upscaled
    ctx.save()
    ctx.scale(4, 4)
    ctx.drawImage(offscreenCanvas, 0, 0, w / 4, h / 4)
    ctx.restore()
  }, [])

  // ─── Draw golden particles (with pre-allocated array / no new allocations) ──
  const drawParticles = useCallback((prog: number, t: number) => {
    const ctx = particleCtxRef.current
    const canvas = particleCanvasRef.current
    if (!ctx || !canvas) return

    const w = canvas.width / dprRef.current
    const h = canvas.height / dprRef.current
    ctx.clearRect(0, 0, w, h)

    // Particles only visible from 15% scroll onwards
    const pProg = remap(prog, 0.15, 0.85, 0, 1)
    if (pProg <= 0) return

    const cx = w * 0.50
    const cy = h * 0.50

    dustRef.current.forEach((p) => {
      // Gentle autonomous bob
      const bob = Math.sin(t * 0.4 + p.phase) * 0.00005

      // Converge toward center as spiritual energy builds
      const pull = easeInQuad(pProg) * 0.0018
      p.x += p.vx + (cx / w - p.x) * pull
      p.y += p.vy + (cy / h - p.y) * pull + bob

      // Edge wrap
      if (p.y < -0.05) p.y = 1.05
      if (p.x < -0.05) p.x = 1.05
      if (p.x > 1.05) p.x = -0.05

      const alphaMult = 1 + easeOutCubic(pProg) * 3.2
      const finalAlpha = Math.min(p.baseAlpha * alphaMult, 0.85)
      const size = p.radius * (1 + pProg * 1.4)
      const hue = 38 + p.hue + pProg * 12   // shifts more golden at end

      // Outer aura
      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, size * 3, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue},80%,65%,${finalAlpha * 0.15})`
      ctx.fill()

      // Inner core
      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue},90%,75%,${finalAlpha * 0.6})`
      ctx.fill()
    })
  }, [])

  // ─── Volumetric god rays with Cached Offscreen Scaling & Adaptive Count ──────
  const drawRays = useCallback((prog: number, t: number) => {
    const ctx = raysCtxRef.current
    const canvas = raysCanvasRef.current
    const offscreenCtx = raysOffscreenCtxRef.current
    const offscreenCanvas = raysOffscreenCanvasRef.current
    if (!ctx || !canvas || !offscreenCtx || !offscreenCanvas) return

    const w = canvas.width / dprRef.current
    const h = canvas.height / dprRef.current
    ctx.clearRect(0, 0, w, h)

    const offW = offscreenCanvas.width / (dprRef.current / 2)
    const offH = offscreenCanvas.height / (dprRef.current / 2)
    offscreenCtx.clearRect(0, 0, offW, offH)

    const rayProg = remap(prog, 0.25, 0.95, 0, 1)
    if (rayProg <= 0) return

    const cx = offW * 0.5
    const cy = offH * 0.48
    const flicker = 0.85 + Math.sin(t * 1.2) * 0.08 + Math.sin(t * 2.3) * 0.04
    
    // Scale count: mobile (3), tablet (5), desktop (7)
    const isMobile = w < 768
    const isTablet = w >= 768 && w < 1024
    const count = isMobile ? 3 : isTablet ? 5 : 7

    for (let i = 0; i < count; i++) {
      const angle = (-0.35 + (i / count) * 0.7) + Math.sin(t * 0.15 + i) * 0.02
      const len = offH * (0.55 + rayProg * 0.35)
      const ex = cx + Math.sin(angle) * len
      const ey = cy - Math.cos(angle) * len * 0.9

      const grd = offscreenCtx.createLinearGradient(cx, cy, ex, ey)
      const a = (0.03 + rayProg * 0.09) * flicker * (0.7 + (i % 3) * 0.1)
      const warm = 38 + prog * 18
      grd.addColorStop(0, `hsla(${warm},85%,72%,${a * 1.4})`)
      grd.addColorStop(0.35, `hsla(${warm},70%,65%,${a * 0.5})`)
      grd.addColorStop(1, 'hsla(40,60%,60%,0)')

      offscreenCtx.beginPath()
      offscreenCtx.moveTo(cx, cy)
      offscreenCtx.lineTo(ex - Math.cos(angle) * 20, ey + Math.sin(angle) * 20)
      offscreenCtx.lineTo(ex + Math.cos(angle) * 20, ey - Math.sin(angle) * 20)
      offscreenCtx.closePath()
      offscreenCtx.fillStyle = grd
      offscreenCtx.fill()
    }

    ctx.save()
    ctx.scale(2, 2)
    ctx.drawImage(offscreenCanvas, 0, 0, w / 2, h / 2)
    ctx.restore()
  }, [])

  // ─── Update CSS overlay layers ────────────────────────────────────────────
  const updateLayers = useCallback((prog: number) => {
    // ── Glow: blue mountain aura → warm saffron divine light ──
    if (glowRef.current) {
      const t = smoothstep(prog)
      const phase = remap(prog, 0.35, 0.75, 0, 1)
      const r = Math.floor(40 + phase * 215)
      const g = Math.floor(90 + phase * 95)
      const b = Math.floor(200 - phase * 160)
      const sz = 60 + prog * 220

      glowRef.current.style.opacity = String(clamp(t * 0.95, 0, 0.95))
      glowRef.current.style.background = `radial-gradient(ellipse 58% 52% at 50% 56%, rgba(${r},${g},${b},${0.22 + prog * 0.52}) 0%, rgba(${r},${g},${b},0.04) 55%, transparent 75%)`
      glowRef.current.style.filter = `blur(${sz}px)`
      glowRef.current.style.transform = `scale(${1 + prog * 0.4})`
    }

    // ── Cinematic overlay: starts lighter → lifts more as light builds ──
    if (overlayRef.current) {
      const topA = Math.max(0.42 - prog * 0.38, 0.04)
      const midA = Math.max(0.18 - prog * 0.12, 0.02)
      const botA = 0.30 + prog * 0.18
      overlayRef.current.style.background =
        `linear-gradient(to bottom, rgba(3,8,22,${topA}) 0%, rgba(3,8,22,${topA * 0.6 + midA * 0.4}) 25%, rgba(3,8,22,${midA}) 50%, rgba(1.5,4,11,${midA * 0.5 + botA * 0.5}) 75%, rgba(0,0,0,${botA}) 100%)`
    }

    // ── Hero copy: fades out in first 25% of scroll ──
    if (heroCopyRef.current) {
      const fadeOut = Math.max(0, 1 - prog * 4)
      heroCopyRef.current.style.opacity = String(fadeOut)
      heroCopyRef.current.style.transform = `translateY(${-prog * 30}px)`
    }

    // ── Text reveal: fades in during final 30% ──
    if (textWrapRef.current) {
      const textProg = remap(prog, 0.70, 1.0, 0, 1)
      const eased = smoothstep(textProg)
      textWrapRef.current.style.opacity = String(eased)
      textWrapRef.current.style.filter = `blur(${Math.max(0, 14 - eased * 14)}px)`
      textWrapRef.current.style.transform = `translateY(${(1 - eased) * 28}px)`
      textWrapRef.current.style.letterSpacing = `${(1 - eased) * 0.12}em`
    }

    if (vignetteRef.current) {
      const v = 0.55 + prog * 0.06
      vignetteRef.current.style.background =
        `radial-gradient(ellipse 92% 88% at 50% 50%, transparent 40%, rgba(0,0,8,${v}) 100%)`
    }

    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - prog * 5))
    }
  }, [])

  // ─── Main render loop ─────────────────────────────────────────────────────
  const renderLoop = useCallback(function loop(ts: number) {
    if (!isInViewRef.current) return
    
    // Delta time for autonomous animation
    if (lastTsRef.current === 0) lastTsRef.current = ts
    const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05) // cap at 50ms
    lastTsRef.current = ts
    timeRef.current += dt

    // Smooth lerp toward scroll target
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024
    const lerpSpeed = isMobileOrTablet ? 7.0 : 4.5
    const follow = 1 - Math.exp(-lerpSpeed * dt)
    const diff = scrollProg.current - smoothProg.current

    // Dead-zone snap: if we're extremely close, lock to avoid infinite micro-jitter
    if (Math.abs(diff) < 0.0003) {
      smoothProg.current = scrollProg.current
    } else {
      smoothProg.current += diff * follow
    }

    const prog = smoothProg.current
    const rawFrame = prog * (TOTAL_FRAMES - 1)

    drawFrames(rawFrame, prog)
    drawFog(prog)
    drawParticles(prog, timeRef.current)
    drawRays(prog, timeRef.current)
    updateLayers(prog)

    rafRef.current = requestAnimationFrame(loop)
  }, [drawFrames, drawFog, drawParticles, drawRays, updateLayers])

  // ─── Loop state control based on visibility/focus ────────────────────────
  const updateLoopState = useCallback(() => {
    const isTabVisible = typeof document !== 'undefined' ? !document.hidden : true
    const isWindowFocused = typeof document !== 'undefined' ? document.hasFocus() : true
    const shouldAnimate = isInViewRef.current && isTabVisible && isWindowFocused

    if (shouldAnimate) {
      if (rafRef.current === 0) {
        lastTsRef.current = 0
        rafRef.current = requestAnimationFrame(renderLoop)
      }
    } else {
      if (rafRef.current !== 0) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
  }, [renderLoop])

  // ─── Resize all canvases (with offscreen caching setup) ─────────────────────
  const resizeAll = useCallback(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    
    // Quality adjustment based on device type:
    const isMobile = w < 768
    const isTablet = w >= 768 && w < 1024
    const maxDPR = isMobile ? 1 : isTablet ? 1.5 : 2
    dprRef.current = Math.min(window.devicePixelRatio || 1, maxDPR)

    const canvases = [frameCanvasRef, particleCanvasRef, fogCanvasRef, raysCanvasRef]
    canvases.forEach((ref) => {
      const c = ref.current
      if (!c) return
      c.width = w * dprRef.current
      c.height = h * dprRef.current
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      const alpha = ref !== frameCanvasRef
      const ctx = c.getContext('2d', { alpha })
      if (ctx) ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
    })
    const frameCtx = frameCanvasRef.current?.getContext('2d', { alpha: false })
    if (frameCtx) {
      frameCtx.imageSmoothingEnabled = true
      frameCtx.imageSmoothingQuality = 'high'
    }
    frameCtxRef.current = frameCtx ?? null
    particleCtxRef.current = particleCanvasRef.current?.getContext('2d') ?? null
    fogCtxRef.current = fogCanvasRef.current?.getContext('2d') ?? null
    raysCtxRef.current = raysCanvasRef.current?.getContext('2d') ?? null
    
    ;[frameCtxRef, particleCtxRef, fogCtxRef, raysCtxRef].forEach((r) => {
      const ctx = r.current
      if (ctx) ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
    })

    // Setup offscreen canvas for fog (downscaled 4x to save fill rate)
    if (typeof document !== 'undefined') {
      if (!fogOffscreenCanvasRef.current) {
        fogOffscreenCanvasRef.current = document.createElement('canvas')
      }
      const fogOffscreen = fogOffscreenCanvasRef.current
      fogOffscreen.width = Math.ceil(w * dprRef.current / 4)
      fogOffscreen.height = Math.ceil(h * dprRef.current / 4)
      const fogOffscreenCtx = fogOffscreen.getContext('2d')
      if (fogOffscreenCtx) {
        fogOffscreenCtx.setTransform(dprRef.current / 4, 0, 0, dprRef.current / 4, 0, 0)
      }
      fogOffscreenCtxRef.current = fogOffscreenCtx
    }

    // Setup offscreen canvas for god rays (downscaled 2x)
    if (typeof document !== 'undefined') {
      if (!raysOffscreenCanvasRef.current) {
        raysOffscreenCanvasRef.current = document.createElement('canvas')
      }
      const raysOffscreen = raysOffscreenCanvasRef.current
      raysOffscreen.width = Math.ceil(w * dprRef.current / 2)
      raysOffscreen.height = Math.ceil(h * dprRef.current / 2)
      const raysOffscreenCtx = raysOffscreen.getContext('2d')
      if (raysOffscreenCtx) {
        raysOffscreenCtx.setTransform(dprRef.current / 2, 0, 0, dprRef.current / 2, 0, 0)
      }
    }
  }, [])

  // ─── Preload frames (fully decoded before scroll) ─────────────────────────────
  const preloadFrames = useCallback(() => {
    loadedRef.current = 0
    framesReadyRef.current = false

    const images: HTMLImageElement[] = []
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = getFrameSrc(i)
      images.push(img)
    }
    imagesRef.current = images

    // Phase 1: Load the first frame immediately for instant LCP
    const firstImg = images[0]
    
    const loadFirstFrame = async () => {
      try {
        if (firstImg.decode) await firstImg.decode()
        if (!firstImg.complete) {
          await new Promise<void>((resolve, reject) => {
            firstImg.onload = () => resolve()
            firstImg.onerror = () => reject()
          })
        }
      } catch (err) {
        console.warn('Failed to load first hero frame:', err)
      } finally {
        loadedRef.current += 1
        // Paint the first frame immediately to eliminate screen blankness during load
        requestAnimationFrame(() => {
          drawFrames(0, 0)
        })
      }
    }

    // Phase 2: Throttle remaining 49 frames in small batches when browser is idle
    const loadRemainingFrames = async () => {
      const batchSize = 5
      const remainingIndices = Array.from({ length: TOTAL_FRAMES - 1 }, (_, i) => i + 1)
      
      for (let i = 0; i < remainingIndices.length; i += batchSize) {
        const batch = remainingIndices.slice(i, i + batchSize)
        await Promise.all(
          batch.map(async (idx) => {
            const img = images[idx]
            try {
              if (img.decode) await img.decode()
              if (!img.complete) {
                await new Promise<void>((resolve, reject) => {
                  img.onload = () => resolve()
                  img.onerror = () => reject()
                })
              }
            } catch {
              /* ignore individual frame failures */
            } finally {
              loadedRef.current += 1
            }
          })
        )
        // Yield to the main thread to prevent long blocking tasks
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      framesReadyRef.current = true
    }

    // Load first frame immediately
    void loadFirstFrame().then(() => {
      if (typeof window !== 'undefined') {
        const runDeferred = () => {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              void loadRemainingFrames()
            }, { timeout: 2000 })
          } else {
            setTimeout(() => {
              void loadRemainingFrames()
            }, 1500)
          }
        }

        if (document.readyState === 'complete') {
          runDeferred()
        } else {
          window.addEventListener('load', runDeferred, { once: true })
        }
      }
    })
  }, [drawFrames])

  // useGSAP handles automatic cleanup of ScrollTriggers and contexts
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    preloadFrames()
    initParticles()
    initFog()
    resizeAll()

    rafRef.current = requestAnimationFrame(renderLoop)

    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Viewport IntersectionObserver to pause/resume the RAF render loop when scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        updateLoopState()
      },
      { threshold: 0.01 }
    )
    observer.observe(wrapper)

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: '+=150%',
      scrub: 1.2,            // matches Lenis scroll duration perfectly
      pin: stickyRef.current,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        scrollProg.current = self.progress
      },
    })

    const onResize = () => resizeAll()
    window.addEventListener('resize', onResize)

    const onVisibilityChange = () => updateLoopState()
    const onFocus = () => updateLoopState()
    const onBlur = () => updateLoopState()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      observer.disconnect()
      if (rafRef.current !== 0) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      // Reset refs
      lastTsRef.current = 0
      timeRef.current = 0
    }
  }, { scope: wrapperRef, dependencies: [preloadFrames, initParticles, initFog, resizeAll, renderLoop, updateLoopState] })

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapperRef} className="relative" style={{ height: SCROLL_HEIGHT }}>

      {/* ── Sticky fullscreen viewport ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: '100vh',
          background: HERO_BG,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* ── LCP Image Placeholder for PageSpeed/Lighthouse ── */}
        <img
          src="/images/frames2/ezgif-frame-001.webp"
          alt="Sacred Journey Heritage Backdrop"
          fetchPriority="high"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 1,              // fully opaque for robust LCP detection
            pointerEvents: 'none',
            zIndex: -1,              // behind the canvas layer
          }}
        />

        {/* ── L0: Frame sequence ── */}
        <canvas
          ref={frameCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1, filter: 'brightness(1.22) contrast(1.04)' }}
          aria-hidden
        />

        {/* ── L1: Volumetric glow ── */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            opacity: 0,
            willChange: 'opacity, transform, filter',
          }}
        />

        {/* ── L2: Atmospheric fog canvas ── */}
        <canvas
          ref={fogCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 2, mixBlendMode: 'screen' }}
          aria-hidden
        />

        {/* ── L2b: Volumetric god rays ── */}
        <canvas
          ref={raysCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 2, mixBlendMode: 'screen', opacity: 0.9 }}
          aria-hidden
        />

        {/* ── L3: Cinematic gradient overlay ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to bottom, rgba(3,8,22,0.65) 0%, rgba(3,8,22,0.5) 25%, rgba(3,8,22,0.28) 50%, rgba(1.5,4,11,0.365) 75%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* ── L4: Bottom smoke gradient (foreground atmosphere) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: 'linear-gradient(to top, rgba(2,5,15,0.40) 0%, rgba(2,5,15,0.10) 18%, transparent 38%)',
          }}
        />

        {/* ── L5: Golden dust particles ── */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 5 }}
          aria-hidden
        />

        {/* ── L6: Vignette ── */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 7,
            background: 'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 40%, rgba(0,0,5,0.55) 100%)',
          }}
        />

        {/* ── L7: Cinematic text reveal ── */}
        <div
          ref={textWrapRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            zIndex: 8,
            opacity: 0,
            filter: 'blur(12px)',
            transform: 'translateY(32px)',
            willChange: 'opacity, filter, transform',
          }}
        >
          <p
            className="mb-5 text-[15px] md:text-[18px] lg:text-[18px] font-bold uppercase"
            style={{
              color: '#000000',
              letterSpacing: '0.6em',
              textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)',
              transform: 'scale(1.05)'
            }}
          >
            Sacred Journey
          </p>

          <h2
            data-cinematic-text
            className="text-center font-serif font-light text-[1.8rem] md:text-[3.8rem] lg:text-[5rem]"
            style={{
              lineHeight: 1.18,
              color: '#ffffff',
              textShadow: '0 0 100px rgba(218,170,55,0.45), 0 0 40px rgba(0,0,0,0.95)',
              letterSpacing: '0.03em',
              WebkitTextStroke: '1.2px rgba(2, 5, 15, 0.8)',
              willChange: 'opacity, filter, transform',
            }}
          >
            Inner Peace<br />
            <span
              style={{
                fontStyle: 'italic',
                color: 'rgba(230,195,108,0.95)',
                textShadow: '0 0 60px rgba(230,195,108,0.45)',
              }}
            >
              Begins Within
            </span>
          </h2>

          {/* Ornamental rule */}
          <div className="mt-10 flex items-center gap-5">
            <div
              className="h-px w-14"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(218,182,90,0.45))' }}
            />
            <span style={{ color: 'rgba(218,182,90,0.45)', fontSize: '9px', letterSpacing: '0.2em' }}>
              ✦
            </span>
            <div
              className="h-px w-14"
              style={{ background: 'linear-gradient(90deg, rgba(218,182,90,0.45), transparent)' }}
            />
          </div>
        </div>

        {/* ── L8: Initial hero copy ── */}
        <div
          ref={heroCopyRef}
          className="absolute inset-0 z-10 mx-auto flex h-full w-full max-w-7xl items-center md:items-end px-6 pb-12 md:pb-20 lg:px-12"
          style={{ willChange: 'opacity, transform' }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-4xl flex flex-col items-center md:items-start text-center md:text-left mt-20 md:mt-0"
          >
            <motion.p
              variants={fadeInUp}
              className="mb-4 md:mb-6 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] md:tracking-[0.32em] text-white/70"
            >
              Celebrating Human Heritage
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="mb-6 md:mb-8 font-serif text-4xl md:text-6xl lg:text-8xl font-light leading-[1.1] text-white"
              style={{ textShadow: '0 2px 50px rgba(0,0,0,0.85)' }}
            >
              Awaken Through <br className="hidden md:block" />
              <span className="italic">Travel</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 md:mb-12 max-w-2xl text-base md:text-xl leading-relaxed text-white/68 font-light tracking-wide"
              style={{ textShadow: '0 1px 25px rgba(0,0,0,0.75)' }}
            >
              Transformative journeys that nourish mind and soul
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
              <Button href="/about" variant="primary" size="lg" className="w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-base md:text-lg">
                Discover Our Mission
              </Button>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('open-upcoming-events'))}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-base md:text-lg border-white/50 text-white hover:bg-white/10 hover:border-white"
              >
                Upcoming Events
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── L9: Scroll indicator ── */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ zIndex: 10 }}
        >
          <span
            className="text-[10px] font-light uppercase tracking-[0.4em]"
            style={{ color: 'rgba(255,255,255,0.30)' }}
          >
            Scroll
          </span>
          <div
            className="relative h-10 w-px overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(218,182,90,0.8), transparent)',
                animation: 'heroScrollLine 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default HeroSection
