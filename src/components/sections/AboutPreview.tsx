'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/Button'
import { viewportOnce } from '@/animations/variants'

gsap.registerPlugin(ScrollTrigger)

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
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const section = containerRef.current
      const gallery = galleryRef.current
      if (!section || !gallery) return

      imageRefs.current.forEach((el, i) => {
        if (!el) return
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
              start: 'top 75%',
              end: 'bottom 30%',
              scrub: 1.4 + i * 0.2,
            },
          },
        )
      })
    },
    { scope: containerRef, dependencies: [] },
  )

  const setImageRef = (index: number) => (el: HTMLDivElement | null) => {
    imageRefs.current[index] = el
  }

  return (
    <section
      id="about-preview"
      ref={containerRef}
      className="relative bg-warm-ivory py-28 lg:py-40 overflow-hidden"
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
        <div className="grid items-center gap-20 lg:grid-cols-12">

          {/* Layered image collage with scroll-driven 3D tilt */}
          <div
            ref={galleryRef}
            className="lg:col-span-7 relative flex items-center justify-center min-h-[550px] md:min-h-[700px]"
            style={{ perspective: '1400px' }}
          >
            <div className="absolute h-80 w-80 rounded-full bg-saffron/5 blur-3xl" />

            <div
              ref={setImageRef(0)}
              className="about-preview-image absolute left-4 top-4 w-[50%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-royal/15 z-10 will-change-transform"
            >
              <Image
                src="/images/about2-aarti.png"
                alt="Ganga Aarti ceremony — Recon International"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div
              ref={setImageRef(1)}
              className="about-preview-image absolute right-0 top-20 w-[45%] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-royal/15 z-20 will-change-transform"
            >
              <Image
                src="/images/about1.png"
                alt="Classical dance — Recon International heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 45vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div
              ref={setImageRef(2)}
              className="about-preview-image absolute left-1/4 bottom-0 w-[38%] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-royal/15 z-30 will-change-transform"
            >
              <Image
                src="/images/about 3.jpg"
                alt="Traditional folk arts and events"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 38vw, 25vw"
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

          <div className="lg:col-span-5 flex flex-col justify-center">
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
              className="font-cinzel text-4xl md:text-5xl font-light leading-[1.1] text-royal mb-8"
            >
              Where Heritage <br />
              <span className="italic font-normal text-royal">Bridges Tomorrow</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-cormorant text-2xl italic text-royal opacity-90 leading-relaxed mb-6 font-semibold"
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
              <Button href="/about" variant="primary" size="lg" className="rounded-full shadow-lg shadow-saffron/10 hover:shadow-saffron/20 transition-all duration-300">
                Explore Our Legacy →
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
