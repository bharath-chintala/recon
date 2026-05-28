'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/Button'
import { viewportOnce } from '@/animations/variants'



const IMAGE_TILTS = [
  {
    // Aarti — back left
    from: { rotation: -5, rotateY: -14, rotateX: 6, y: 36 },
    to: { rotation: 2.5, rotateY: 10, rotateX: -4, y: -28 },
  },
  {
    // Dance — front right
    from: { rotation: 4, rotateY: 12, rotateX: -5, y: 32 },
    to: { rotation: -2, rotateY: -11, rotateX: 5, y: -22 },
  },
  {
    // Temples — bottom
    from: { rotation: -2, rotateY: -9, rotateX: 8, y: 28 },
    to: { rotation: 1.5, rotateY: 8, rotateX: -3, y: -18 },
  },
] as const

export function AboutPreview() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = containerRef.current
      if (!section) return

      // Scoped to `section` — prevents matching .about-preview-image nodes from
      // other components in the page (fixes _getMatrix / _parseTransform errors)
      const images = gsap.utils.toArray<HTMLElement>('.about-preview-image', section)
      if (images.length === 0) return

      gsap.registerPlugin(ScrollTrigger)
      const mm = gsap.matchMedia()

      // Desktop: Full 3D Tilts
      mm.add('(min-width: 768px)', () => {
        images.forEach((el, i) => {
          if (!el || !IMAGE_TILTS[i]) return
          const { from, to } = IMAGE_TILTS[i]

          gsap.set(el, {
            transformPerspective: 1400,
            transformOrigin: 'center center',
            force3D: true,
          })

          gsap.fromTo(
            el,
            { ...from, transformPerspective: 1400 },
            {
              ...to,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
              },
            },
          )
        })
      })

      // Mobile: Lighter 2D Parallax (Smooth)
      mm.add('(max-width: 767px)', () => {
        images.forEach((el, i) => {
          if (!el) return
          
          gsap.set(el, { force3D: true })

          // Simple Y-axis parallax for mobile
          const yOffset = i === 1 ? -30 : i === 2 ? -20 : -40
          
          gsap.fromTo(
            el,
            { y: Math.abs(yOffset) },
            {
              y: yOffset,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'bottom 15%',
                scrub: 0.5,
              },
            },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [] },
  )



  return (
    <section
      id="about-preview"
      ref={containerRef}
      className="relative bg-warm-ivory pt-10 pb-16 lg:pt-14 lg:pb-24 overflow-hidden"
    >
      <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-saffron/5 via-royal/5 to-transparent blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-royal/5 via-saffron/5 to-transparent blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute top-12 right-12 w-96 h-96 opacity-[0.03] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-royal w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" stroke="currentColor" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-10 md:gap-12 lg:gap-20 md:grid-cols-12">

          {/* Layered image collage with scroll-driven 3D tilt */}
          <div
            className="md:col-span-7 relative flex items-center justify-center min-h-[300px] md:min-h-[520px] lg:min-h-[560px] w-full"
            style={{ perspective: '1400px' }}
          >
            <div className="absolute h-64 w-64 md:h-80 md:w-80 rounded-full bg-saffron/5 blur-3xl" />

            <div
              className="about-preview-image absolute left-0 md:left-4 top-0 md:top-4 w-[55%] md:w-[62%] lg:w-[50%] aspect-[4/5] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-royal/15 z-10 will-change-transform"
            >
              <Image
                src="/images/about2-aarti.webp"
                alt="Ganga Aarti ceremony — Recon International"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 55vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div
              className="about-preview-image absolute right-0 md:right-4 top-16 md:top-20 w-[50%] md:w-[56%] lg:w-[45%] aspect-[3/4] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl border-2 border-royal/15 z-20 will-change-transform"
            >
              <Image
                src="/images/about1.webp"
                alt="Classical dance — Recon International heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div
              className="about-preview-image absolute left-[15%] md:left-1/4 bottom-4 md:bottom-0 w-[45%] md:w-[58%] lg:w-[38%] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-royal/15 z-30 will-change-transform"
            >
              <Image
                src="/images/about 3.webp"
                alt="Traditional folk arts and events"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 45vw, 25vw"
              />
            </div>

            <motion.div
              className="absolute -bottom-6 right-6 hidden md:flex flex-col items-center justify-center h-32 w-32 rounded-full bg-white/75 backdrop-blur-xl border border-royal/20 shadow-2xl z-30"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              <span className="font-cinzel text-3xl font-light text-royal">30+</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-saffron mt-1 text-center leading-none">
                Years of <br />Service
              </span>
            </motion.div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-center md:-translate-x-[5%] lg:translate-x-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-0.5 w-8 bg-royal/30" />
              <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
                About Recon International
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-cinzel text-3xl md:text-3xl lg:text-5xl font-light leading-[1.1] text-royal mb-8"
            >
              Where Heritage <br />
              <span className="italic font-normal text-royal">Bridges Tomorrow</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-cormorant text-xl md:text-xl lg:text-2xl italic text-royal opacity-90 leading-relaxed mb-6 font-semibold"
            >
              &ldquo;For three decades, we have been weaving a global tapestry of cultural diplomacy, sacred tradition, and selfless service.&rdquo;
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base text-royal/70 font-light leading-relaxed mb-8 text-justify"
            >
              Recon International bridges classical roots with global audiences. Over the past 30 years, our trust has successfully conceptualized and delivered 160+ National and International initiatives across 16 countries. Through art preservation, spiritual journeys, and targeted humanitarian impact, we keep living heritage alive for subsequent generations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-10 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-royal/20 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-2 left-2 text-4xl font-serif text-royal/10 select-none pointer-events-none">&ldquo;</div>
              <p className="text-xs text-saffron uppercase tracking-[0.2em] font-semibold mb-2">Our Eternal Principle</p>
              <p className="font-cormorant text-lg text-royal/85 italic leading-relaxed">
                We believe culture is not a museum relic, but a breathing sanctuary that anchors human empathy and elevates global diplomacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                href="/about" 
                variant="primary" 
                size="lg" 
                className="rounded-full shadow-lg shadow-saffron/10 hover:shadow-saffron/20 transition-all duration-300 group"
              >
                <span>Explore Our Legacy</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 ml-2">→</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
