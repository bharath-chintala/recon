'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { target: 16, suffix: '+', label: 'Nations' },
  { target: 30, suffix: '+ Yrs', label: 'Of Excellence' },
  { target: 160, suffix: '+', label: 'Initiatives Delivered' },
  { target: 50000, suffix: '+', label: 'Lives Touched' },
]

export function AboutPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Reveal section
    gsap.from(imageRef.current, {
      x: -100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })

    gsap.from(copyRef.current, {
      x: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })

    // Stagger text items
    gsap.from('.about-text-item', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    })
  }, { scope: containerRef })

  return (
    <section
      id="about-preview"
      ref={containerRef}
      className="relative bg-stone-50 py-24 lg:py-36 overflow-hidden"
    >
      {/* Decorative background blob */}
      <div className="pointer-events-none absolute -right-64 top-0 h-[600px] w-[600px] rounded-full bg-amber-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image mosaic */}
          <div ref={imageRef} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/temples.jpg"
                    alt="Ancient temple — Recon International heritage"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/festivals.jpg"
                    alt="Cultural festival celebration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/festivals.jpg"
                    alt="Traditional folk art performance"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/temples.jpg"
                    alt="Heritage architecture"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 hidden lg:flex items-center gap-3 rounded-2xl bg-amber-600 px-6 py-4 shadow-xl shadow-amber-600/30">
              <span className="text-3xl font-bold text-white">30</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  Years of
                </p>
                <p className="text-sm font-bold text-white">Cultural Service</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div ref={copyRef}>
            <p className="about-text-item mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              About Recon International
            </p>
            <h2 className="about-text-item mb-6 font-serif text-4xl font-bold leading-tight text-stone-900 lg:text-5xl uppercase">
              About Us
            </h2>
            <p className="about-text-item mb-8 text-lg leading-relaxed text-stone-600 font-medium tracking-wide">
              Recon International bridges tradition with innovation and heritage with contemporary global audiences. Over the past three decades, Recon International has successfully conceptualized and delivered 160+ national and international initiatives across 16 countries.
            </p>
            <div className="about-text-item">
              <Button href="/about" variant="primary" size="lg">
                Our Full Story →
              </Button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 gap-8 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-100 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <Counter
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
