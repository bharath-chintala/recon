'use client'

import { motion } from 'framer-motion'
import { initiatives } from '@/data/content'
import {
  fadeInUp,
  stagger,
  viewportOnce,
} from '@/animations/variants'

export function Initiatives() {
  return (
    <section id="journeys" className="flex flex-col">
      {initiatives.map((initiative, index) => (
        <div
          key={initiative.id}
          className="relative min-h-[70vh] flex items-center overflow-hidden py-24"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
            style={{ backgroundImage: `url(${initiative.image})` }}
          />
          {/* Overlay to give that solid blue/dark look from screenshots */}
          <div className="absolute inset-0 bg-[#325d88] mix-blend-multiply" />
          <div className="absolute inset-0 bg-stone-900/40" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="max-w-3xl"
            >
              <motion.h2
                variants={fadeInUp}
                className="mb-8 font-serif text-4xl font-bold tracking-wider text-white lg:text-6xl"
              >
                {initiative.title}
              </motion.h2>
              <motion.ul
                variants={stagger}
                className="space-y-4 font-bold uppercase tracking-wide text-white"
              >
                {initiative.bullets.map((bullet, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex items-start">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-white" />
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  )
}
