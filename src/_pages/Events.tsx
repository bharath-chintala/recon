'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
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
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=2574&auto=format&fit=crop',
    items: [
      {
        title: 'Hari Hara Kalyana Purvaka Shri Satyanarayana Swamy Anushtan Mahotsav (5–15 February 2025)',
        desc: 'A grand 11-day spiritual and cultural celebration organized at Naimisharanya in collaboration with Naimisharanya Tirth Dham Vikas Parishad, with the support of the Department of Tourism & Culture, Government of Uttar Pradesh.',
        image: '/images/satyanarayana.png',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Colombo, Sri Lanka',
        desc: 'A high-profile spiritual event graced by Shri Santhosh Jha, Indian High Commissioner to Sri Lanka.',
        image: '/images/venkateshwara.png',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Puchong, Malaysia',
        desc: 'A vibrant cultural celebration featuring a delegation of women artists from Telangana, strengthening Telugu cultural roots abroad.',
        image: '/images/venkateshwara.png',
      },
      {
        title: 'Carnival of Indian Culture – Ganga Pushkar Mahotsav, Haridwar',
        desc: 'A 10-day event featuring over 630 emerging artists, celebrating India’s diverse traditional arts.',
        image: '/images/ganga puskara.png',
      },
      {
        title: 'Parakram Divas Celebrations – Azadi Ka Amrit Mahotsav, New Delhi',
        desc: 'A four-day commemoration at Ambedkar Auditorium, AP Bhawan, honouring India’s freedom fighters, with special tribute to Netaji Subhash Chandra Bose, in association with the Ministry of Culture, Government of India.',
        image: '/images/parakarana divas.png',
      },
      {
        title: 'Cultural Festivities of Varanasi',
        desc: 'Organized in collaboration with Banaras Hindu University, supported by the Department of Culture, Government of Uttar Pradesh, celebrating Varanasi’s rich artistic legacy.',
        image: 'https://images.unsplash.com/photo-1560086820-e7cfba1bd53d?q=80&w=2670&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2600&auto=format&fit=crop',
    items: [
      {
        title: 'Short Film Contest (2018)',
        desc: 'Held at Ravindrabharathi, Hyderabad to encourage creative expression among young filmmakers.',
        image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2671&auto=format&fit=crop',
      },
      {
        title: 'Kanakabhishekam (Golden Flower Anointing Ceremony)',
        desc: 'Celebrated the 80th Spring Festival of Dr. Tirumala Srinivasa Chary, honouring his contributions to spiritual and cultural life.',
        image: 'https://images.unsplash.com/photo-1518175376518-e362da562da8?q=80&w=2670&auto=format&fit=crop',
      },
    ],
  },
  {
    title: 'Cultural Exchange & International Engagements',
    description: 'The Trust has a long-standing legacy of leading cultural delegations from Andhra Pradesh and Telangana to several international destinations in association with erstwhile Government of Andhra Pradesh and Government of Telangana:',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2670&auto=format&fit=crop',
    items: [
      {
        title: 'Indian Classical Dance Troupes in Sri Lanka',
        desc: 'Including performances at the Shankari Temple, and participation in the Indian Traditional Dance Competition (Aug 2017).',
        image: 'https://images.unsplash.com/photo-1594112674390-349f42df3522?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Bathukamma Festival in Kuala Lumpur (2016)',
        desc: 'In collaboration with the Malaysia Telangana Association (MYTA).',
        image: '/images/telangana.png',
      },
      {
        title: 'Ugadi Celebrations (2016)',
        desc: 'Kuala Lumpur, featuring classical and folk arts such as Perini, Kuchipudi, Lambadi dance, and mimicry.',
        image: 'https://images.unsplash.com/photo-1506450519339-e932bce228dc?q=80&w=2657&auto=format&fit=crop',
      },
      {
        title: 'Golden Jubilee Celebrations',
        desc: 'Malaysia Telugu Sangham, Teluk Intan, showcasing Telugu culture on an international stage.',
        image: 'https://images.unsplash.com/photo-1533227260828-531c6c5ad326?q=80&w=2670&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop',
      },
      {
        title: 'Pilgrimage Support (2023–2024)',
        desc: 'Facilitated spiritual access and safe travel for over 400 visually impaired pilgrims to Tirumala supported by TTD, Andhra Pradesh.',
        image: 'https://images.unsplash.com/photo-1601614742468-b7c72957b98f?q=80&w=2574&auto=format&fit=crop',
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

export default function Events() {
  const [programData, setProgramData] = useState(PROGRAM_DATA)
  const [filter, setFilter] = useState(PROGRAM_DATA[0].title)
  const [activeSectionId, setActiveSectionId] = useState(PROGRAM_DATA[0].title)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

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
          let imageUrl = localImage || evt.image || '/images/events.png';
          let thumbUrl = imageUrl;
          if (imageUrl.includes('.webp') && !imageUrl.includes('-thumb.webp')) {
            thumbUrl = imageUrl.replace('.webp', '-thumb.webp');
          }

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
          image: groupedMap[catName][0]?.image || '/images/events.png',
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
              window.scrollTo({ top: y, behavior: 'smooth' })
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

  // Determine active image based on filter, scroll position, and hover state
  const activeImage = hoveredImage || filteredData[0]?.image

  const handleFilterClick = (newFilter: string) => {
    setFilter(newFilter)
    const eventsList = document.getElementById('events-list')
    if (eventsList) {
      // Scroll to the top of the events list, offsetting for the sticky filter bar
      const y = eventsList.getBoundingClientRect().top + window.scrollY - 150
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Refs for GSAP
  const introContainerRef = useRef<HTMLDivElement>(null)
  const legacyContainerRef = useRef<HTMLDivElement>(null)
  const legacyBgRef = useRef<HTMLDivElement>(null)

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

  // Scroll-linked dynamic scaling text setup
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Dynamic values based on scroll progress
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 4])
  const opacityText = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0, 0])
  const blurBg = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"])

  return (
    <main className="bg-[#FBFBFB] min-h-screen">
      {/* Scroll-Linked Dynamic Scaling Hero */}
      <section ref={heroRef} className="relative h-[150vh] bg-[#0b1526]">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
          <motion.div
            style={{ filter: blurBg, backgroundImage: "url('/images/events.png')" }}
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
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
              Key Events & <br/>
              <span className="relative text-[#a3b8d4] italic pr-2">
                Programs
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro Text - GSAP Animated */}
      <section ref={introContainerRef} className="relative z-20 bg-[#FBFBFB] pt-24 pb-16 px-6 lg:px-12 rounded-t-[3rem] -mt-12 shadow-2xl">
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
      <section className="relative z-20 bg-[#FBFBFB] sticky top-20 shadow-[0_2px_24px_rgba(26,45,71,0.07)] transition-all duration-300">
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
                  className={`relative whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold tracking-[0.04em] transition-all duration-300 border ${
                    isActive
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

      {/* Split-Screen Editorial List Layout */}
      <section id="events-list" className="py-24 lg:py-48">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-24 relative">
            
            {/* LEFT: Sticky Image Column */}
            <div className="hidden lg:block lg:col-span-6 relative h-full">
              <div className="sticky top-40 h-[75vh] w-full overflow-hidden rounded-2xl bg-[#0b1526] shadow-2xl">
                {/* Dramatic Framer Motion Curtain Reveal */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ clipPath: 'inset(100% 0 0 0)', filter: 'brightness(1.5) blur(10px)' }}
                    animate={{ clipPath: 'inset(0% 0 0 0)', filter: 'brightness(1) blur(0px)' }}
                    exit={{ clipPath: 'inset(0 0 100% 0)', filter: 'brightness(0.5) blur(10px)' }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={activeImage}
                      onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Section Image"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Subtle gradient overlay to make it look premium */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1526]/60 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* RIGHT: Scrollable Content Column */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-40 lg:space-y-64 pb-64"
                >
                  {filteredData.map((section) => (
                    <motion.div 
                      key={section.title} 
                      className="scroll-mt-40"
                      onViewportEnter={() => setActiveSectionId(section.title)}
                      viewport={{ margin: "-40% 0px -40% 0px" }} // Triggers when section hits middle of screen
                    >
                      {/* Mobile/Tablet Section Header (Image with Overlay) */}
                      <div className="block lg:hidden mb-12 w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden relative shadow-lg">
                         <img src={section.image} onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }} alt={section.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0b1526]/80 via-[#0f1d30]/30 to-transparent pointer-events-none flex flex-col justify-end p-8 md:p-12">
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
                              {section.title}
                            </h2>
                            {section.description && (
                              <p className="text-[#c8d6e8] text-lg md:text-xl font-light leading-relaxed">
                                {section.description}
                              </p>
                            )}
                         </div>
                      </div>

                      {/* Desktop Section Header (Pure Typography) */}
                      <div className="hidden lg:block mb-16">
                        <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#1a2d47] mb-6 leading-tight">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-xl text-[#5a7394] leading-relaxed font-light">
                            {section.description}
                          </p>
                        )}
                      </div>

                      {/* Mobile/Tablet: Auto-Scrolling Carousel */}
                      <div className="block lg:hidden mt-8 -mx-6 md:-mx-12 px-6 md:px-12">
                        <MobileCarousel items={section.items} />
                      </div>

                      {/* Desktop: Vertical List */}
                      <div className="hidden lg:block border-t border-[#d0dae6]">
                        {section.items.map((item, itemIdx) => (
                          <motion.div
                            key={itemIdx}
                            id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ x: 15, backgroundColor: 'rgba(232, 237, 243, 0.4)' }}
                            onMouseEnter={() => setHoveredImage(item.image)}
                            onMouseLeave={() => setHoveredImage(null)}
                            className="group py-12 lg:py-16 border-b border-[#e0e7ef] lg:hover:px-8 lg:-mx-8 transition-all duration-500 cursor-default rounded-2xl flex flex-col"
                          >
                            {/* Text Content */}
                            <div>
                              {/* Title */}
                              <h3 className="font-serif text-2xl lg:text-3xl text-[#1a2d47] leading-snug mb-4 group-hover:text-[#335C8B] transition-colors duration-500 pr-4">
                                {item.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-lg text-[#5a7394] leading-relaxed font-light text-justify">
                                {item.desc}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
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
               <Image src="/images/mandala.svg" alt="mandala" width={80} height={80} className="opacity-30" />
            </div>
            
            <h2 className="legacy-reveal mb-10 font-serif text-4xl font-light text-white md:text-6xl leading-tight">
              Legacy of Excellence <br />
              <span className="italic text-[#8a9bb5]">& Cultural Bridge-building</span>
            </h2>
            
            <p className="legacy-reveal text-2xl text-[#a3b8d4] leading-relaxed font-light max-w-4xl mx-auto mb-20">
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
          const gap = 32; 
          scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 pb-8"
    >
      {items.map((item, itemIdx) => (
        <div key={itemIdx} id={`mobile-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-[85vw] md:w-[70vw] snap-center flex-shrink-0 flex flex-col bg-[#FBFBFB] rounded-2xl p-6 md:p-8 border border-[#e0e7ef] shadow-sm relative overflow-hidden group">
          <div className="w-full aspect-[4/3] md:aspect-[16/9] mb-8 rounded-xl overflow-hidden relative shadow-md">
            <img 
              src={item.thumb || item.image} 
              onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="font-serif text-2xl lg:text-3xl text-[#1a2d47] leading-snug mb-4 pr-4">
              {item.title}
            </h3>
            <p className="text-lg text-[#5a7394] leading-relaxed font-light text-justify">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
