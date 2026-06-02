'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { viewportOnce } from '@/animations/variants'

export function CtaSection() {
  return (
    <section className="relative bg-warm-ivory py-16 lg:py-24 overflow-hidden">
      {/* Decorative luxury ambient backdrops */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-royal/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Full-width Cinematic Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[3rem] bg-white/70 border border-royal/20 backdrop-blur-md shadow-xl p-6 sm:p-10 md:p-24 overflow-hidden max-w-6xl mx-auto text-center text-royal cinematic-cta-glow"
        >
          {/* Floating glassmorphic saffron/royal spheres */}
          <motion.div
            className="absolute -top-16 -left-16 w-52 h-52 bg-saffron/5 rounded-full blur-2xl pointer-events-none"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-16 -right-16 w-60 h-60 bg-royal/5 rounded-full blur-2xl pointer-events-none"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
          />

          {/* Decorative mandala silhouette */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-royal w-[500px] h-[500px]">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" stroke="currentColor" strokeWidth="0.25" />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-0.5 w-6 bg-royal/30" />
              <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
                Join the Sacred Custodians
              </p>
              <span className="h-0.5 w-6 bg-royal/30" />
            </motion.div>

            {/* Emotional Cinematic Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-cinzel text-3xl md:text-5xl font-light leading-tight text-royal mb-6 max-w-3xl tracking-tight"
            >
              Become a Patron of <span className="italic font-normal text-royal">Living Heritage</span>
            </motion.h2>

            {/* Cormorant Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-cormorant text-xl md:text-2xl text-royal/90 italic mb-10 max-w-2xl leading-relaxed font-medium"
            >
              "Every shared journey preserves a sacred temple corridor, uplifts an emerging traditional artist, and builds a soft-power bridge across global horizons."
            </motion.p>

            {/* Premium Button Controls */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center"
            >
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                className="rounded-full shadow-xl shadow-saffron/10 hover:shadow-saffron/20 hover:scale-105 transition-all duration-300 px-6 sm:px-10 py-3.5 sm:py-5 bg-saffron hover:bg-royal text-white hover:text-white border-none font-bold text-xs sm:text-sm tracking-widest group"
              >
                <span>SUPPORT OUR MISSION</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 ml-2">→</span>
              </Button>
              
              <Link
                href="/about"
                className="inline-flex items-center justify-center font-cinzel text-xs font-bold uppercase tracking-widest text-royal hover:text-saffron transition-colors duration-300 border-b border-royal/40 hover:border-saffron pb-1"
              >
                READ THE COVENANT
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
