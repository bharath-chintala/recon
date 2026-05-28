'use client'

import { motion } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

// Simplified world-region data with approximate positions
const REGIONS = [
  { id: 'india', label: 'India', x: 62.5, y: 46, active: true, count: 48 },
  { id: 'srilanka', label: 'Sri Lanka', x: 63, y: 51, active: true, count: 12 },
  { id: 'middleeast', label: 'Middle East', x: 56, y: 44, active: true, count: 15 },
  { id: 'malaysia', label: 'Malaysia', x: 70.5, y: 54, active: true, count: 10 },
  { id: 'singapore', label: 'Singapore', x: 71, y: 56, active: true, count: 8 },
  { id: 'southafrica', label: 'South Africa', x: 53, y: 72, active: true, count: 7 },
  { id: 'mauritius', label: 'Mauritius', x: 61, y: 68, active: true, count: 5 },
  { id: 'bhutan', label: 'Bhutan', x: 65, y: 44, active: true, count: 6 },
  { id: 'nepal', label: 'Nepal', x: 64, y: 43, active: true, count: 6 },
  { id: 'europe', label: 'Europe', x: 50, y: 32, active: true, count: 14 },
]

// Connections for the animated arcs
const CONNECTIONS = [
  { from: 'india', to: 'europe' },
  { from: 'india', to: 'middleeast' },
  { from: 'india', to: 'malaysia' },
  { from: 'middleeast', to: 'europe' },
  { from: 'india', to: 'southafrica' },
  { from: 'india', to: 'srilanka' },
]

export function GlobalMap() {
  return (
    <section
      id="global-map"
      className="relative bg-soft-cream py-14 lg:py-20 overflow-hidden"
    >
      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-royal/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-0.5 w-6 bg-royal/30" />
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
              Our Global Footprint
            </p>
            <span className="h-0.5 w-6 bg-royal/30" />
          </motion.div>
          
          <motion.h2
            variants={fadeInUp}
            className="font-cinzel text-4xl lg:text-5xl font-light text-royal tracking-tight"
          >
            Connecting{' '}
            <span className="italic font-normal text-royal">16+ Nations</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg text-royal/70 max-w-2xl mx-auto leading-relaxed font-light"
          >
            160+ National and International initiatives across 16 countries. 
            Our network bridges cultures from South Asia to the heart of Europe.
          </motion.p>
        </motion.div>

        {/* Interactive tech map container - Dark themed glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] md:aspect-[16/8] w-full rounded-[2.5rem] border border-white/10 bg-gradient-to-tr from-[#000435] via-[#1E293B] to-[#000435] shadow-2xl overflow-hidden"
        >
          {/* Zoomable Wrapper - Dynamic scale for mobile/desktop */}
          <div className="absolute inset-0 scale-[1.5] md:scale-[0.85] origin-center">
            {/* Dotted world map background (Dark blueprint luxury style) */}
            <div 
              className="absolute inset-0 select-none pointer-events-none"
              style={{ 
                backgroundImage: "url('/world_map_tech.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'opacity(0.35) brightness(1.2)'
              }}
            />

            {/* Animated Arcs Layer (Glowing saffron/gold gradient) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="arcGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 4, 53, 0)" />
                  <stop offset="50%" stopColor="rgba(0, 4, 53, 0.9)" />
                  <stop offset="100%" stopColor="rgba(0, 4, 53, 0)" />
                </linearGradient>
              </defs>
              {CONNECTIONS.map((conn, i) => {
                const from = REGIONS.find(r => r.id === conn.from)!
                const to = REGIONS.find(r => r.id === conn.to)!
                
                const midX = (from.x + to.x) / 2
                const midY = (from.y + to.y) / 2 - Math.abs(from.x - to.x) * 0.18
                
                const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
                
                return (
                  <g key={`conn-${i}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1.5"
                      className="opacity-45"
                    />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="url(#arcGradientLight)"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={viewportOnce}
                      transition={{ 
                        duration: 4.5, 
                        delay: 1.5 + i * 0.5, 
                        repeat: Infinity, 
                        repeatDelay: 2,
                        ease: "easeInOut" 
                      }}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Markers Layer */}
            <div className="relative z-20 w-full h-full">
              {REGIONS.map((region, i) => (
                <motion.div
                  key={region.id}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.1 * i, duration: 0.8, type: 'spring' }}
                >
                  {/* Subtle cream glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-soft-cream/20 blur-lg"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Diamond Cream Marker */}
                  <div className="relative flex items-center justify-center">
                    <div className="h-2 w-2 md:h-3 md:w-3 bg-soft-cream rotate-45 shadow-[0_0_8px_rgba(255,249,240,0.6)]" />
                    <div className="absolute h-4 w-4 md:h-6 md:w-6 rounded-full border border-soft-cream/40 animate-ping opacity-35" />
                  </div>

                  {/* Refined Glassmorphic Tooltip (Dark Theme) */}
                  <div className="absolute bottom-full left-1/2 mb-2 md:mb-5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 transform translate-y-2 group-hover:translate-y-0">
                    <div className="rounded-2xl border border-white/15 bg-[#000435]/95 backdrop-blur-xl px-4 py-3 shadow-2xl min-w-[120px] md:min-w-[170px] text-center ring-1 ring-white/10">
                      <p className="font-cinzel text-[10px] md:text-xs font-bold text-soft-cream mb-1 uppercase tracking-widest">{region.label}</p>
                      <div className="h-[1px] w-6 bg-white/20 mx-auto mb-1.5" />
                      <p className="text-[9px] md:text-[10px] font-bold text-soft-cream/80 tracking-widest">
                        {region.count} INITIATIVES
                      </p>
                    </div>
                    <div className="mx-auto h-2 w-2 -mt-1 rotate-45 bg-[#000435] border-r border-b border-white/15" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Region List - Desktop Only Absolute */}
          <div className="hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#000435] via-[#000435]/80 to-transparent p-10 z-20">
            <div className="flex flex-wrap gap-8 justify-center items-center opacity-70 hover:opacity-100 transition-opacity duration-500">
              {['Sri Lanka', 'Mauritius', 'Malaysia', 'Singapore', 'South Africa', 'Nepal', 'Bhutan', 'Europe'].map(name => (
                <div key={name} className="flex items-center gap-2 group cursor-default">
                  <div className="h-1 w-1 bg-soft-cream rounded-full group-hover:scale-150 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 group-hover:text-soft-cream transition-colors">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Region List - Static below map */}
        <div className="mt-8 flex md:hidden flex-wrap gap-4 justify-center items-center px-4">
          {['Sri Lanka', 'Mauritius', 'Malaysia', 'Singapore', 'South Africa', 'Nepal', 'Bhutan', 'Europe'].map(name => (
            <div key={name} className="flex items-center gap-2">
              <div className="h-1 w-1 bg-soft-cream rounded-full" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-royal/60">
                {name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
