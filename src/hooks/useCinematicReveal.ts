'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CINEMATIC_DURATION, CINEMATIC_EASE_OUT } from '@/lib/cinematic'

/**
 * GSAP blur-to-sharp reveal for a single element ref.
 *
 * Uses useGSAP to set initial opacity/blur and trigger animations.
 */
export function useCinematicReveal<T extends HTMLElement = HTMLDivElement>(
  deps: readonly unknown[] = [],
) {
  const ref = useRef<T>(null)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y: 28, filter: 'blur(12px)' })
    gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: CINEMATIC_DURATION,
      ease: CINEMATIC_EASE_OUT,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  }, { dependencies: deps as any[], scope: ref })

  return ref
}
