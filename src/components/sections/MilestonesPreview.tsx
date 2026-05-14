'use client'

import { motion } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

const MILESTONES = [
  {
    title: 'Carnival of Indian Culture',
    desc: 'Recon International Charitable Trust organized a 10-day celebration of “Carnival of Indian Culture” with 630 budding artists, under Ganga Pushkara...',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2676&auto=format&fit=crop',
    link: '/events'
  },
  {
    title: 'Parakram Diwas',
    desc: 'Recon International Charitable Trust organized celebrations of “Parakram Diwas” under Azadi Ka Amrit Mahotsav, in memory of the great freedom fighter...',
    image: 'https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?q=80&w=2670&auto=format&fit=crop',
    link: '/events'
  },
  {
    title: 'Sri Venkateshwara Kalyana Mahotsavam',
    desc: 'Recon International Charitable Trust organized the “Sri Venkateshwara Kalyana Mahotsavam” at Colombo, Sri Lanka, on 27th July 2024. Sri Santhosh...',
    image: 'https://images.unsplash.com/photo-1623862211516-d6e4b85c2c77?q=80&w=2664&auto=format&fit=crop',
    link: '/events'
  },
  {
    title: 'Food Festival and Telangana...',
    desc: 'Organized cultural programs, Food Festival and Telangana Traditional Products Exhibition in Mauritius, on behalf of YAT & C Department, State...',
    image: 'https://images.unsplash.com/photo-1582236676342-302a9b4074ef?q=80&w=2574&auto=format&fit=crop',
    link: '/events'
  }
]

export function MilestonesPreview() {
  return (
    <section className="relative bg-[#0a192f] py-24 lg:py-48 overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-900/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-24 text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-amber-500"
          >
            A Legacy of Impact
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-4xl font-light text-white lg:text-6xl mb-8 tracking-tight"
          >
            Our <span className="italic text-amber-500">Milestones</span>
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-lg text-stone-400 leading-relaxed font-light"
          >
            Over three decades of dedication to social welfare, spiritual upliftment, and cultural preservation. 
            Each milestone is a testament to our commitment to global community development.
          </motion.p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-stone-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-700 shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  fill
                  className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 p-8">
                <h3 className="mb-4 font-serif text-xl text-white leading-tight tracking-wide group-hover:text-amber-400 transition-colors duration-500">
                  {milestone.title}
                </h3>
                <p className="mb-8 text-sm text-stone-500 leading-relaxed line-clamp-4 font-light">
                  {milestone.desc}
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/5">
                  <a
                    href={milestone.link}
                    className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 group/link"
                  >
                    <span>Continue Reading</span>
                    <span className="transform translate-x-0 group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
