'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ParticleField } from './ParticleField'
import { Button } from '@/components/ui/Button'
import { fadeInUp, blurIn, stagger, viewportOnce } from '@/animations/variants'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Dynamic values based on scroll progress
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 4])
  const opacityHero = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0, 0])
  const opacitySecondary = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const blurBg = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[150vh] bg-stone-950"
    >
      <motion.div 
        style={{ opacity: opacityHero }}
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden"
      >
        {/* Background image layer */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: "url('/images/hero.jpg')", filter: blurBg }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-stone-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/30 pointer-events-none" />

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
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-32 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center flex flex-col items-center"
        >
          {/* Scaling Container for Eyebrow & Headline */}
          <motion.div 
            style={{ scale: scaleText, transformOrigin: "center center" }}
            className="will-change-transform flex flex-col items-center"
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeInUp}
              className="mb-6 inline-flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400"
            >
              <span className="h-[1px] w-12 bg-amber-400/50" />
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
                  className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0"
                  initial={{ scaleX: 0, originX: 0.5 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
                />
              </span>
            </motion.h1>
          </motion.div>

          {/* Secondary Content (Fades out quickly) */}
          <motion.div style={{ opacity: opacitySecondary }} className="flex flex-col items-center">
            {/* Subline */}
            <motion.p
              variants={fadeInUp}
              className="mb-12 max-w-2xl text-xl leading-relaxed text-stone-300 font-light tracking-wide"
            >
              Transformative journeys that nourish mind and soul
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6">
              <Button href="/about" variant="primary" size="lg" className="px-8 py-6 text-lg">
                Discover Our Mission
              </Button>
              <Button href="/events" variant="outline" size="lg" className="px-8 py-6 text-lg border-stone-500 text-stone-300 hover:text-white hover:border-white">
                Upcoming Events
              </Button>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>

      </motion.div>
    </section>
  )
}

export default HeroSection
