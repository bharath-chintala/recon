'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/* ─── Gallery Data ─── */
const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Hari Hara Kalyana Mahotsav',
    subtitle: 'Naimisharanya, Uttar Pradesh',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1605374465597-94eec9e9f6be?q=80&w=2670&auto=format&fit=crop',
    color: '#D97706',
  },
  {
    id: 2,
    title: 'Ganga Pushkar Mahotsav',
    subtitle: 'Haridwar',
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2676&auto=format&fit=crop',
    color: '#335C8B',
  },
  {
    id: 3,
    title: 'Parakram Divas Celebrations',
    subtitle: 'New Delhi',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?q=80&w=2670&auto=format&fit=crop',
    color: '#B91C1C',
  },
  {
    id: 4,
    title: 'Sri Venkateshwara Kalyana',
    subtitle: 'Colombo, Sri Lanka',
    category: 'International',
    image: 'https://images.unsplash.com/photo-1623862211516-d6e4b85c2c77?q=80&w=2664&auto=format&fit=crop',
    color: '#7C3AED',
  },
  {
    id: 5,
    title: 'Cultural Festivities of Varanasi',
    subtitle: 'Banaras Hindu University',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1560086820-e7cfba1bd53d?q=80&w=2670&auto=format&fit=crop',
    color: '#059669',
  },
  {
    id: 6,
    title: 'Malaysian Cultural Exchange',
    subtitle: 'Puchong, Malaysia',
    category: 'International',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=2536&auto=format&fit=crop',
    color: '#DB2777',
  },
  {
    id: 7,
    title: 'Student Entrepreneurship Summit',
    subtitle: 'Pan-India Initiative',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=2574&auto=format&fit=crop',
    color: '#EA580C',
  },
  {
    id: 8,
    title: 'Humanitarian Aid Programs',
    subtitle: 'Multiple Locations',
    category: 'Social Impact',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop',
    color: '#0891B2',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(GALLERY_ITEMS.map(item => item.category)))]

/* ─── 3D Tilt Card (Cream Theme) ─── */
function TiltCard({ item, index, onClick }: { item: typeof GALLERY_ITEMS[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-pointer"
    >
      {/* Card Container */}
      <div
        className="relative overflow-hidden rounded-2xl bg-white border border-[#d0dae6]/60 shadow-lg shadow-[#1a2d47]/5 hover:shadow-xl hover:shadow-[#335C8B]/10 transition-shadow duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2d47] via-[#1a2d47]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Glowing accent line at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
          />
        </div>

        {/* Content Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-2"
          style={{ transform: 'translateZ(40px)' }}
        >
          {/* Category Badge */}
          <motion.span
            className="inline-block self-start text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border backdrop-blur-sm"
            style={{
              color: '#fff',
              borderColor: `rgba(255,255,255,0.3)`,
              background: `${item.color}90`,
            }}
          >
            {item.category}
          </motion.span>

          <h3 className="text-base sm:text-lg font-bold text-white leading-tight group-hover:text-[#d0dae6] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Floating corner ornament */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-90 backdrop-blur-sm bg-white/10"
          style={{ borderColor: `rgba(255,255,255,0.4)`, color: '#fff' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Shine sweep effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Lightbox Modal ─── */
function Lightbox({ item, onClose }: { item: typeof GALLERY_ITEMS[0]; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1a2d47]/90 backdrop-blur-xl" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/60 flex items-center justify-center transition-all z-20"
        >
          ✕
        </button>

        <div className="rounded-2xl overflow-hidden bg-white border border-[#d0dae6] shadow-2xl">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-8 -mt-16 relative z-10">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border mb-3"
              style={{
                color: item.color,
                borderColor: `${item.color}40`,
                background: `${item.color}10`,
              }}
            >
              {item.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2d47] mb-2">
              {item.title}
            </h2>
            <p className="text-sm sm:text-base text-[#5a7394]">{item.subtitle}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Gallery Page ─── */
export default function GalleryPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [lightboxItem, setLightboxItem] = useState<typeof GALLERY_ITEMS[0] | null>(null)

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter)

  /* GSAP: Hero parallax + title reveal */
  useGSAP(() => {
    if (!heroRef.current || !titleRef.current) return

    // Parallax hero image
    gsap.to(heroRef.current.querySelector('.gallery-hero-img'), {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Title character-split animation
    const chars = titleRef.current.querySelectorAll('.char')
    gsap.fromTo(
      chars,
      { y: 120, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.04,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
      }
    )
  }, [])

  // Framer Motion handles staggering and entrance natively and safely without DOM collision.

  // Detect mobile for marquee speed
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Split title text into individual characters for animation
  const titleText = 'Gallery'
  const titleChars = titleText.split('')

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1a2d47] overflow-hidden">
      {/* ─── PAGE TITLE ─── */}
      <section className="pt-28 sm:pt-32 pb-6 sm:pb-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-bold uppercase tracking-[0.25em] text-[#335C8B] mb-3"
        >
          Explore Our Legacy
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a2d47]"
        >
          Gallery
        </motion.h1>
      </section>

      {/* ─── FILTER BAR (Centered) ─── */}
      <section className="sticky top-20 z-30 bg-[#FBFBFB]/95 backdrop-blur-xl border-b border-[#d0dae6] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 border ${
                activeFilter === cat
                  ? 'bg-[#335C8B] text-white border-[#335C8B] shadow-lg shadow-[#335C8B]/20'
                  : 'bg-transparent text-[#5a7394] border-[#d0dae6] hover:text-[#1a2d47] hover:border-[#335C8B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── GALLERY GRID ─── */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              style={{ perspective: '1200px' }}
            >
              {filteredItems.map((item, i) => (
                <div key={item.id} className="gallery-card">
                  <TiltCard
                    item={item}
                    index={i}
                    onClick={() => setLightboxItem(item)}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-[#5a7394]">
              <p className="text-lg font-semibold">No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── BOTTOM MARQUEE ─── */}
      <section className="border-t border-[#d0dae6] py-6 sm:py-10 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: isMobile ? 5 : 10, ease: 'linear' }}
        >
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-12">
              {GALLERY_ITEMS.map((item) => (
                <span key={`${setIdx}-${item.id}`} className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-[#1a2d47]/65 uppercase tracking-wide">
                  {item.title}
                </span>
              ))}
            </div>
          ))} 
        </motion.div>
      </section>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
