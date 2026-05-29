'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

const GALLERY_IMAGES = [
  {
    src: '/images/Varanasi event/DSC07180.webp',
    alt: 'Varanasi Event Ganga Aarti',
    title: 'Varanasi Event',
    subtitle: 'Ganga Celebrations',
    category: 'Spiritual Heritage',
    images: [
      '/images/Varanasi event/DSC07180.webp',
      '/images/Varanasi event/DSC07216.webp',
      '/images/Varanasi event/DSC07300.webp',
      '/images/Varanasi event/DSC08436.webp',
      '/images/Varanasi event/DSC08593.webp',
    ]
  },
  {
    src: '/images/Mauritius/DSC_6964.webp',
    alt: 'Cultural Exhibitions & Forums',
    title: 'Mauritius',
    subtitle: 'Global Diplomacy',
    category: 'Diplomacy',
    images: [
      '/images/Mauritius/DSC_6929.webp',
      '/images/Mauritius/DSC_6938.webp',
      '/images/Mauritius/DSC_6950.webp',
      '/images/Mauritius/DSC_6964.webp',
      '/images/Mauritius/President_Mauritius.webp',
    ]
  },
  {
    src: '/images/Cultural dances/DSC_8111.webp',
    alt: 'Indian Classical Dance Troupe',
    title: 'Classical Dance',
    subtitle: 'Cultural Delegation',
    category: 'Preservation',
    images: [
      '/images/Cultural dances/DSC_8111.webp',
      '/images/Cultural dances/DSC_8192.webp',
      '/images/Cultural dances/DSC_8195.webp',
      '/images/about1.webp',
      '/images/telangana.webp',
    ]
  },
  {
    src: '/images/Haridwar event 2023/DSC_1241.webp',
    alt: 'Awaken Through Travel Journeys',
    title: 'Pilgrimage',
    subtitle: 'Sacred Travel Paths',
    category: 'Sacred Travel',
    images: [
      '/images/Haridwar event 2023/DSC_1093.webp',
      '/images/Haridwar event 2023/DSC_1241.webp',
      '/images/Haridwar event 2023/DSC_1379.webp',
      '/images/Haridwar event 2023/DSC_3597.webp',
      '/images/Haridwar event 2023/DSC_3799.webp',
    ]
  },
  {
    src: '/images/Parakram Diwas/pa1.webp',
    alt: 'Azadi Ka Amrit Mahotsav',
    title: 'Parakram',
    subtitle: 'National Celebrations',
    category: 'National Forums',
    images: [
      '/images/Parakram Diwas/pa1.webp',
      '/images/Parakram Diwas/pa2.webp',
      '/images/Parakram Diwas/pa3.webp',
      '/images/Parakram Diwas/pa4.webp',
      '/images/Parakram Diwas/pa6.webp',
    ]
  },
  {
    src: '/images/Temples/ANU06073.webp',
    alt: 'Vedic Temple Traditions',
    title: 'Vedic Temples',
    subtitle: 'Sacred Architecture',
    category: 'Architecture',
    images: [
      '/images/Temples/ANU05999.jpg',
      '/images/Temples/ANU06073.webp',
      '/images/Temples/ANU06113.webp',
      '/images/Temples/ANU06268.jpg',
      '/images/Temples/ANU06943.jpg',
    ]
  },
  {
    src: '/images/AP event 2007/DSC_6974.webp',
    alt: 'AP Event 2007',
    title: 'AP Event 2007',
    subtitle: 'State Forum Celebrations',
    category: 'State Forums',
    images: [
      '/images/AP event 2007/DSC01021.webp',
      '/images/AP event 2007/DSC01043.webp',
      '/images/AP event 2007/DSC01048.webp',
      '/images/AP event 2007/DSC01089.webp',
      '/images/AP event 2007/DSC_6974.webp',
    ]
  }
]

const ROTATED_IMAGES = [
  '/images/Parakram Diwas/pa3.webp',
  '/images/Parakram Diwas/pa4.webp',
  '/images/Parakram Diwas/pa6.webp',
  '/images/Cultural dances/DSC_8111.webp',
  '/images/Cultural dances/DSC_8192.webp',
  '/images/Cultural dances/DSC_8195.webp',
]

interface GalleryCardProps {
  img: typeof GALLERY_IMAGES[0]
  className?: string
  onClick: () => void
}

/* ─── Premium Glazed Ceramic Claymorphic Card ─── */
function GalleryCard({ img, className = '', onClick }: GalleryCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      onClick={onClick}
      className={`group relative rounded-[2.2rem] overflow-hidden bg-[#eef3f7] border border-white/50 cursor-pointer shadow-[12px_12px_24px_rgba(15,23,42,0.06),inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_40px_rgba(218,170,55,0.22),inset_2px_2px_5px_rgba(255,255,255,0.9)] hover:border-amber-400/50 hover:-translate-y-2 transition-all duration-[600ms] ease-out ${className}`}
    >
      {/* Gloss Glaze Reflection Sweep */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -inset-y-2 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 -translate-x-[150%] group-hover:translate-x-[400%] transition-transform duration-[1000ms] ease-out" />
      </div>

      {/* Main Image with Zoom and Greyscale Bloom */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className={`object-cover brightness-100 group-hover:brightness-[0.82] transition-all duration-[800ms] ease-out ${
            ROTATED_IMAGES.includes(img.src)
              ? "-rotate-90 scale-[1.5] group-hover:scale-[1.65] object-[75%_center]"
              : "scale-100 group-hover:scale-110"
          }`}
          sizes="(max-width: 768px) 100vw, 30vw"
        />
      </div>

      {/* Cinematic Linear Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Floating Glassmorphic Category Capsule */}
      <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[9px] font-bold uppercase tracking-[0.15em] text-white/95 flex items-center gap-1.5 transition-all duration-300 group-hover:bg-amber-500/90 group-hover:border-amber-400/80 group-hover:text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400/90 group-hover:bg-white animate-pulse" />
        {img.category}
      </div>

      {/* Floating Sacred Celestial Mandala Wheel */}
      <div className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:bg-white group-hover:text-[rgb(218,170,55)] group-hover:border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out">
        <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-[800ms] ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="2" className="fill-white/80 group-hover:fill-[rgb(218,170,55)] transition-colors duration-300" />
          <circle cx="12" cy="12" r="8" strokeDasharray="3 3" strokeWidth="1" className="stroke-white/40 group-hover:stroke-[rgb(218,170,55)]/40 transition-colors duration-300" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 2v3m0 14v3M2 12h3m14 0h3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" />
        </svg>
      </div>

      {/* Text Content with upward shift and line reveal on hover */}
      <div className="absolute bottom-6 left-6 right-6 z-20 text-white select-none transition-all duration-[600ms] ease-out group-hover:translate-y-[-4px]">
        <h3 className="font-cinzel text-lg md:text-xl font-bold tracking-wide leading-tight text-white mb-0.5 group-hover:text-[rgb(218,170,55)] transition-colors duration-300">
          {img.title}
        </h3>

        {/* Subtle decorative sky blue divider that expands on hover */}
        <div className="w-0 group-hover:w-16 h-[2px] bg-[rgb(218,170,55)] my-2 transition-all duration-[600ms] rounded-full" />

        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider flex items-center gap-1">
          {img.subtitle}
          <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-6px] group-hover:translate-x-0 transition-all duration-[500ms] text-[rgb(218,170,55)]">→</span>
        </p>
      </div>
    </motion.div>
  )
}

const modalBentoContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
}

const modalBentoItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
}

export function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_IMAGES[0] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      document.body.style.overflow = ''
      if (typeof window !== 'undefined') {
        ; (window as any).lenis?.start()
      }
    }
  }, [])

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
      if (typeof window !== 'undefined') {
        ; (window as any).lenis?.stop()
      }
    } else {
      document.body.style.overflow = ''
      if (typeof window !== 'undefined') {
        ; (window as any).lenis?.start()
      }
    }
  }, [selectedImage])

  useEffect(() => {
    if (!selectedImage) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  return (
    <section className="relative bg-soft-cream py-14 lg:py-20 overflow-hidden">
      {/* Ambient Saffron/Royal backdrops */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-royal/5 blur-[100px] rounded-full pointer-events-none" />

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
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-royal/60">
              A Visual Chronicle
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
            Sacred Moments & <br />
            <span className="italic font-normal text-royal">Cultural Chronicles</span>
          </motion.h2>
        </div>

        {/* Premium Claymorphic Bento Grid - Symmetrical 504px Height Layout */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 max-w-6xl mx-auto"
        >
          {/* LEFT COLUMN: Ganga Aarti and Mauritius */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-6">
            {[GALLERY_IMAGES[0], GALLERY_IMAGES[1]].map((img) => (
              <GalleryCard
                key={img.src}
                img={img}
                className="h-[250px] md:h-[240px]"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* MIDDLE COLUMN: Classical Dance and AP Event 2007 (Perfectly Stacked) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-6">
            {[GALLERY_IMAGES[2], GALLERY_IMAGES[6]].map((img) => (
              <GalleryCard
                key={img.src}
                img={img}
                className="h-[250px] md:h-[240px]"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* RIGHT COLUMN: Pilgrimage, Parakram, and Vedic Temples */}
          <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col gap-6">
            {/* Pilgrimage Card (Wide horizontal top card) */}
            <GalleryCard
              img={GALLERY_IMAGES[3]}
              className="h-[250px] md:h-[240px]"
              onClick={() => setSelectedImage(GALLERY_IMAGES[3])}
            />

            {/* Bottom splits: Parakram and Vedic Temples side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[GALLERY_IMAGES[4], GALLERY_IMAGES[5]].map((img) => (
                <GalleryCard
                  key={img.src}
                  img={img}
                  className="h-[250px] md:h-[240px]"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Self-contained Lightbox Modal with Bento Grid Collage */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4 md:p-8"
            >
              {/* Floating Glassmorphic Bento Panel */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="relative w-full max-w-5xl bg-[#080d1a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_24px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-10 flex flex-col items-center overflow-y-auto max-h-[95vh] pr-1 md:pr-0"
              >
                {/* Close Button directly inside the floating panel top-right */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-5 right-5 md:top-6 md:right-6 p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#daaa37] hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-md z-[10000] cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header Information */}
                <div className="text-center mb-8 max-w-2xl select-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-[#daaa37] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#daaa37] animate-pulse" />
                    {selectedImage.category}
                  </div>
                  <h3 className="font-cinzel text-2xl md:text-3.5xl font-light tracking-wide text-white/95 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mt-2 font-medium">
                    {selectedImage.subtitle}
                  </p>
                </div>

                {/* Creative Bento Collage Grid */}
                <motion.div
                  variants={modalBentoContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full h-auto md:h-[450px] lg:h-[500px]"
                >
                  {selectedImage.images.map((imgSrc, idx) => {
                    const gridClasses = idx === 0
                      ? "col-span-2 md:row-span-2 h-[220px] sm:h-[280px] md:h-full"
                      : "col-span-1 md:row-span-1 h-[180px] sm:h-[230px] md:h-full"

                    return (
                      <motion.div
                        key={imgSrc}
                        variants={modalBentoItem}
                        whileHover={{ scale: 1.01 }}
                        className={`group relative rounded-2xl overflow-hidden cursor-default bg-white/5 border border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.3)] transition-all duration-[400ms] ease-out ${gridClasses}`}
                      >
                        {/* Main Image Asset */}
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={imgSrc}
                            alt={`${selectedImage.title} Gallery Image ${idx + 1}`}
                            fill
                            className={`object-cover transition-transform duration-[700ms] ease-out ${ROTATED_IMAGES.includes(imgSrc)
                              ? "-rotate-90 scale-[1.5] group-hover:scale-[1.62] object-[85%_center]"
                              : "scale-100 group-hover:scale-108"
                              }`}
                            sizes={idx === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                            priority={idx === 0}
                          />
                        </div>

                        {/* Glaze Gloss Reflection Sweep */}
                        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                          <div className="absolute top-0 -inset-y-2 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-[150%] group-hover:translate-x-[400%] transition-transform duration-[1000ms] ease-out" />
                        </div>

                        {/* High-Contrast Vignette Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300 z-10" />

                        {/* Small Image Indicator Tag */}
                        <div className="absolute bottom-3 left-4 z-20 text-[9px] font-bold text-white/50 group-hover:text-white uppercase tracking-widest transition-colors duration-300">
                          {idx === 0 ? "Featured View" : `Image 0${idx + 1}`}
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}

export default GalleryPreview
