'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ParticleField } from './ParticleField'
import { Button } from '@/components/ui/Button'
import { fadeInUp, blurIn, stagger, viewportOnce } from '@/animations/variants'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen bg-stone-950 overflow-hidden"
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-stone-950/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent pointer-events-none" />

      {/* Particle field */}
      <ParticleField count={70} className="z-10" />

      {/* Decorative gold line */}
      <motion.div
        className="absolute left-0 top-1/2 h-px w-32 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl items-center px-6 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-left flex flex-col items-start"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400"
          >
            Celebrating Human Heritage
            <span className="h-[1px] w-12 bg-amber-400/50" />
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={blurIn}
            className="mb-8 font-serif text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl mix-blend-screen"
          >
            Awaken Through <br/>
            <span className="relative text-amber-400 italic pr-2">
              Travel
              <motion.span
                className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-amber-500/0 via-amber-400 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
              />
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-2xl text-xl leading-relaxed text-stone-300 font-light tracking-wide"
          >
            Transformative journeys that nourish mind and soul
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
            <Button href="/about" variant="primary" size="lg" className="px-8 py-6 text-lg">
              Discover Our Mission
            </Button>
            <Button href="/events" variant="outline" size="lg" className="px-8 py-6 text-lg border-stone-500 text-stone-300 hover:text-white hover:border-white">
              Upcoming Events
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
