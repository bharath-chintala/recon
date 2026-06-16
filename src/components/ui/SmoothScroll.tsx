'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const tickRef = useRef<((time: number) => void) | null>(null)

  // Determine if current route should skip Lenis (dashboard, login)
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/login')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    // Don't initialise Lenis on dashboard / login routes —
    // native scroll is needed for modal overflow-y-auto to work.
    if (isDashboard) return

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis
    if (typeof window !== 'undefined') {
      ;(window as unknown as { lenis: Lenis }).lenis = lenis
    }

    // Lock scroll immediately if preloader is active
    if (typeof document !== 'undefined') {
      const hasPreloader = document.getElementById('preloader-container')
      if (hasPreloader) {
        lenis.stop()
        document.body.style.overflow = 'hidden'
      }
    }

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    tickRef.current = onTick
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      if (tickRef.current) gsap.ticker.remove(tickRef.current)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      lenisRef.current = null
      tickRef.current = null
      if (typeof window !== 'undefined') {
        delete (window as unknown as { lenis?: Lenis }).lenis
      }
    }
  }, [isDashboard])

  useEffect(() => {
    if (!isDashboard) {
      lenisRef.current?.scrollTo(0, {
        immediate: true,
      })
    }
  }, [pathname, isDashboard])

  return <>{children}</>
}
