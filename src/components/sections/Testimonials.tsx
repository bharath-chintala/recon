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
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="testimonials"
      className="relative bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 py-24 lg:py-36 overflow-hidden"
    >
      {/* Gold glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-amber-600/10 blur-3xl" />

      {/* Decorative quote mark */}
      <div className="absolute top-16 left-12 text-9xl font-serif text-amber-500/10 select-none leading-none">
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
            className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-400"
          >
            What They Say
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-4xl font-bold text-white lg:text-5xl"
          >
            Voices from Around{' '}
            <span className="text-amber-400">the World</span>
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
                <span key={i} className="text-amber-400 text-xl">
                  ★
                </span>
              ))}
            </div>

            <blockquote className="mb-8 text-xl leading-relaxed text-stone-200 md:text-2xl font-light italic max-w-3xl mx-auto">
              "{current.quote}"
            </blockquote>

            <div className="flex flex-col items-center gap-1">
              <p className="text-base font-bold text-white">{current.name}</p>
              <p className="text-sm text-amber-400">{current.role}</p>
              <p className="text-xs text-stone-500">{current.country}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Author tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                i === active
                  ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                  : 'border-white/10 text-stone-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-amber-500' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
