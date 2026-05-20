'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const tickerRef = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      infinite: false,
      lerp: 0.09,
    })

    lenisRef.current = lenis
    if (typeof window !== 'undefined') {
      ;(window as any).lenis = lenis
    }

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

    ScrollTrigger.addEventListener('refresh', () => lenis.resize())
    lenis.on('scroll', ScrollTrigger.update)

    const onTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    tickerRef.current = onTicker
    gsap.ticker.add(onTicker)
    gsap.ticker.lagSmoothing(0)

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current)
      ScrollTrigger.scrollerProxy(document.documentElement, {})
      lenis.destroy()
      lenisRef.current = null
      if (typeof window !== 'undefined') {
        delete (window as any).lenis
      }
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => clearTimeout(id)
  }, [pathname])

  return <>{children}</>
}
