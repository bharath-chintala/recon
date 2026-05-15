'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/data/content'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="testimonials"
      className="relative bg-gradient-to-br from-[#0f1d30] via-[#0b1526] to-[#0f1d30] py-24 lg:py-36 overflow-hidden"
    >
      {/* Blue glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[#335C8B]/10 blur-3xl" />

      {/* Decorative quote mark */}
      <div className="absolute top-16 left-12 text-9xl font-serif text-[#335C8B]/10 select-none leading-none">
        "
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-12">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8bb8e8]"
          >
            What They Say
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-4xl font-bold text-white lg:text-5xl"
          >
            Voices from Around{' '}
            <span className="text-[#8bb8e8]">the World</span>
          </motion.h2>
        </motion.div>

        {/* Testimonial display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            {/* Stars */}
            <div className="mb-6 flex justify-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <span key={i} className="text-[#6b9fd4] text-xl">
                  ★
                </span>
              ))}
            </div>

            <blockquote className="mb-8 text-xl leading-relaxed text-[#c8d6e8] md:text-2xl font-light italic max-w-3xl mx-auto">
              "{current.quote}"
            </blockquote>

            <div className="flex flex-col items-center gap-1">
              <p className="text-base font-bold text-white">{current.name}</p>
              <p className="text-sm text-[#8bb8e8]">{current.role}</p>
              <p className="text-xs text-[#5a7394]">{current.country}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-[#335C8B]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
