'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { viewportOnce } from '@/animations/variants'

const STATS = [
  { target: 30, suffix: '+', label: 'Years of Excellence', desc: 'Over three decades of active cultural service and bilateral bridge-building.' },
  { target: 16, suffix: '+', label: 'Nations Reached', desc: 'Preserving and displaying rich traditional arts across 16 countries globally.' },
  { target: 160, suffix: '+', label: 'Initiatives Delivered', desc: 'Successful trade forums, CSR drives, and cultural festivals organized.' },
  { target: 50000, suffix: '+', label: 'Lives Touched', desc: 'Direct positive social, educational, and spiritual pilgrim impact.' },
]

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, margin: '-50px' })

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1], // cinematic smooth ease-out
        onUpdate(latest) {
          node.textContent = Math.round(latest).toLocaleString()
        },
      })
      return () => controls.stop()
    }
  }, [inView, value])

  return <span ref={ref}>0</span>
}

export function ImpactStats() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      className="relative bg-soft-cream py-24 lg:py-36 overflow-hidden"
    >
      {/* Immersive floating ambient saffron spotlights */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-royal/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-0.5 w-6 bg-royal/30" />
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
              Our Measured Influence
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
            Milestones of <span className="italic font-normal text-royal">Sacred Impact</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-royal/20 shadow-md hover:shadow-xl hover:border-saffron/30 hover:bg-white/90 hover:-translate-y-2 transition-all duration-500 text-center"
            >
              {/* Dynamic Saffron Inner Glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-saffron/5 rounded-full blur-xl group-hover:scale-[1.8] transition-transform duration-700 pointer-events-none" />

              {/* Royal/Saffron Ornament Line */}
              <div className="mx-auto w-12 h-1 bg-gradient-to-r from-royal/20 via-saffron/30 to-royal/20 mb-6 rounded-full group-hover:w-20 transition-all duration-500" />

              {/* Large Luxury Counter */}
              <div className="font-cinzel text-5xl lg:text-6xl font-light text-royal mb-4 tracking-tight flex items-center justify-center">
                <AnimatedCounter value={stat.target} />
                <span className="text-saffron font-semibold">{stat.suffix}</span>
              </div>

              {/* Label */}
              <h3 className="font-cinzel text-xs font-bold uppercase tracking-[0.15em] text-royal mb-3 group-hover:text-saffron transition-colors">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-xs text-royal/70 leading-relaxed font-light mt-auto">
                {stat.desc}
              </p>

              {/* Decorative Subtle Corner Border */}
              <div className="absolute bottom-3 right-3 h-3 w-3 border-r border-b border-royal/15 group-hover:border-royal/30 transition-colors" />
              <div className="absolute top-3 left-3 h-3 w-3 border-l border-t border-royal/15 group-hover:border-royal/30 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
