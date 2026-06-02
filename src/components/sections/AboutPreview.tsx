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

      <div className="absolute top-12 right-12 w-96 h-96 opacity-[0.08] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-royal w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" stroke="currentColor" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-10 md:gap-12 lg:gap-20 md:grid-cols-12">

          {/* Premium Editorial Mosaic Grid */}
          <div
            className="md:col-span-7 relative w-full"
            style={{ perspective: '1400px' }}
          >
            {/* Ambient glow behind the grid */}
            <div className="absolute -inset-8 bg-gradient-to-br from-saffron/8 via-transparent to-royal/8 blur-3xl rounded-[3rem] pointer-events-none" />

            <div className="relative grid grid-cols-[1.15fr_1fr] grid-rows-[1fr_0.75fr] gap-3 md:gap-4 h-[480px] md:h-[580px] lg:h-[640px]" style={{ overflow: 'visible' }}>

              {/* HERO — full left column spanning both rows */}
              <div
                className="about-preview-image row-span-2 relative rounded-[2rem] overflow-hidden shadow-2xl will-change-transform"
                style={{ boxShadow: '0 32px 80px rgba(0,4,53,0.22), 0 4px 20px rgba(0,4,53,0.12)' }}
              >
                <Image
                  src="/images/about2-aarti.webp"
                  alt="Ganga Aarti ceremony — Recon International"
                  fill
                  className="object-cover transition-transform duration-[2s] ease-out hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 45vw, 32vw"
                />
                {/* Bottom gradient + label */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/80 via-[#000435]/15 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-[0.25em] text-saffron mb-1.5 opacity-90">Sacred Rituals</span>
                  <p className="font-serif text-white text-base md:text-lg leading-snug font-light">Ganga Aarti, Haridwar</p>
                </div>
                {/* Thin gold top accent line */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-saffron/60 to-transparent" />
              </div>

              {/* TOP-RIGHT — Classical Dance portrait */}
              <div
                className="about-preview-image relative rounded-[1.5rem] overflow-hidden shadow-xl will-change-transform"
                style={{ boxShadow: '0 20px 50px rgba(0,4,53,0.18)' }}
              >
                <Image
                  src="/images/about1.webp"
                  alt="Classical dance — Recon International heritage"
                  fill
                  className="object-cover transition-transform duration-[2s] ease-out hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 40vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-[0.22em] text-saffron opacity-90">Classical Arts</span>
                  <p className="font-serif text-white text-sm leading-snug font-light mt-0.5">Indian Heritage Dance</p>
                </div>
              </div>

              {/* BOTTOM-RIGHT — Aerial temples landscape */}
              <div
                className="about-preview-image relative rounded-[1.5rem] overflow-hidden shadow-xl will-change-transform"
                style={{ boxShadow: '0 20px 50px rgba(0,4,53,0.18)' }}
              >
                <Image
                  src="/images/about 3.webp"
                  alt="Aerial view of sacred temple complex"
                  fill
                  className="object-cover object-center transition-transform duration-[2s] ease-out hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 40vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/65 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-[0.22em] text-saffron opacity-90">Heritage Sites</span>
                  <p className="font-serif text-white text-sm leading-snug font-light mt-0.5">Sacred Temple Complexes</p>
                </div>
              </div>

              {/* Floating 30+ badge — outside all overflow-hidden cards, anchored to grid bottom-right */}
              <motion.div
                className="absolute -bottom-12 -right-6 flex flex-col items-center justify-center h-[92px] w-[92px] md:h-[112px] md:w-[112px] rounded-full bg-white shadow-2xl border border-royal/10 z-50"
                style={{ boxShadow: '0 12px 40px rgba(0,4,53,0.18), 0 2px 8px rgba(0,4,53,0.08)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              >
                <span className="font-cinzel text-2xl md:text-3xl font-light text-royal leading-none">30+</span>
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.18em] text-saffron mt-1 text-center leading-tight px-2">
                  Years of<br />Service
                </span>
              </motion.div>

            </div>
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
