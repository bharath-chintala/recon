'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

const PILLARS = [
  {
    title: 'Cultural Heritage Preservation',
    subtitle: 'Securing the Future',
    description: (
      <>
        <strong className="font-extrabold text-royal">Safeguarding India's classical, folk, and tribal art forms.</strong> We create platforms for dance mentors, classical educators, and disciples to pass on living traditions to subsequent generations.
      </>
    ),
    icon: (
      <svg className="w-7 h-7 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: 'Cultural Diplomacy & Tourism',
    subtitle: 'Global Soft Power',
    description: (
      <>
        <strong className="font-extrabold text-royal">Bridging cultures through 160+ initiatives</strong> across 16 countries. We coordinate with Governments to position heritage as an instrument of tourism and bilateral diplomacy.
      </>
    ),
    icon: (
      <svg className="w-7 h-7 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    )
  },
  {
    title: 'Humanitarian & Social Impact',
    subtitle: 'Uplifting Communities',
    description: (
      <>
        <strong className="font-extrabold text-royal">Empowering underprivileged communities</strong> through targeted CSR programs, student entrepreneurship, exam scribe support, and robust distribution drives.
      </>
    ),
    icon: (
      <svg className="w-7 h-7 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    title: 'Spiritual & Sacred Journeys',
    subtitle: 'Nourishing the Soul',
    description: (
      <>
        <strong className="font-extrabold text-royal">Designing highly authentic, comfortable itineraries</strong> to holy landscapes, facilitating inclusive support for visually challenged and elderly devotees.
      </>
    ),
    icon: (
      <svg className="w-7 h-7 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    )
  }
]

export function CorePillars() {
  return (
    <section className="relative bg-warm-ivory py-14 lg:py-20 overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-saffron/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal/5 blur-[130px] rounded-full pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-20 text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-0.5 w-6 bg-royal/30" />
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
              What Drives Our Purpose
            </p>
            <span className="h-0.5 w-6 bg-royal/30" />
          </motion.div>
          
          <motion.h2
            variants={fadeInUp}
            className="font-cinzel text-4xl lg:text-5xl font-extrabold text-royal mb-6 tracking-tight"
          >
            Our Core <span className="italic font-bold text-royal">Pillars of Impact</span>
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-lg text-royal/80 leading-relaxed font-normal"
          >
            Three decades of integrated leadership. We actively preserve rich cultural ecosystems, empower artists, facilitate global diplomacy, and uplift underserved lives.
          </motion.p>
        </motion.div>

        {/* Pillars Card Grid / Carousel */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 pb-12 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-[85vw] md:w-auto snap-center group relative flex flex-col bg-[#F8F5EF] p-8 rounded-[2.5rem] border border-white/60 hover:-translate-y-2 transition-all duration-500 shadow-[8px_8px_20px_rgba(0,4,53,0.06),-8px_-8px_20px_rgba(255,255,255,0.8),inset_4px_4px_10px_rgba(255,255,255,1),inset_-4px_-4px_10px_rgba(0,4,53,0.03)] hover:shadow-[12px_12px_24px_rgba(0,4,53,0.08),-12px_-12px_24px_rgba(255,255,255,1),inset_4px_4px_10px_rgba(255,255,255,1),inset_-4px_-4px_10px_rgba(0,4,53,0.03)]"
            >
              {/* Icon Container with Claymorphism */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F5EF] transition-all duration-500 shadow-[4px_4px_10px_rgba(0,4,53,0.06),-4px_-4px_10px_rgba(255,255,255,0.8),inset_2px_2px_5px_rgba(255,255,255,1),inset_-2px_-2px_5px_rgba(0,4,53,0.03)]">
                {pillar.icon}
              </div>

              {/* Card Header */}
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron mb-3">
                {pillar.subtitle}
              </span>
              <h3 className="mb-4 font-cinzel text-xl md:text-2xl font-bold text-royal leading-snug tracking-wide group-hover:text-saffron transition-colors duration-300 break-words">
                {pillar.title}
              </h3>

              {/* Card Description */}
              <p className="text-sm md:text-[15px] text-royal/80 leading-relaxed font-normal flex-1 text-justify break-words">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Vision Highlight - Redesigned into elegant light luxury style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-[#0A142F] to-[#121F45] text-soft-cream border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Inner soft cream glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-soft-cream/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-soft-cream/80 block mb-2">
                Our Enduring Motto
              </span>
              <h3 className="font-cinzel text-2xl md:text-3xl font-light leading-tight text-soft-cream mb-3">
                "Save Our Culture for the <span className="italic text-soft-cream font-semibold">Next Generation"</span>
              </h3>
              <p className="text-[10px] text-soft-cream/60 uppercase tracking-widest font-semibold">
                Recon International Charitable Trust
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Link 
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-saffron text-royal hover:text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-black/20 group whitespace-nowrap"
              >
                <span>Learn More About Us</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
