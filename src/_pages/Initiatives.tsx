'use client'

import { motion } from 'framer-motion'
import { initiatives } from '@/data/content'
import { Counter } from '@/components/ui/Counter'
import { Button } from '@/components/ui/Button'
import { fadeInUp, slideInLeft, slideInRight, stagger, viewportOnce } from '@/animations/variants'

export default function InitiativesPage() {
  return (
    <main className="pt-20">
      {/* Page hero */}
      <section className="relative bg-[#0b1526] py-32 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/init.png')" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center mt-12">
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Our Programmes
          </motion.p>
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="font-serif text-5xl font-bold text-white md:text-6xl">
            Initiatives for Impact
          </motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mt-6 max-w-xl mx-auto text-lg font-bold text-white uppercase tracking-wide">
            Four flagship programmes that form the backbone of our global cultural diplomacy mission.
          </motion.p>
        </div>
      </section>

      {/* Initiatives — alternating layout */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-32">
          {initiatives.map((initiative, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={initiative.id}
                id={initiative.id}
                className={`grid items-center gap-16 lg:grid-cols-2 ${!isEven ? 'lg:[direction:rtl]' : ''}`}
              >
                {/* Visual panel */}
                <motion.div
                  variants={isEven ? slideInLeft : slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="lg:[direction:ltr]"
                >
                  <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl">
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute bottom-0 left-0 h-2 w-full"
                      style={{ backgroundColor: initiative.color }}
                    />
                  </div>
                </motion.div>

                {/* Copy */}
                <motion.div
                  variants={isEven ? slideInRight : slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="lg:[direction:ltr]"
                >
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: initiative.color }}
                  >
                    {initiative.subtitle}
                  </p>
                  <h2 className="mb-5 font-serif text-4xl font-bold text-[#1a2d47]">
                    {initiative.title}
                  </h2>
                  <p className="mb-8 text-lg leading-relaxed text-[#5a7394] text-justify">
                    {initiative.description}
                  </p>

                  {/* Stats */}
                  {initiative.stats && initiative.stats.length > 0 && (
                    <div className="mb-8 grid grid-cols-3 gap-6">
                      {initiative.stats.map((stat) => (
                        <div key={stat.label}>
                          <Counter
                            target={parseInt(stat.value?.replace(/[^0-9]/g, '') || '0')}
                            suffix={stat.value?.replace(/[0-9,]/g, '') || ''}
                            label={stat.label}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button href="/contact" variant="primary">
                    Get Involved →
                  </Button>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#335C8B] py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl font-bold text-white mb-5">
            Partner With Us
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#c8d6e8] text-lg mb-8">
            We welcome Governments, Foundations, and Cultural Organisations who share our vision of a world united through culture.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button href="/contact" variant="secondary" size="lg">
              Start the Conversation
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
