'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { fadeInUp, blurIn, stagger } from '@/animations/variants'

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Background video — full cover, no overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover bg-black"
      >
        <source src="/images/sadhu2.mp4" type="video/mp4" />
      </video>

      {/* Gradient brand overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#335C8B]/40 via-[#0b1526]/50 to-black/90 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-left flex flex-col items-start"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
          >
            Celebrating Human Heritage
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={blurIn}
            className="mb-8 font-serif text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl drop-shadow-lg"
          >
            Awaken Through <br/>
            <span className="italic">Travel</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-2xl text-xl leading-relaxed text-white/80 font-light tracking-wide drop-shadow-md"
          >
            Transformative journeys that nourish mind and soul
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
            <Button href="/about" variant="primary" size="lg" className="px-8 py-6 text-lg">
              Discover Our Mission
            </Button>
            <Button href="/events" variant="outline" size="lg" className="px-8 py-6 text-lg border-white/50 text-white hover:bg-white/10 hover:border-white">
              Upcoming Events
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
