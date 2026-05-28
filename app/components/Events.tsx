'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '@/lib/supabase'
import { fetchWithCoalescing, getCachedData, setCachedData } from '@/lib/cache'

gsap.registerPlugin(ScrollTrigger)

type EventItem = {
  title: string
  desc: string
  image: string
}

type EventSection = {
  title: string
  description: string
  image: string
  items: EventItem[]
}

const PROGRAM_DATA: EventSection[] = [
  {
    title: 'Key Cultural & Spiritual Initiatives',
    description: '',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=2574&auto=format&fit=crop',
    items: [
      {
        title: 'Hari Hara Kalyana Purvaka Shri Satyanarayana Swamy Anushtan Mahotsav (5-15 February 2025)',
        desc: 'A grand 11-day spiritual and cultural celebration organized at Naimisharanya in collaboration with Naimisharanya Tirth Dham Vikas Parishad, with the support of the Department of Tourism & Culture, Government of Uttar Pradesh.',
        image: '/images/satyanarayana.webp',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Colombo, Sri Lanka',
        desc: 'A high-profile spiritual event graced by Shri Santhosh Jha, Indian High Commissioner to Sri Lanka.',
        image: '/images/venkateshwara.webp',
      },
      {
        title: 'Carnival of Indian Culture - Ganga Pushkar Mahotsav, Haridwar',
        desc: 'A 10-day event featuring over 630 emerging artists, celebrating India\'s diverse traditional arts.',
        image: '/images/ganga puskara.webp',
      },
      {
        title: 'Parakram Divas Celebrations - Azadi Ka Amrit Mahotsav, New Delhi',
        desc: 'A four-day commemoration honouring India\'s freedom fighters in association with the Ministry of Culture, Government of India.',
        image: '/images/parakarana divas.webp',
      },
    ],
  },
]

const FALLBACK_IMAGE = '/images/events.webp'

export default function Events() {
  const [programData, setProgramData] = useState<EventSection[]>(PROGRAM_DATA)
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardsWrapRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const activeIndexRef = useRef(0)

  const events = useMemo(() => {
    return programData.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        category: group.title,
      })),
    )
  }, [programData])

  useEffect(() => {
    let cancelled = false

    const loadEvents = async () => {
      const cacheKey = 'events_page_data'
      const cached = getCachedData<any[]>(cacheKey)
      if (cached && !cancelled) {
        hydrateFromSupabase(cached)
        return
      }

      const fetcher = async () => {
        const { data } = await supabase
          .from('events')
          .select('title, category, image, description, created_at')
          .order('created_at', { ascending: true })
        return data || []
      }

      const data = await fetchWithCoalescing(cacheKey, fetcher)
      if (!cancelled && data.length > 0) {
        setCachedData(cacheKey, data)
        hydrateFromSupabase(data)
      }
    }

    const hydrateFromSupabase = (rows: any[]) => {
      const grouped: Record<string, EventItem[]> = {}
      for (const row of rows) {
        const category = row.category || 'Key Cultural & Spiritual Initiatives'
        if (!grouped[category]) grouped[category] = []
        grouped[category].push({
          title: row.title,
          desc: row.description || '',
          image: row.image || FALLBACK_IMAGE,
        })
      }

      const mapped: EventSection[] = Object.keys(grouped).map((category) => ({
        title: category,
        description: '',
        image: grouped[category][0]?.image || FALLBACK_IMAGE,
        items: grouped[category],
      }))

      if (mapped.length > 0) setProgramData(mapped)
    }

    loadEvents()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    if (events.length === 0) return

    const sectionEl = sectionRef.current
    const pinEl = pinRef.current
    const cardsWrapEl = cardsWrapRef.current
    if (!sectionEl || !pinEl || !cardsWrapEl) return

    cardsRef.current = cardsRef.current.filter(Boolean)

    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(min-width: 1024px)', () => {
        const pinST = ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinEl,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
        })

        cardsRef.current.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.4, scale: 0.9, y: 70, filter: 'blur(2px)' },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 72%',
                end: 'bottom 28%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        })

        const updateActiveFromViewport = () => {
          const center = window.innerHeight * 0.5
          let nearestIndex = 0
          let minDelta = Number.POSITIVE_INFINITY

          cardsRef.current.forEach((card, index) => {
            const rect = card.getBoundingClientRect()
            const cardCenter = rect.top + rect.height * 0.5
            const delta = Math.abs(cardCenter - center)
            if (delta < minDelta) {
              minDelta = delta
              nearestIndex = index
            }
          })

          if (nearestIndex !== activeIndexRef.current) {
            activeIndexRef.current = nearestIndex
            setActiveIndex(nearestIndex)
          }
        }

        const activeST = ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: updateActiveFromViewport,
        })

        updateActiveFromViewport()
        return () => {
          pinST.kill()
          activeST.kill()
        }
      })
    }, sectionEl)

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => {
      window.clearTimeout(refreshTimer)
      mm.revert()
      ctx.revert()
    }
  }, [events.length])

  const desktopHeight = `${Math.max(events.length, 1) * 100}vh`

  return (
    <section ref={sectionRef} className="relative bg-[#0b1526] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-[#8bb8e8]">Impact & Initiatives</p>
          <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Events <span className="text-[#9fc0e1] italic">& Programs</span>
          </h2>
        </div>
      </div>

      <div
        className="relative lg:grid lg:grid-cols-2 lg:gap-0"
        style={{ minHeight: desktopHeight }}
      >
        <div className="hidden lg:block">
          <div
            ref={pinRef}
            className="relative h-screen overflow-hidden will-change-transform"
          >
            {events.map((event, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={event.title}
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(1.05)',
                    willChange: 'opacity, transform',
                  }}
                >
                  <img
                    src={event.image || FALLBACK_IMAGE}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE
                    }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20" />
                </div>
              )
            })}
          </div>
        </div>

        <div ref={cardsWrapRef} className="relative">
          <div className="lg:pr-6">
            {events.map((event, index) => {
              const isActive = index === activeIndex
              return (
                <article
                  key={event.title}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el
                  }}
                  className="flex min-h-screen items-center border-b border-white/10 px-2 py-16 will-change-transform"
                >
                  <div
                    className={`w-full rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm transition-all duration-500 md:p-12 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                    }`}
                  >
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#9fc0e1]">{event.category}</p>
                    <h3 className="mb-6 font-serif text-3xl leading-tight text-white md:text-5xl">{event.title}</h3>
                    <p className="text-base leading-relaxed text-[#d3e1ef] md:text-xl">{event.desc}</p>
                    <div className="mt-8 h-px w-full bg-white/15" />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {events.map((event) => (
          <article key={`mobile-${event.title}`} className="border-b border-white/10 px-6 py-12">
            <div className="mb-6 h-[48vh] overflow-hidden rounded-2xl">
              <img
                src={event.image || FALLBACK_IMAGE}
                alt={event.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#9fc0e1]">{event.category}</p>
            <h3 className="mb-4 font-serif text-3xl leading-tight text-white">{event.title}</h3>
            <p className="text-base leading-relaxed text-[#d3e1ef]">{event.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
