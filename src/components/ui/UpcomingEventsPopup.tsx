'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { fetchWithCoalescing, getCachedData, setCachedData } from '@/lib/cache'

interface UpcomingEvent {
  id: string
  date: string
  day: string
  month: string
  title: string
  subtitle: string
  description: string
  category: string
  color: string
  seats: string
  image: string
}

export function UpcomingEventsPopup() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [events, setEvents] = useState<UpcomingEvent[]>([])

  // Fetch events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      const cacheKey = 'upcoming_events_popup'
      const cached = getCachedData<UpcomingEvent[]>(cacheKey)
      if (cached) {
        setEvents(cached)
        return
      }

      const fetcher = async () => {
        const { data } = await supabase
          .from('upcoming_events')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(4)
        return data || []
      }

      const data = await fetchWithCoalescing(cacheKey, fetcher)
      if (data && data.length > 0) {
        setCachedData(cacheKey, data)
        setEvents(data)
      }
    }
    loadEvents()
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Auto-show at 15s, 30s, and 45s
    const t1 = setTimeout(() => setOpen(true), 15000)
    const t2 = setTimeout(() => setOpen(true), 30000)
    const t3 = setTimeout(() => setOpen(true), 45000)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-upcoming-events', handleOpen)
    return () => window.removeEventListener('open-upcoming-events', handleOpen)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  if (!mounted || events.length === 0) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={close}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(3,8,22,0.72)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#FBFBFB] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {/* ── Header ── */}
            <div
              className="relative px-8 pt-8 pb-6 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0f1e38 0%, #1a2d47 60%, #243d60 100%)' }}
            >
              {/* Decorative golden glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.18) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.4), transparent)' }} />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                    style={{ color: 'rgba(200,169,110,0.8)' }}>
                    ✦ Recon International
                  </p>
                  <h2 className="font-serif text-2xl font-light text-white leading-snug">
                    Upcoming <span className="italic text-[#c8a96e]">Events</span>
                  </h2>
                  <p className="mt-1 text-xs text-white/50 tracking-wide">
                    Reserve your place today
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={close}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Tab indicators */}
              <div className="flex gap-2 mt-5">
                {events.map((ev, i) => (
                  <button
                    key={ev.id}
                    onClick={() => setActiveIdx(i)}
                    className="h-1 rounded-full transition-all duration-400 flex-1"
                    style={{
                      background: i === activeIdx ? '#c8a96e' : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Event ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ── Event Cards ── */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                {events.map((ev, i) =>
                  i === activeIdx ? (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Image Banner */}
                      {ev.image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-6 shadow-sm border border-[#e8eef5]">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </div>
                      )}

                      {/* Date + Category pill row */}
                      <div className="flex items-center gap-3 mb-4">
                        {/* Date block */}
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                          style={{ background: `${ev.color}18`, border: `1.5px solid ${ev.color}30` }}>
                          <span className="text-xl font-bold leading-none" style={{ color: ev.color }}>{ev.day}</span>
                          <span className="text-[9px] font-bold tracking-widest" style={{ color: ev.color }}>{ev.month}</span>
                        </div>

                        <div>
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                            style={{ background: `${ev.color}15`, color: ev.color }}
                          >
                            {ev.category}
                          </span>
                          <p className="mt-1 text-[11px] text-[#8a9bb5] tracking-wide">{ev.date}</p>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl font-semibold text-[#1a2d47] leading-snug mb-1 break-words">
                        {ev.title}
                      </h3>
                      <p className="text-xs font-medium text-[#335C8B] mb-3 tracking-wide">
                        📍 {ev.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#5a7394] leading-relaxed mb-5 break-words">
                        {ev.description}
                      </p>

                      {/* Seats badge + CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#c8a96e] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse inline-block" />
                          {ev.seats}
                        </span>

                        <Link
                          href="/events"
                          onClick={close}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          style={{ background: `linear-gradient(135deg, #1a2d47, #335C8B)` }}
                        >
                          View Details
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>

              {/* Navigation arrows */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#e8eef5]">
                <button
                  onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
                  disabled={activeIdx === 0}
                  aria-label="Previous event"
                  className="w-9 h-9 rounded-full border border-[#d0dae6] flex items-center justify-center text-[#5a7394] transition-all duration-200 disabled:opacity-30 hover:border-[#335C8B] hover:text-[#335C8B] hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <p className="text-[11px] text-[#8a9bb5]">
                  {activeIdx + 1} <span className="mx-1 opacity-40">/</span> {events.length}
                </p>

                <button
                  onClick={() => setActiveIdx((p) => Math.min(events.length - 1, p + 1))}
                  disabled={activeIdx === events.length - 1}
                  aria-label="Next event"
                  className="w-9 h-9 rounded-full border border-[#d0dae6] flex items-center justify-center text-[#5a7394] transition-all duration-200 disabled:opacity-30 hover:border-[#335C8B] hover:text-[#335C8B] hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
