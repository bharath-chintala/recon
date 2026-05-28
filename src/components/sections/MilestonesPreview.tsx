'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'
import Image from 'next/image'
import Link from 'next/link'

const MILESTONES = [
  {
    title: 'Carnival of Indian Culture',
    desc: 'Recon International Charitable Trust organized a 10-day celebration of "Carnival of Indian Culture" with 630 budding artists, under Ganga Pushkara...',
    image: '/images/Carnival of Indian Culture.webp',
    link: '/events#carnival-of-indian-culture-ganga-pushkar-mahotsav-haridwar'
  },
  {
    title: 'Parakram Diwas',
    desc: 'Recon International Charitable Trust organized celebrations of "Parakram Diwas" under Azadi Ka Amrit Mahotsav, in memory of the great freedom fighter...',
    image: '/images/parakaran.webp',
    link: '/events#parakram-divas-celebrations-azadi-ka-amrit-mahotsav-new-delhi'
  },
  {
    title: 'Sri Venkateshwara Kalyana Mahotsavam',
    desc: 'Recon International Charitable Trust organized the "Sri Venkateshwara Kalyana Mahotsavam" at Colombo, Sri Lanka, on 27th July 2024. Sri Santhosh...',
    image: '/images/venkateshwar.webp',
    link: '/events#sri-venkateshwara-kalyana-mahotsav-colombo-sri-lanka'
  },
  {
    title: 'Food Festival and Telangana...',
    desc: 'Organized cultural programs, Food Festival and Telangana Traditional Products Exhibition in Mauritius, on behalf of YAT & C Department, State...',
    image: '/images/food festival.webp',
    link: '/events#food-festivals-and-exhibitions'
  }
]

export function MilestonesPreview() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || clientWidth
      const gap = 32 // gap-8
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIdx(index)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || scrollRef.current.clientWidth
      const gap = 32 // gap-8
      const offset = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap)
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    handleScroll()
  }, [])

  return (
    <section className="relative bg-warm-ivory py-14 lg:py-20 overflow-hidden">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-royal/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 text-center md:text-left md:flex md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 mb-4 justify-center md:justify-start"
            >
              <span className="h-0.5 w-6 bg-royal/30" />
              <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
                A Legacy of Impact
              </p>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-cinzel text-4xl font-light text-royal lg:text-5xl mb-6 tracking-tight"
            >
              Our Historical <span className="italic font-normal text-royal">Milestones</span>
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg text-royal/70 leading-relaxed font-light"
            >
              Over three decades of dedication to social welfare, spiritual upliftment, and cultural preservation. 
              Each milestone represents a distinct chapter in our documentary story.
            </motion.p>
          </div>
        </motion.div>

        {/* Carousel Snapping Row Container - Light glassmorphic style */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar py-6 scroll-smooth px-2"
        >
          {MILESTONES.map((milestone, i) => (
            <Link
              key={milestone.title}
              href={milestone.link}
              className="w-[85vw] sm:w-[500px] md:w-[650px] snap-center flex-shrink-0 cursor-pointer block"
            >
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ delay: i * 0.1 }}
                className="w-full flex flex-col md:flex-row bg-white/75 backdrop-blur-md rounded-[2rem] overflow-hidden border border-royal/20 hover:border-saffron/30 hover:bg-white/95 hover:shadow-xl transition-all duration-700 shadow-md group h-full"
              >
                {/* Image Section */}
                <div className="relative w-full md:w-[42%] aspect-[16/10] md:aspect-auto min-h-[220px] md:min-h-full overflow-hidden">
                  <Image
                    src={milestone.image}
                    alt={milestone.title}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 500px, 300px"
                    className="object-cover transition-all duration-1000 group-hover:scale-105"
                  />
                  {/* Overlay Dark/Light Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-warm-ivory/95 via-transparent to-transparent opacity-85 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6 md:p-8 justify-between">
                  <div>
                    <h3 className="mb-4 font-cinzel text-lg md:text-xl font-semibold text-royal leading-tight tracking-wide group-hover:text-saffron transition-colors duration-500">
                      {milestone.title}
                    </h3>
                    <p className="mb-6 text-xs md:text-sm text-royal/70 leading-relaxed font-light line-clamp-5 text-justify">
                      {milestone.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-royal/15 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-saffron">
                      Heritage Milestone
                    </span>
                    <div className="h-1.5 w-1.5 bg-saffron/30 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Carousel Navigation & Indicators Controls */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto px-2">
          {/* Indicators Capsule Dots */}
          <div className="flex gap-2">
            {MILESTONES.map((m, idx) => (
              <button
                key={m.title}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || scrollRef.current.clientWidth
                    const gap = 32
                    scrollRef.current.scrollTo({ left: idx * (cardWidth + gap), behavior: 'smooth' })
                  }
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeIdx === idx ? 'w-8 bg-saffron' : 'w-2 bg-royal/20 hover:bg-royal/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Premium Floating Circular Arrows */}
          <div className="flex gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollLeft 
                  ? 'bg-white/80 hover:bg-saffron/20 text-saffron border-royal/20 cursor-pointer hover:scale-105 shadow-sm' 
                  : 'text-royal/25 border-royal/5 cursor-not-allowed'
              }`}
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollRight 
                  ? 'bg-white/80 hover:bg-saffron/20 text-saffron border-royal/20 cursor-pointer hover:scale-105 shadow-sm' 
                  : 'text-royal/25 border-royal/5 cursor-not-allowed'
              }`}
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
