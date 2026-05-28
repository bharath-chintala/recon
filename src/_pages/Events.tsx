'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { supabase } from '@/lib/supabase'
import { fetchWithCoalescing, getCachedData, setCachedData } from '@/lib/cache'

gsap.registerPlugin(ScrollTrigger)

const PROGRAM_DATA = [
  {
    title: 'Key Cultural & Spiritual Initiatives',
    description: '',
    image: '/images/Haridwar event 2023/DSC_1093.webp',
    items: [
      {
        title: 'Hari Hara Kalyana Purvaka Shri Satyanarayana Swamy Anushtan Mahotsav (5–15 February 2025)',
        desc: 'A grand 11-day spiritual and cultural celebration organized at Naimisharanya in collaboration with Naimisharanya Tirth Dham Vikas Parishad, with the support of the Department of Tourism & Culture, Government of Uttar Pradesh.',
        image: '/images/satyanarayana.webp',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Colombo, Sri Lanka',
        desc: 'A high-profile spiritual event graced by Shri Santhosh Jha, Indian High Commissioner to Sri Lanka.',
        image: '/images/venkateshwar.webp',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Puchong, Malaysia',
        desc: 'A vibrant cultural celebration featuring a delegation of women artists from Telangana, strengthening Telugu cultural roots abroad.',
        image: '/images/venkateshwara.webp',
      },
      {
        title: 'Carnival of Indian Culture – Ganga Pushkar Mahotsav, Haridwar',
        desc: 'A 10-day event featuring over 630 emerging artists, celebrating India’s diverse traditional arts.',
        image: '/images/ganga puskara.webp',
      },
      {
        title: 'Parakram Divas Celebrations – Azadi Ka Amrit Mahotsav, New Delhi',
        desc: 'A four-day commemoration at Ambedkar Auditorium, AP Bhawan, honouring India’s freedom fighters, with special tribute to Netaji Subhash Chandra Bose, in association with the Ministry of Culture, Government of India.',
        image: '/images/Parakram Diwas/pa1.webp',
      },
      {
        title: 'Cultural Festivities of Varanasi',
        desc: 'Organized in collaboration with Banaras Hindu University, supported by the Department of Culture, Government of Uttar Pradesh, celebrating Varanasi’s rich artistic legacy.',
        image: '/images/Varanasi event/DSC07180.webp',
      },
      {
        title: 'Student Entrepreneurship Initiative (April 2024)',
        desc: 'Empowered MBA students to market original organic “Ugadi Pachhadi” through kiosk setups, fostering entrepreneurial and marketing skills.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop',
      },
    ],
  },
  {
    title: 'Special Projects & Creative Platforms',
    description: '',
    image: '/images/Temples/ANU05999.webp',
    items: [
      {
        title: 'Short Film Contest (2018)',
        desc: 'Held at Ravindrabharathi, Hyderabad to encourage creative expression among young filmmakers.',
        image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2671&auto=format&fit=crop',
      },
      {
        title: 'Kanakabhishekam (Golden Flower Anointing Ceremony)',
        desc: 'Celebrated the 80th Spring Festival of Dr. Tirumala Srinivasa Chary, honouring his contributions to spiritual and cultural life.',
        image: '/images/Temples/ANU06073.webp',
      },
    ],
  },
  {
    title: 'Cultural Exchange & International Engagements',
    description: 'The Trust has a long-standing legacy of leading cultural delegations from Andhra Pradesh and Telangana to several international destinations in association with erstwhile Government of Andhra Pradesh and Government of Telangana:',
    image: '/images/Mauritius/President_Mauritius.webp',
    items: [
      {
        title: 'Indian Classical Dance Troupes in Sri Lanka',
        desc: 'Including performances at the Shankari Temple, and participation in the Indian Traditional Dance Competition (Aug 2017).',
        image: '/images/Cultural dances/DSC_8111.jpg',
      },
      {
        title: 'Bathukamma Festival in Kuala Lumpur (2016)',
        desc: 'In collaboration with the Malaysia Telangana Association (MYTA).',
        image: '/images/telangana.webp',
      },
      {
        title: 'Ugadi Celebrations (2016)',
        desc: 'Kuala Lumpur, featuring classical and folk arts such as Perini, Kuchipudi, Lambadi dance, and mimicry.',
        image: '/images/Cultural dances/DSC_8192.jpg',
        objectPosition: 'center 75%',
      },
      {
        title: 'Golden Jubilee Celebrations',
        desc: 'Malaysia Telugu Sangham, Teluk Intan, showcasing Telugu culture on an international stage.',
        image: '/images/AP event 2007/DSC_6974.webp',
      },
    ],
  },
  {
    title: 'Humanitarian & Social Impact Initiatives',
    description: 'The Trust has consistently demonstrated a deep commitment to Social Responsibility, particularly in supporting underprivileged and visually impaired communities:',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop',
    items: [
      {
        title: 'World Blood Donor Day (2014)',
        desc: 'Conducted at Ravindrabharathi, Hyderabad in collaboration with the State AIDS Control Society, Government of Telangana.',
        image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?q=80&w=2574&auto=format&fit=crop',
      },
      {
        title: 'Food Festivals and Exhibitions',
        desc: 'Showcasing traditional Indian products in Mauritius (2007) during regional festivals in collaboration with erstwhile Government of Andhra Pradesh.',
        image: '/images/Mauritius/DSC_6938.webp',
      },
      {
        title: 'Pilgrimage Support (2023–2024)',
        desc: 'Facilitated spiritual access and safe travel for over 400 visually impaired pilgrims to Tirumala supported by TTD, Andhra Pradesh.',
        image: '/images/Temples/ANU06268.webp',
      },
      {
        title: 'Face Mask Distribution (COVID-19)',
        desc: 'Provided masks to law enforcement and Greater Hyderabad Municipal Corporation, Telangana personnel during early lockdown phases.',
        image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=2670&auto=format&fit=crop',
      },
    ],
  },
  {
    title: 'Education, CSR & Volunteerism',
    description: '',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2664&auto=format&fit=crop',
    items: [
      {
        title: 'Scribe Support for Visually Impaired Students (2015–Present)',
        desc: 'Enabled over 200 students to successfully appear in academic and competitive exams.',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop',
      },
      {
        title: 'Inclusive Sports Marathons (2017–Present)',
        desc: 'Organized 3 km & 5 km runs for visually challenged youth.',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Mathematics Quiz (2018)',
        desc: 'Held across five Government Schools in Hyderabad to celebrate Sri Ramanujan’s 131st birth anniversary.',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Motivational Sessions (2019)',
        desc: 'Focused on self-reliance and education for visually impaired young women.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop',
      },
      {
        title: 'Pandemic Education Relief (2020 – 2021)',
        desc: 'Provided free tuition to underprivileged students; several qualified for admission into IITs.',
        image: 'https://images.unsplash.com/photo-1427504494785-319ce8372ac0?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Blanket Distribution Drives (Ongoing)',
        desc: 'Supporting homeless and underserved populations during winter months.',
        image: 'https://images.unsplash.com/photo-1534063229789-f5cefa1548fb?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Corporate Outreach Program',
        desc: 'Hosted a motivational session for 100 orphaned students at Genpact, Habsiguda, Hyderabad and inspiring future careers.',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2670&auto=format&fit=crop',
      },
    ],
  },
  {
    title: 'Trade Facilitation Expertise',
    description: 'Recon International, Hyderabad has represented Indian interests at several Global trade forums and exhibitions, including:',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
    items: [
      {
        title: 'Al Multaqa Exhibitions, Abu Dhabi (2005–2006)',
        desc: 'Official Indian Representative.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Trade Missions',
        desc: 'Conducted in Singapore, Malaysia, Indonesia, Sri Lanka, Egypt, Iran, Greece, Pakistan, UAE, and Nepal, among others.',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop',
      },
      {
        title: 'Strategic Role',
        desc: 'With FAPCCI (2005–2007) and SPANCO in Tehran (2005–2006), promoting Indian industries abroad.',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2574&auto=format&fit=crop',
      },
    ],
  },
]

const isSameImage = (url1: string | null | undefined, url2: string | null | undefined) => {
  if (!url1 || !url2) return false
  const u1 = decodeURIComponent(String(url1)).trim().toLowerCase()
  const u2 = decodeURIComponent(String(url2)).trim().toLowerCase()
  return u1 === u2
}

export default function Events() {
  const [programData, setProgramData] = useState(PROGRAM_DATA)
  const [filter, setFilter] = useState(PROGRAM_DATA[0].title)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const hoveredImageRef = useRef<string | null>(null)
  const [overrideMinHeight, setOverrideMinHeight] = useState<string | null>(null)
  const filterTimeoutRef = useRef<any>(null)

  useEffect(() => {
    hoveredImageRef.current = hoveredImage
  }, [hoveredImage])

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }
    }
  }, [])

  // Proactively refresh GSAP ScrollTrigger when the height override transitions back to null
  useEffect(() => {
    if (!overrideMinHeight) {
      const refresh = () => ScrollTrigger.refresh()
      const t = setTimeout(refresh, 100)
      return () => clearTimeout(t)
    }
  }, [overrideMinHeight])



  useEffect(() => {
    const loadEvents = async () => {
      const cacheKey = 'events_page_data'
      const cached = getCachedData<any[]>(cacheKey)
      if (cached) {
        processEvents(cached)
        return
      }

      const fetcher = async () => {
        const { data } = await supabase
          .from('events')
          .select('id, title, category, image, description, created_at')
          .order('created_at', { ascending: true })
        return data || []
      }

      const data = await fetchWithCoalescing(cacheKey, fetcher)
      if (data && data.length > 0) {
        setCachedData(cacheKey, data)
        processEvents(data)
      }
    }

    const processEvents = (data: any[]) => {
      const descriptionsMap: { [key: string]: string } = {
        'Humanitarian & Social Impact Initiatives': 'The Trust has consistently demonstrated a deep commitment to Social Responsibility, particularly in supporting underprivileged and visually impaired communities:',
        'Cultural Exchange & International Engagements': 'The Trust has a long-standing legacy of leading cultural delegations from Andhra Pradesh and Telangana to several international destinations in association with erstwhile Government of Andhra Pradesh and Government of Telangana:',
        'Trade Facilitation Expertise': 'Recon International, Hyderabad has represented Indian interests at several Global trade forums and exhibitions, including:'
      }

      const groupedMap: { [key: string]: any[] } = {}
      data.forEach(evt => {
        const cat = evt.category || 'Key Cultural & Spiritual Initiatives'
        if (!groupedMap[cat]) {
          groupedMap[cat] = []
        }

        // Use local image if available in PROGRAM_DATA for matching titles
        let localImage = null;
        PROGRAM_DATA.forEach(p => {
          p.items.forEach(item => {
            if (item.title === evt.title) {
              localImage = item.image;
            }
          })
        });

        // Precompute thumbnail
        let imageUrl = localImage || evt.image || '/images/events.webp';
        let thumbUrl = imageUrl;

        groupedMap[cat].push({
          title: evt.title,
          desc: evt.description,
          image: imageUrl,
          thumb: thumbUrl
        })
      })

      const mappedCategories = Object.keys(groupedMap).map(catName => ({
        title: catName,
        description: descriptionsMap[catName] || '',
        image: groupedMap[catName][0]?.image || '/images/events.webp',
        items: groupedMap[catName]
      }))

      setProgramData(mappedCategories)
      setFilter(mappedCategories[0]?.title || '')
    }
    loadEvents()
  }, [])

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (!hash) return

      const targetSlug = hash.replace('#', '')

      for (const section of programData) {
        const hasItem = section.items.some(
          item => item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSlug
        )
        if (hasItem) {
          setFilter(section.title)

          setTimeout(() => {
            const isMobile = window.innerWidth < 1024
            const elementId = isMobile ? `mobile-${targetSlug}` : targetSlug
            const element = document.getElementById(elementId)
            if (element) {
              const y = element.getBoundingClientRect().top + window.scrollY - 150
              scrollToY(y)
            }
          }, 200)
          break
        }
      }
    }

    if (programData.length > 0) {
      const t = setTimeout(handleHashScroll, 300)
      window.addEventListener('hashchange', handleHashScroll)
      return () => {
        clearTimeout(t)
        window.removeEventListener('hashchange', handleHashScroll)
      }
    }
  }, [programData])

  const filteredData = programData.filter((s) => s.title === filter)

  const [activeItemImage, setActiveItemImage] = useState<string | null>(null)
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0)

  const introContainerRef = useRef<HTMLDivElement>(null)
  const legacyContainerRef = useRef<HTMLDivElement>(null)
  const legacyBgRef = useRef<HTMLDivElement>(null)
  const eventsListRef = useRef<HTMLElement>(null)
  const leftImagePinRef = useRef<HTMLDivElement>(null)
  const cardsWrapRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const activeItemIndexRef = useRef(0)

  const filteredItems = filteredData[0]?.items ?? []

  useEffect(() => {
    if (filteredItems.length > 0) {
      setActiveItemImage(filteredItems[0].image)
      setActiveItemIndex(0)
      activeItemIndexRef.current = 0
      cardsRef.current = []
    }
  }, [filter, programData, filteredItems.length])

  useEffect(() => {
    activeItemIndexRef.current = activeItemIndex
  }, [activeItemIndex])

  const categoryImage = filteredData[0]?.image ?? '/images/events.webp'
  const firstItemImage = filteredData[0]?.items[0]?.image ?? categoryImage
  const activeImage =
    hoveredImage || activeItemImage || firstItemImage || categoryImage || '/images/events.webp'

  const scrollToY = (y: number) => {
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : undefined
    if (lenis?.scrollTo) {
      lenis.scrollTo(y, { duration: 1.2 })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleFilterClick = (newFilter: string) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
    }

    // Capture the current height before updating the filter to prevent immediate height shrinkage
    const prevHeight = `${Math.max(filteredItems.length, 2) * 100}vh`
    setOverrideMinHeight(prevHeight)

    setFilter(newFilter)

    const filterBar = document.getElementById('filter-bar')
    const eventsList = document.getElementById('events-list')
    const targetElement = filterBar || eventsList

    if (targetElement) {
      const y = targetElement.getBoundingClientRect().top + window.scrollY - 100
      scrollToY(y)
    } else {
      scrollToY(0)
    }

    // Release the height override after the smooth scroll transition completes
    filterTimeoutRef.current = setTimeout(() => {
      setOverrideMinHeight(null)
      filterTimeoutRef.current = null
      // Refresh GSAP ScrollTrigger layout coordinates after height override release
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 50)
    }, 1200)
  }

  // Refs for GSAP animations (intro + legacy)
  useGSAP(() => {
    // Advanced Editorial Intro Text Reveal
    gsap.fromTo('.intro-text-reveal',
      { opacity: 0, y: 40, rotateX: 15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: introContainerRef.current,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse'
        }
      }
    )

    // Legacy Section Parallax Background
    gsap.to(legacyBgRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: legacyContainerRef.current,
        start: 'top bottom', // when top of section hits bottom of viewport
        end: 'bottom top',   // when bottom of section hits top of viewport
        scrub: true,
      }
    })

    // Legacy Text Reveal
    const legacyElements = gsap.utils.toArray('.legacy-reveal')
    legacyElements.forEach((el: any, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      )
    })
  })

  // Cinematic split scroll: pin left media, scrub right cards (desktop)
  useGSAP(
    () => {
      const section = eventsListRef.current
      if (!section || filteredItems.length === 0) return

      cardsRef.current = cardsRef.current.filter(Boolean)

      const mm = gsap.matchMedia()
      const ctx = gsap.context(() => {
        mm.add('(min-width: 1024px)', () => {
          const cardTweens: gsap.core.Tween[] = []
          cardsRef.current.forEach((card) => {
            const tween = gsap.fromTo(
              card,
              { opacity: 0.4, scale: 0.92, y: 56 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
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
            cardTweens.push(tween)
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

            if (nearestIndex !== activeItemIndexRef.current) {
              activeItemIndexRef.current = nearestIndex
              const item = filteredItems[nearestIndex]
              if (item) {
                setActiveItemIndex(nearestIndex)
                if (!hoveredImageRef.current) setActiveItemImage(item.image)
              }
            }
          }

          const activeST = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: updateActiveFromViewport,
          })

          updateActiveFromViewport()

          return () => {
            activeST.kill()
            cardTweens.forEach((t) => t.scrollTrigger?.kill())
          }
        })
      }, section)

      return () => {
        mm.revert()
        ctx.revert()
      }
    },
    { dependencies: [filter, programData, filteredItems.length] },
  )

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    const t = window.setTimeout(refresh, 150)
    window.addEventListener('load', refresh)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
    }
  }, [filter, programData, filteredItems.length])

  // Scroll-linked dynamic scaling text setup
  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end end"]
  })

  // Dynamic values based on scroll progress
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 10])
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const opacityText = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0, 0])
  const opacityHero = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
  const blurBg = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"])

  const splitScrollHeight = `${Math.max(filteredItems.length, 2) * 100}vh`

  return (
    <main className="events-page bg-[#FBFBFB] min-h-screen">
      {/* Scroll-Linked Dynamic Scaling Hero Wrapper */}
      <div ref={heroWrapperRef} className="relative h-[200vh]">
        {/* Sticky fullscreen viewport */}
        <section ref={heroRef} className="sticky top-0 h-[100vh] bg-black flex flex-col items-center justify-center overflow-hidden pt-20">
          <motion.div
            style={{
              filter: blurBg,
              scale: scaleBg,
              backgroundImage: "url('/images/events.webp')"
            }}
            className="absolute inset-0 bg-cover bg-center opacity-80"
          />

          <motion.div
            style={{ scale: scaleText, opacity: opacityText, transformOrigin: "center center" }}
            className="relative z-10 flex flex-col items-center justify-center text-center will-change-transform"
          >
            {/* Eyebrow */}
            <motion.p
              className="mb-6 inline-flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#8bb8e8]"
            >
              <span className="h-[1px] w-12 bg-[#335C8B]/50" />
              Impact & Initiatives
              <span className="h-[1px] w-12 bg-[#335C8B]/50" />
            </motion.p>

            {/* Headline */}
            <h1 className="mb-8 font-serif text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl mix-blend-screen">
              Key Events & <br />
              <span className="relative text-[#a3b8d4] italic pr-2">
                Programs
              </span>
            </h1>
          </motion.div>
        </section>
      </div>

      {/* Intro Text - GSAP Animated */}
      <section ref={introContainerRef} className="relative z-20 bg-[#FBFBFB] pt-24 pb-16 px-6 lg:px-12 rounded-t-[3rem] -mt-32 shadow-2xl">
        <div className="mx-auto max-w-4xl text-center" style={{ perspective: '1000px' }}>
          <p className="intro-text-reveal text-2xl text-[#1a2d47] leading-relaxed font-medium mb-8">
            Recon International Charitable Trust, Hyderabad, has successfully conceptualized and delivered a diverse portfolio of initiatives, encompassing cultural programs, spiritual observances, international forums, and corporate summits.
          </p>
          <p className="intro-text-reveal text-lg text-[#5a7394] leading-relaxed font-light">
            Since 1993, we have been actively engaged in international trade facilitation and the organisation of cultural programs and curated tour packages across global platforms, fostering cross-cultural exchange and international collaboration.
          </p>
        </div>
      </section>

      {/* Premium Pill-Chip Filter Bar */}
      <section id="filter-bar" className="relative z-20 bg-[#FBFBFB] sticky top-20 shadow-[0_2px_24px_rgba(26,45,71,0.07)] transition-all duration-300">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FBFBFB] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FBFBFB] to-transparent z-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar py-4"
          >
            {programData.map((section, i) => {
              const isActive = filter === section.title
              return (
                <motion.button
                  key={section.title}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleFilterClick(section.title)}
                  className={`relative whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold tracking-[0.04em] transition-all duration-300 border ${isActive
                    ? 'bg-[#1a2d47] text-white border-[#1a2d47] shadow-md'
                    : 'bg-white text-[#5a7394] border-[#d0dae6] hover:border-[#335C8B] hover:text-[#1a2d47] hover:bg-[#f0f4f8]'
                    }`}
                >
                  {/* Dot indicator */}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${isActive ? 'bg-[#c8a96e]' : 'bg-[#d0dae6]'}`} />
                  {section.title}
                  {/* Active shimmer line */}
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full ring-1 ring-[#335C8B]/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══ MOBILE + TABLET LAYOUT (below 1024px) — Clean carousel ═══ */}
      <section id="events-list" className="lg:hidden bg-[#FBFBFB] py-8">
        <div className="mx-auto max-w-7xl px-6">
          {filteredData.map((section) => (
            <div key={section.title} className="scroll-mt-24">
              {/* Section title */}
              <div className="mb-6 md:mb-8 text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B] mb-2 text-left">Events &amp; Programs</p>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1a2d47] leading-tight text-left">{section.title}</h2>
                {section.description && (
                  <p className="text-[#5a7394] text-sm md:text-base font-light leading-relaxed mt-2 text-left">{section.description}</p>
                )}
              </div>

              {/* Mobile carousel (< 768px) */}
              <div className="md:hidden">
                <MobileCarousel items={section.items} />
              </div>

              {/* Tablet carousel (768px – 1023px) */}
              <div className="hidden md:block -mx-6 px-6">
                <TabletCarousel items={section.items} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DESKTOP LAYOUT (1024px+) — Cinematic split-scroll ═══ */}
      <section
        ref={eventsListRef}
        className="events-split-section hidden lg:block relative bg-[#FBFBFB] overflow-visible"
      >
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
          <div
            className="events-split-grid lg:grid lg:grid-cols-2 lg:gap-16"
            style={{ minHeight: overrideMinHeight || splitScrollHeight }}
          >
            {/* LEFT: Pinned media panel */}
            <div className="events-split-media relative">
              <div
                ref={leftImagePinRef}
                className="sticky z-10 w-full overflow-hidden rounded-2xl bg-[#0b1526] shadow-2xl will-change-transform"
                style={{
                  position: 'sticky',
                  top: '160px',
                  height: 'calc(100vh - 200px)',
                }}
              >
                {filteredItems.map((item, index) => {
                  const isActive =
                    hoveredImage
                      ? isSameImage(hoveredImage, item.image)
                      : activeItemIndex === index
                  return (
                    <div
                      key={item.title}
                      className="absolute inset-0 transition-all duration-700 ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'scale(1)' : 'scale(1.06)',
                        willChange: 'opacity, transform',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => { e.currentTarget.src = '/images/festivals.webp' }}
                        className="h-full w-full object-cover"
                        style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                  )
                })}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0b1526]/70 via-[#0b1526]/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* RIGHT: Scrolling event cards */}
            <div ref={cardsWrapRef} className="w-full min-w-0">
              {filteredData.map((section) => (
                <div key={section.title} className="scroll-mt-40">
                  {/* Desktop category header */}
                  <div className="pt-24 pb-8">
                    <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#1a2d47] mb-6 leading-tight">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-xl text-[#5a7394] leading-relaxed font-light">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {/* Desktop: full-viewport storytelling cards */}
                  <div>
                    {section.items.map((item, itemIdx) => {
                      const isActive = activeItemIndex === itemIdx
                      return (
                        <article
                          key={itemIdx}
                          id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                          ref={(el) => {
                            if (el) cardsRef.current[itemIdx] = el
                          }}
                          data-event-item
                          data-image={item.image}
                          data-index={itemIdx}
                          onMouseEnter={() => setHoveredImage(item.image)}
                          onMouseLeave={() => setHoveredImage(null)}
                          className={`event-scroll-card group flex min-h-screen items-center border-b border-[#e0e7ef] py-16 will-change-transform ${isActive ? 'relative' : ''
                            }`}
                        >
                          <div
                            className={`relative w-full rounded-2xl border border-[#e0e7ef] px-8 py-12 lg:px-10 lg:py-14 transition-colors duration-500 ${isActive
                              ? 'bg-[#F0F4F8] border-[#335C8B]/20 shadow-lg shadow-[#335C8B]/5'
                              : 'bg-white/80'
                              }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-[#c8a96e]" />
                            )}
                            <div className={isActive ? 'pl-4' : ''}>
                              <h3
                                className={`font-serif text-2xl lg:text-4xl leading-snug mb-6 transition-all duration-700 ease-out break-words ${isActive
                                  ? 'text-[#335C8B] blur-0'
                                  : 'text-[#1a2d47] group-hover:text-[#335C8B] blur-[3px]'
                                  }`}
                              >
                                {item.title}
                              </h3>
                              <p
                                className={`text-lg leading-relaxed font-light text-justify transition-colors duration-500 break-words ${isActive ? 'text-[#1a2d47]' : 'text-[#5a7394]'
                                  }`}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legacy and Sign-off - Museum Style (GSAP Animated) */}
      <section ref={legacyContainerRef} className="bg-[#0b1526] py-32 lg:py-48 relative overflow-hidden">
        {/* Parallax Background */}
        <div
          ref={legacyBgRef}
          className="absolute -top-[20%] left-0 w-full h-[140%] bg-[radial-gradient(circle_at_center,_rgba(51,92,139,0.15)_0%,_transparent_60%)]"
        />

        <div className="mx-auto max-w-5xl px-6 lg:px-12 relative">
          <div className="text-center">
            <div className="legacy-reveal flex justify-center mb-12">
              <Image src="/images/om.webp" alt="om" width={80} height={80} sizes="80px" className="opacity-30 mix-blend-luminosity" />
            </div>

            <h2 className="legacy-reveal mb-10 font-serif text-4xl font-light text-white md:text-6xl leading-tight">
              Legacy of Excellence <br />
              <span className="italic text-[#8a9bb5]">& Cultural Bridge-building</span>
            </h2>

            <p className="legacy-reveal text-base md:text-lg lg:text-2xl text-[#a3b8d4] leading-relaxed font-light max-w-4xl mx-auto mb-20 text-justify md:text-center">
              Recon International Charitable Trust, under the aegis of IIIRRC Trust, has continually bridged Tourism, Pilgrim, Spiritual Tradition, Cultural expression, and Global connectivity. With a proven track record in program execution, grassroots engagement, and international outreach, the Trust stands as a torchbearer of India’s Cultural Diplomacy and Spiritual ethos.
            </p>

            <div className="legacy-reveal pt-16 border-t border-white/10 flex flex-col items-center max-w-sm mx-auto">
              <p className="text-3xl font-serif font-light text-white tracking-wide">
                K. Chandra Shekher Rao
              </p>
              <p className="mt-4 text-[#6b9fd4] font-bold tracking-[0.3em] uppercase text-xs">
                Managing Trustee
              </p>
              <p className="mt-6 text-[#8a9bb5] font-mono tracking-widest text-sm">
                +91 950 510 015
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const MobileCarousel = ({ items }: { items: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = scrollRef.current.firstElementChild?.clientWidth || clientWidth;
          const gap = 20;
          scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-5 pb-6 px-1"
    >
      {items.map((item, itemIdx) => (
        <div
          key={itemIdx}
          id={`mobile-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="group w-[calc(100vw-3rem)] snap-center flex-shrink-0 flex flex-col rounded-[28px] overflow-hidden border border-[#edf2f7] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
        >
          {/* Top: Image — 50% */}
          <div className="relative h-[50%] w-full overflow-hidden flex-shrink-0">
            <img
              src={item.thumb || item.image}
              onError={(e) => { e.currentTarget.src = '/images/festivals.webp' }}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
              style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/70 via-transparent to-transparent pointer-events-none" />
            {/* Premium Event Badge */}
            <div className="absolute left-6 bottom-6 z-10">
              <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#183153] shadow-md">
                Featured Event
              </span>
            </div>
          </div>

          {/* Bottom: Content — 50% */}
          <div className="flex h-[50%] flex-col justify-between px-6 py-6 bg-white">
            <div className="text-left">
              <h3 className="font-serif text-[22px] leading-[1.2] tracking-[-0.02em] text-[#183153] line-clamp-2 text-left break-words">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.6] text-[#5c6b82] font-normal line-clamp-4 mt-3 text-left break-words">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TabletCarousel = ({ items }: { items: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth;
      const gap = 32;
      const idx = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(idx, items.length - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth;
    const gap = 32;
    el.scrollTo({ left: idx * (cardWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Carousel track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 pb-8 scroll-px-6"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            id={`mobile-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="group w-[68vw] max-w-[620px] h-[520px] snap-center flex-shrink-0 flex flex-col rounded-[28px] overflow-hidden border border-[#edf2f7] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
          >
            {/* Top: Image — 62% */}
            <div className="relative h-[62%] w-full overflow-hidden flex-shrink-0">
              <img
                src={item.thumb || item.image}
                onError={(e) => { e.currentTarget.src = '/images/festivals.webp' }}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
                style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/70 via-transparent to-transparent pointer-events-none" />
              {/* Premium Event Badge */}
              <div className="absolute left-6 bottom-6 z-10">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#183153] shadow-md">
                  Featured Event
                </span>
              </div>
            </div>

            {/* Bottom: Content — 38% */}
            <div className="flex h-[38%] flex-col justify-between px-8 py-7 bg-white">
              <div className="text-left">
                <h3 className="font-serif text-[30px] leading-[1.15] tracking-[-0.02em] text-[#183153] line-clamp-2 text-left break-words">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.8] text-[#5c6b82] font-normal line-clamp-3 mt-4 text-left break-words">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${activeIndex === idx
              ? 'bg-[#335C8B] w-6 h-2'
              : 'bg-[#d0dae6] w-2 h-2 hover:bg-[#8a9bb5]'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
