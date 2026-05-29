'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/data/content'
import { viewportOnce } from '@/animations/variants'
import Image from 'next/image'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="testimonials"
      className="relative bg-warm-ivory py-14 lg:py-20 overflow-hidden"
    >
      {/* Immersive ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-saffron/5 via-royal/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-0.5 w-6 bg-royal/30" />
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
              Voices of the Global Community
            </p>
            <span className="h-0.5 w-6 bg-royal/30" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cinzel text-4xl lg:text-5xl font-light text-royal tracking-tight"
          >
            Resonance from <span className="italic font-normal text-royal">Around the World</span>
          </motion.h2>
        </div>

        {/* Breathtaking Luxury Glassmorphic Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          data-cinematic-exclude
          className="relative max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-royal/20 shadow-xl p-8 md:p-16 overflow-hidden"
        >
          
          {/* Decorative Royal Quote Mark inside the card */}
          <div className="absolute -top-4 left-6 text-9xl font-serif text-royal/10 select-none pointer-events-none">
            “
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Saffron Star Ratings */}
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <span key={i} className="text-saffron text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Emotional Quote */}
              <blockquote className="mb-10 font-cormorant text-2xl md:text-3xl leading-relaxed text-royal/90 italic font-medium max-w-2xl mx-auto">
                "{current.quote}"
              </blockquote>

              {/* Profile Details (Layered) */}
              <div className="flex flex-col items-center">
                {/* Profile Circle with Royal Border */}
                <div className="h-14 w-14 rounded-full border-2 border-royal/15 overflow-hidden relative shadow-md mb-4 bg-white/75">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                
                <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-royal">
                  {current.name}
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-wider text-saffron mt-1">
                  {current.role}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-royal/60 mt-0.5">
                  {current.country}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots inside the glassmorphic card */}
          <div className="mt-8 flex justify-center gap-2 relative z-10">
            {testimonials.map((t, i) => (
              <button
                key={t.name + t.country}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`relative h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? 'w-8 bg-saffron' : 'w-1.5 bg-royal/20 hover:bg-royal/40'
                }`}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] cursor-pointer" />
              </button>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  )
}
