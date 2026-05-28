'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CINEMATIC_DURATION, CINEMATIC_EASE_OUT, CINEMATIC_STAGGER } from '@/lib/cinematic'

interface CinematicSectionProps {
  children: ReactNode
  depth?: number
  warmth?: number
  className?: string
}

export function CinematicSection({
  children,
  depth = 0.5,
  warmth = 0.3,
  className = '',
}: CinematicSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = rootRef.current
    const bg = bgRef.current
    const fg = fgRef.current
    if (!root) return

    if (bg) {
      gsap.to(bg, {
        y: -40 * depth,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2,
        },
      })
    }
    if (fg) {
      gsap.to(fg, {
        y: 24 * depth,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      })
    }

    const cinematicText = root.querySelectorAll('[data-cinematic-text]')
    if (cinematicText.length) {
      gsap.set(cinematicText, { opacity: 0, y: 36, filter: 'blur(12px)', letterSpacing: '0.08em' })
      gsap.to(cinematicText, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        letterSpacing: '0em',
        duration: CINEMATIC_DURATION,
        ease: CINEMATIC_EASE_OUT,
        stagger: CINEMATIC_STAGGER,
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })
    }

    // Opt-in only — avoids hiding Framer-managed cards (testimonials, CTA, gallery)
    const cards = root.querySelectorAll('[data-cinematic-reveal]')
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24, scale: 0.985, filter: 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: CINEMATIC_EASE_OUT,
          stagger: 0.07,
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        },
      )
    }
  }, { dependencies: [depth], scope: rootRef })

  const warmGlow = `rgba(218,170,55,${0.04 + warmth * 0.06})`
  const coolGlow = `rgba(40,90,180,${0.03 + (1 - warmth) * 0.04})`

  return (
    <div ref={rootRef} className={`cinematic-section relative ${className}`}>
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-1/4 left-1/4 h-[55%] w-[55%] rounded-full blur-[140px]"
          style={{ background: coolGlow }}
        />
        <div
          className="absolute bottom-0 right-0 h-[45%] w-[50%] rounded-full blur-[120px]"
          style={{ background: warmGlow }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-warm-ivory/80 to-transparent opacity-60" />
      </div>

      <div className="relative z-[1]">{children}</div>

      <div
        ref={fgRef}
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden
      >
        <div className="cinematic-fg-particle absolute left-[12%] top-[20%] h-1 w-1 rounded-full bg-amber-200/30" />
        <div className="cinematic-fg-particle absolute right-[18%] top-[45%] h-0.5 w-0.5 rounded-full bg-white/25 [animation-delay:2s]" />
        <div className="cinematic-fg-particle absolute left-[70%] bottom-[30%] h-1 w-1 rounded-full bg-amber-100/20 [animation-delay:4s]" />
      </div>
    </div>
  )
}

