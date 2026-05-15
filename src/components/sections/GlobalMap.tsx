'use client'

import { motion } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

// Simplified world-region data with approximate positions for the tech dotted map
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
      className="relative bg-[#0b1526] py-24 lg:py-36 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(51,92,139,0.15)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[#0b1526]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#6b9fd4]"
          >
            Our Global Footprint
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-4xl font-bold text-white lg:text-5xl"
          >
            Connecting{' '}
            <span className="text-[#8bb8e8]">16+ Nations</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg text-[#8a9bb5] max-w-2xl mx-auto leading-relaxed"
          >
            160+ national and international initiatives across 16 countries. 
            Our network bridges cultures from South Asia to the heart of Europe.
          </motion.p>
        </motion.div>

        {/* Interactive tech map container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] md:aspect-[16/8] w-full rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0a1420] shadow-2xl overflow-hidden group"
        >
          {/* Zoomable Wrapper - Dynamic scale for mobile/desktop */}
          <div className="absolute inset-0 scale-[1.5] md:scale-[0.8] origin-center">
            {/* Dotted world map background (Tech Grey/Blue style) */}
            <div 
              className="absolute inset-0 opacity-90 md:opacity-80 mix-blend-screen brightness-125 md:brightness-110"
              style={{ 
                backgroundImage: "url('/world_map_tech.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Animated Arcs Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(51, 92, 139, 0)" />
                  <stop offset="50%" stopColor="rgba(107, 159, 212, 0.6)" />
                  <stop offset="100%" stopColor="rgba(51, 92, 139, 0)" />
                </linearGradient>
              </defs>
              {CONNECTIONS.map((conn, i) => {
                const from = REGIONS.find(r => r.id === conn.from)!
                const to = REGIONS.find(r => r.id === conn.to)!
                
                const midX = (from.x + to.x) / 2
                const midY = (from.y + to.y) / 2 - Math.abs(from.x - to.x) * 0.18
                
                const path = `M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`
                
                return (
                  <g key={`conn-${i}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(51, 92, 139, 0.15)"
                      strokeWidth="1.5"
                      className="opacity-40"
                    />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="url(#arcGradient)"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={viewportOnce}
                      transition={{ 
                        duration: 4, 
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
                  {/* Intense blue glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#335C8B]/40 blur-lg md:blur-xl"
                    animate={{ scale: [1, 2, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Square Marker Style - Responsive */}
                  <div className="relative flex items-center justify-center">
                    <div className="h-1.5 w-1.5 md:h-2.5 md:w-2.5 bg-[#6b9fd4] rotate-45 shadow-[0_0_10px_rgba(107,159,212,1)]" />
                    <div className="absolute h-4 w-4 md:h-6 md:w-6 rounded-full border border-[#6b9fd4]/40 animate-ping opacity-30" />
                  </div>

                  {/* Refined Tooltip - Extra Small on Mobile */}
                  <div className="absolute bottom-full left-1/2 mb-2 md:mb-5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 transform translate-y-2 md:translate-y-3 group-hover:translate-y-0">
                    <div className="rounded-lg md:rounded-2xl border border-white/10 bg-[#0a1420]/90 backdrop-blur-xl px-2 py-1.5 md:px-5 md:py-4 shadow-3xl min-w-[90px] md:min-w-[160px] text-center ring-1 ring-white/10">
                      <p className="font-serif text-[8px] md:text-sm font-bold text-white mb-0.5 md:mb-1.5 uppercase tracking-wider md:tracking-widest">{region.label}</p>
                      <div className="hidden md:block h-px w-8 bg-[#335C8B] mx-auto mb-2 opacity-50" />
                      <p className="text-[7px] md:text-[11px] font-bold text-[#6b9fd4] tracking-wider md:tracking-widest">
                        {region.count} INITIATIVES
                      </p>
                    </div>
                    <div className="mx-auto h-1.5 w-1.5 md:h-2.5 md:w-2.5 -mt-1 md:-mt-1.5 rotate-45 bg-[#0a1420]/90 border-r border-b border-white/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Region List - Desktop Only Absolute */}
          <div className="hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/80 to-transparent p-10 z-20">
            <div className="flex flex-wrap gap-8 justify-center items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
              {['Sri Lanka', 'Mauritius', 'Malaysia', 'Singapore', 'South Africa', 'Nepal', 'Bhutan', 'Europe'].map(name => (
                <div key={name} className="flex items-center gap-2 group cursor-default">
                  <div className="h-1 w-1 bg-[#335C8B] rounded-full group-hover:scale-150 transition-transform" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8a9bb5] group-hover:text-[#6b9fd4] transition-colors">
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
              <div className="h-1 w-1 bg-[#335C8B] rounded-full" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5a7394]">
                {name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
