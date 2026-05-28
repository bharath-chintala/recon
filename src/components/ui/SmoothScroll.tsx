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
    // Don't initialise Lenis on dashboard / login routes —
    // native scroll is needed for modal overflow-y-auto to work.
    if (isDashboard) return

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    lenisRef.current = lenis
    if (typeof window !== 'undefined') {
      ;(window as any).lenis = lenis
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
        delete (window as any).lenis
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
