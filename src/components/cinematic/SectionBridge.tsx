'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { lerp } from '@/lib/cinematic'

interface SectionBridgeProps {
  /** 0 = cool mist, 1 = warm golden dissolve */
  warmth?: number
}

/**
 * Soft fog dissolve between homepage sections — no hard cuts.
 */
export function SectionBridge({ warmth = 0.35 }: SectionBridgeProps) {
  const ref = useRef<HTMLDivElement>(null)

  // useGSAP handles automatic cleanup of ScrollTriggers and contexts
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0.45, filter: 'blur(10px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 55%',
          scrub: 1.8,
        },
      },
    )
  }, { scope: ref })

  const coolR = Math.floor(lerp(3, 18, warmth))
  const coolG = Math.floor(lerp(8, 12, warmth))
  const coolB = Math.floor(lerp(22, 8, warmth))

  return (
    <div
      ref={ref}
      className="section-bridge relative -mt-px h-[10vh] min-h-[72px] w-full pointer-events-none z-[3]"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(${coolR},${coolG},${coolB},0) 0%,
          rgba(${coolR},${coolG},${coolB},${0.35 + warmth * 0.15}) 35%,
          rgba(248,245,239,${0.85 + warmth * 0.1}) 70%,
          rgba(248,245,239,1) 100%
        )`,
      }}
      aria-hidden
    />
  )
}

export default SectionBridge
