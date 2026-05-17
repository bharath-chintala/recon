'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
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
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Create a master timeline for the scroll reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%', // triggers a bit earlier
        toggleActions: 'play reverse play reverse', // Replays every time entering from top OR bottom
      }
    })

    // 1. Staggered reveal for the mosaic images
    tl.fromTo('.about-img-container', 
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 50 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: 'power4.out' },
      'start'
    )
    
    // Scale down the inner image slightly to create a zoom-out reveal effect
    tl.fromTo('.about-img-inner',
      { scale: 1.3 },
      { scale: 1, stagger: 0.15, duration: 1.2, ease: 'power3.out' },
      'start'
    )

    // 2. Reveal text block elements staggered
    tl.fromTo('.about-text-item',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' },
      'start+=0.3'
    )

    // 3. Reveal the Stats block at the bottom
    tl.fromTo(statsRef.current,
      { y: 50, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      'start+=0.5'
    )
  }, { scope: containerRef })

  return (
    <section
      id="about-preview"
      ref={containerRef}
      className="relative bg-[#FBFBFB] py-24 lg:py-36 overflow-hidden"
    >
      {/* Decorative background blob animated with Framer Motion */}
      <motion.div 
        className="pointer-events-none absolute -right-64 top-0 h-[600px] w-[600px] rounded-full bg-[#dde6f0] blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
          x: [0, -30, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15, 
          ease: "easeInOut" 
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image mosaic */}
          <div ref={imageWrapperRef} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div 
                  className="about-img-container relative h-64 overflow-hidden rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/temples.jpg"
                    alt="Ancient temple — Recon International heritage"
                    fill
                    className="about-img-inner object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="about-img-container relative h-40 overflow-hidden rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/festivals.jpg"
                    alt="Cultural festival celebration"
                    fill
                    className="about-img-inner object-cover"
                  />
                </motion.div>
              </div>
              <div className="space-y-4 mt-8">
                <motion.div 
                  className="about-img-container relative h-40 overflow-hidden rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/festivals.jpg"
                    alt="Traditional folk art performance"
                    fill
                    className="about-img-inner object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="about-img-container relative h-64 overflow-hidden rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/temples.jpg"
                    alt="Heritage architecture"
                    fill
                    className="about-img-inner object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Floating badge using Framer Motion */}
            <motion.div 
              className="absolute -bottom-6 -right-6 hidden lg:flex items-center gap-3 rounded-2xl bg-[#335C8B] px-6 py-4 shadow-xl shadow-[#335C8B]/30"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <span className="text-3xl font-bold text-white">30</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a3caf0]">
                  Years of
                </p>
                <p className="text-sm font-bold text-white">Cultural Service</p>
              </div>
            </motion.div>
          </div>

          {/* Copy */}
          <div ref={copyRef}>
            <p className="about-text-item mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B]">
              About Recon International
            </p>
            <h2 className="about-text-item mb-6 font-serif text-4xl font-bold leading-tight text-[#1a2d47] lg:text-5xl uppercase">
              About Us
            </h2>
            <p className="about-text-item mb-8 text-lg leading-relaxed text-[#5a7394] font-medium tracking-wide">
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
        <div 
          ref={statsRef}
          className="mt-20 grid grid-cols-2 gap-8 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-[#e0e7ef] lg:grid-cols-4"
        >
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
