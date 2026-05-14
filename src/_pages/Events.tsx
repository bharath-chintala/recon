'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { fadeInUp, stagger, viewportOnce } from '@/animations/variants'

const PROGRAM_DATA = [
  {
    title: 'Key Cultural & Spiritual Initiatives',
    description: '',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=2574&auto=format&fit=crop',
    items: [
      {
        title: 'Hari Hara Kalyana Purvaka Shri Satyanarayana Swamy Anushtan Mahotsav (5–15 February 2025)',
        desc: 'A grand 11-day spiritual and cultural celebration organized at Naimisharanya in collaboration with Naimisharanya Tirth Dham Vikas Parishad, with the support of the Department of Tourism & Culture, Government of Uttar Pradesh.',
        image: 'https://images.unsplash.com/photo-1605374465597-94eec9e9f6be?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Colombo, Sri Lanka',
        desc: 'A high-profile spiritual event graced by Shri Santhosh Jha, Indian High Commissioner to Sri Lanka.',
        image: 'https://images.unsplash.com/photo-1623862211516-d6e4b85c2c77?q=80&w=2664&auto=format&fit=crop',
      },
      {
        title: 'Sri Venkateshwara Kalyana Mahotsav, Puchong, Malaysia',
        desc: 'A vibrant cultural celebration featuring a delegation of women artists from Telangana, strengthening Telugu cultural roots abroad.',
        image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=2536&auto=format&fit=crop',
      },
      {
        title: 'Carnival of Indian Culture – Ganga Pushkar Mahotsav, Haridwar',
        desc: 'A 10-day event featuring over 630 emerging artists, celebrating India’s diverse traditional arts.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2676&auto=format&fit=crop',
      },
      {
        title: 'Parakram Divas Celebrations – Azadi Ka Amrit Mahotsav, New Delhi',
        desc: 'A four-day commemoration at Ambedkar Auditorium, AP Bhawan, honouring India’s freedom fighters, with special tribute to Netaji Subhash Chandra Bose, in association with the Ministry of Culture, Government of India.',
        image: 'https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?q=80&w=2670&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1582236676342-302a9b4074ef?q=80&w=2574&auto=format&fit=crop',
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
        desc: 'Held across five government schools in Hyderabad to celebrate Sri Ramanujan’s 131st birth anniversary.',
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
  const [filter, setFilter] = useState('All')
  const [activeSectionId, setActiveSectionId] = useState(PROGRAM_DATA[0].title)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const filteredData = filter === 'All' ? PROGRAM_DATA : PROGRAM_DATA.filter((s) => s.title === filter)

  // Determine active image based on filter, scroll position, and hover state
  const activeImage = hoveredImage || (filter === 'All' 
    ? PROGRAM_DATA.find(s => s.title === activeSectionId)?.image || PROGRAM_DATA[0].image
    : filteredData[0]?.image)

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
    <main className="bg-stone-50 min-h-screen">
      {/* Scroll-Linked Dynamic Scaling Hero */}
      <section ref={heroRef} className="relative h-[150vh] bg-stone-950">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
          <motion.div
            style={{ filter: blurBg, backgroundImage: "url('/images/festivals.jpg')" }}
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/80 to-stone-950" />
          
          <motion.div 
            style={{ scale: scaleText, opacity: opacityText, transformOrigin: "center center" }}
            className="relative z-10 flex flex-col items-center justify-center text-center will-change-transform"
          >
            {/* Eyebrow */}
            <motion.p
              className="mb-6 inline-flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400"
            >
              <span className="h-[1px] w-12 bg-amber-400/50" />
              Impact & Initiatives
              <span className="h-[1px] w-12 bg-amber-400/50" />
            </motion.p>

            {/* Headline */}
            <h1 className="mb-8 font-serif text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl mix-blend-screen">
              Key Events & <br/>
              <span className="relative text-stone-300 italic pr-2">
                Programs
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro Text (Overlaps the end of the sticky section) */}
      <section className="relative z-20 bg-stone-50 pt-24 pb-16 px-6 lg:px-12 rounded-t-[3rem] -mt-12 shadow-2xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl text-stone-1000 leading-relaxed font-light-bold mb-8"
          >
            Recon International Charitable Trust, Hyderabad, has successfully conceptualized and delivered a diverse portfolio of initiatives, encompassing cultural programs, spiritual observances, international forums, and corporate summits.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-stone-500 leading-relaxed font-light"
          >
            Since 1993, we have been actively engaged in international trade facilitation and the organisation of cultural programs and curated tour packages across global platforms, fostering cross-cultural exchange and international collaboration.
          </motion.p>
        </div>
      </section>

      {/* Sleek Minimalist Filter */}
      <section className="relative z-20 bg-stone-50 border-b border-stone-200 sticky top-20 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-center gap-8 overflow-x-auto no-scrollbar py-6"
          >
            <motion.button
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              onClick={() => handleFilterClick('All')}
              className={`whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                filter === 'All'
                  ? 'text-stone-900 border-b-2 border-amber-600'
                  : 'text-stone-400 hover:text-stone-900 border-b-2 border-transparent'
              }`}
            >
              All Programs
            </motion.button>
            {PROGRAM_DATA.map((section) => (
              <motion.button
                key={section.title}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                onClick={() => handleFilterClick(section.title)}
                className={`whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  filter === section.title
                    ? 'text-stone-900 border-b-2 border-amber-600'
                    : 'text-stone-400 hover:text-stone-900 border-b-2 border-transparent'
                }`}
              >
                {section.title}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Split-Screen Editorial List Layout */}
      <section id="events-list" className="py-24 lg:py-48">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-24 relative">
            
            {/* LEFT: Sticky Image Column */}
            <div className="hidden lg:block lg:col-span-6 relative h-full">
              <div className="sticky top-40 h-[75vh] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Section Image"
                  />
                </AnimatePresence>
                {/* Subtle gradient overlay to make it look premium */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* RIGHT: Scrollable Content Column */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                         <img src={section.image} onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }} alt={section.title} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent pointer-events-none flex flex-col justify-end p-8 md:p-12">
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
                              {section.title}
                            </h2>
                            {section.description && (
                              <p className="text-stone-200 text-lg md:text-xl font-light leading-relaxed">
                                {section.description}
                              </p>
                            )}
                         </div>
                      </div>

                      {/* Desktop Section Header (Pure Typography) */}
                      <div className="hidden lg:block mb-16">
                        <h2 className="font-serif text-3xl lg:text-5xl font-light text-stone-900 mb-6 leading-tight">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-lg lg:text-xl text-stone-500 leading-relaxed font-light">
                            {section.description}
                          </p>
                        )}
                      </div>

                      {/* Mobile/Tablet: Auto-Scrolling Carousel */}
                      <div className="block lg:hidden mt-8 -mx-6 md:-mx-12 px-6 md:px-12">
                        <MobileCarousel items={section.items} />
                      </div>

                      {/* Desktop: Vertical List */}
                      <div className="hidden lg:block border-t border-stone-300">
                        {section.items.map((item, itemIdx) => (
                          <motion.div
                            key={itemIdx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: itemIdx * 0.05, duration: 0.5 }}
                            onMouseEnter={() => setHoveredImage(item.image)}
                            onMouseLeave={() => setHoveredImage(null)}
                            className="group py-10 lg:py-16 border-b border-stone-200 hover:bg-stone-100/50 lg:hover:px-8 lg:-mx-8 transition-all duration-500 cursor-default rounded-lg flex flex-col"
                          >
                            {/* Text Content */}
                            <div>
                              {/* Number */}
                              <div className="mb-4 text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">
                                No. {String(itemIdx + 1).padStart(2, '0')}
                              </div>
                              
                              {/* Title */}
                              <h3 className="font-serif text-2xl lg:text-3xl text-stone-900 leading-snug mb-4 group-hover:text-amber-700 transition-colors duration-500 pr-4">
                                {item.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-lg text-stone-500 leading-relaxed font-light">
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

      {/* Legacy and Sign-off - Museum Style */}
      <section className="bg-stone-950 py-32 lg:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,168,83,0.1)_0%,_transparent_60%)]" />
        <div className="mx-auto max-w-5xl px-6 lg:px-12 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-12">
               <Image src="/images/mandala.svg" alt="mandala" width={64} height={64} className="opacity-40" />
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="mb-10 font-serif text-4xl font-light text-white md:text-6xl leading-tight">
              Legacy of Excellence <br />
              <span className="italic text-stone-400">& Cultural Bridge-building</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-2xl text-stone-300 leading-relaxed font-light max-w-4xl mx-auto mb-20">
              Recon International Charitable Trust, under the aegis of IIIRRC Trust, has continually bridged Tourism, Pilgrim, Spiritual Tradition, Cultural expression, and Global connectivity. With a proven track record in program execution, grassroots engagement, and international outreach, the Trust stands as a torchbearer of India’s Cultural Diplomacy and Spiritual ethos.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-16 border-t border-white/10 flex flex-col items-center max-w-sm mx-auto">
              <p className="text-3xl font-serif font-light text-white tracking-wide">
                K. Chandra Shekher Rao
              </p>
              <p className="mt-4 text-amber-500 font-bold tracking-[0.3em] uppercase text-xs">
                Managing Trustee
              </p>
              <p className="mt-6 text-stone-500 font-mono tracking-widest text-sm">
                +91 950 510 015
              </p>
            </motion.div>
          </motion.div>
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
        // If we reach the end (with a 10px buffer), scroll back to start
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Calculate the width of one card + gap (approx) to scroll by
          const cardWidth = scrollRef.current.firstElementChild?.clientWidth || clientWidth;
          const gap = 32; // gap-8 is 32px
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
        <div key={itemIdx} className="w-[85vw] md:w-[70vw] snap-center flex-shrink-0 flex flex-col bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm relative overflow-hidden group">
          {/* Card Content */}
          <div className="w-full aspect-[4/3] md:aspect-[16/9] mb-8 rounded-xl overflow-hidden relative shadow-md">
            <img 
              src={item.image} 
              onError={(e) => { e.currentTarget.src = '/images/festivals.jpg' }} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="mb-4 text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">
              No. {String(itemIdx + 1).padStart(2, '0')}
            </div>
            <h3 className="font-serif text-2xl lg:text-3xl text-stone-900 leading-snug mb-4 pr-4">
              {item.title}
            </h3>
            <p className="text-lg text-stone-500 leading-relaxed font-light">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
