'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CINEMATIC_DURATION, CINEMATIC_EASE_OUT } from '@/lib/cinematic'

/**
 * GSAP blur-to-sharp reveal for a single element ref.
 */
export function useCinematicReveal<T extends HTMLElement = HTMLDivElement>(
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y: 28, filter: 'blur(12px)' })
    const anim = gsap.to(el, {
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

    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
