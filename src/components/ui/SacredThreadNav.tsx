'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about-preview', label: 'Legacy' },
  { id: 'impact-stats', label: 'Impact' },
  { id: 'core-pillars', label: 'Pillars' },
  { id: 'global-map', label: 'Global Footprint' },
  { id: 'milestones-preview', label: 'Milestones' },
  { id: 'gallery-preview', label: 'Gallery' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta-section', label: 'Get Involved' },
]

export function SacredThreadNav() {
  const [activeSection, setActiveSection] = useState('hero')
  
  // Track scroll progress of the entire page
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-35% 0px -45% 0px', // Precise trigger center of viewport
    })

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center justify-center pointer-events-auto">
      
      {/* Centered w-8 layout wrapper containing both line and buttons */}
      <div className="relative w-8 h-[340px] flex flex-col items-center justify-between">
        
        {/* Vertical Track Line - Perfectly centered in the background */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] bg-royal/10 rounded-full pointer-events-none" />
        
        {/* Glowing Saffron Progress Line - Overlapping exactly on top */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] rounded-full overflow-hidden pointer-events-none">
          <motion.div 
            className="w-full h-full bg-gradient-to-b from-saffron via-royal to-saffron origin-top"
            style={{ scaleY }}
          />
        </div>
        
        {/* Centered Buttons Nodes Layer */}
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group relative z-10 w-8 h-8 flex items-center justify-center pointer-events-auto cursor-pointer focus:outline-none"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Inner Node Dot with Double-Ring Halo on Active State */}
              <div className="relative flex items-center justify-center w-full h-full">
                
                {/* Pulse Halo for active node */}
                {isActive && (
                  <motion.div 
                    layoutId="activeHalo"
                    className="absolute w-5 h-5 rounded-full border border-saffron/40 bg-saffron/5 shadow-[0_0_10px_rgba(217,119,6,0.3)]"
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                )}
                
                {/* Central Dot Core */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.25 : 1,
                  }}
                  className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                    isActive 
                      ? 'bg-saffron border-saffron shadow-[0_0_8px_rgba(217,119,6,0.8)]' 
                      : 'bg-white border-royal/30 group-hover:border-royal'
                  }`}
                />
              </div>
              
              {/* Node Label Tooltip on Hover */}
              <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg border border-royal/10 bg-white/95 backdrop-blur-md text-[10px] font-bold text-royal uppercase tracking-widest opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {section.label}
                {/* Subtle triangle indicator */}
                <span className="absolute left-full top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-white border-r border-b border-royal/10 -ml-[4px]" />
              </span>
            </button>
          )
        })}
        
      </div>
    </div>
  )
}
