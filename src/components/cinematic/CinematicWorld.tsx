'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GlobalAtmosphere } from './GlobalAtmosphere'

interface CinematicWorldProps {
  children: ReactNode
}

/**
 * Homepage cinematic shell — global atmosphere, scroll energy, GPU hints.
 */
export function CinematicWorld({ children }: CinematicWorldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const energyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = rootRef.current
    const energy = energyRef.current
    if (!root || !energy) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2.5,
      onUpdate: (self) => {
        const p = self.progress
        root.style.setProperty('--cinematic-depth', String(p))
        energy.style.opacity = String(0.35 + p * 0.45)
        energy.style.background = `radial-gradient(ellipse 80% 50% at 50% ${30 + p * 20}%, rgba(218,170,55,${0.04 + p * 0.12}) 0%, transparent 65%)`
      },
    })

    ScrollTrigger.refresh()

    return () => st.kill()
  }, [])

  return (
    <div
      ref={rootRef}
      className="cinematic-world relative"
      style={{ '--cinematic-depth': '0' } as React.CSSProperties}
    >
      <GlobalAtmosphere />

      {/* Breathing spiritual energy — warms as user scrolls deeper */}
      <div
        ref={energyRef}
        className="pointer-events-none fixed inset-0 z-[1] opacity-40 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(ellipse 75% 45% at 50% 25%, rgba(218,170,55,0.05) 0%, transparent 60%)',
          mixBlendMode: 'soft-light',
        }}
        aria-hidden
      />

      {/* Volumetric light wash */}
      <div
        className="cinematic-light-rays pointer-events-none fixed inset-0 z-[1] opacity-[0.35]"
        aria-hidden
      />

      {/* Persistent film grain */}
      <div className="cinematic-grain pointer-events-none fixed inset-0 z-[4]" aria-hidden />

      <div className="relative z-[5]">{children}</div>
    </div>
  )
}

export default CinematicWorld
