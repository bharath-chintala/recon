'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { trustMembers } from '@/data/content'
import { Counter } from '@/components/ui/Counter'
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  stagger,
  viewportOnce,
} from '@/animations/variants'

export default function About() {
  return (
    <main className="pt-20">
      {/* Page Hero */}
      <section className="relative bg-[#0b1526] py-32 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/about h.png')" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center mt-12">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-black"
          >
            Who We Are
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl font-bold text-white md:text-6xl"
          >
            About Recon International
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl mx-auto text-lg font-bold text-black uppercase tracking-wide"
          >
            Meaningful travel experiences focused on sacred journeys and spiritual exploration.
          </motion.p>
        </div>
      </section>

      {/* About Us */}
      <section id="about-us" className="bg-[#FBFBFB] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeInUp} className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B]">Our Philosophy</motion.p>
              <motion.h2 variants={fadeInUp} className="mb-6 font-serif text-4xl font-bold text-[#1a2d47] uppercase">
                About Us
              </motion.h2>
              <motion.p variants={fadeInUp} className="mb-5 text-lg leading-relaxed text-[#5a7394] tracking-wide">
                At Recon International, we believe travel should transform. Guided by a passion for meaningful experiences, we design journeys that immerse you in sacred sites, cultural traditions, and moments of personal reflection. Every itinerary is crafted with care, offering authenticity, comfort, and a deeper connection to the world around you.
              </motion.p>
            </motion.div>
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative h-96 overflow-hidden rounded-3xl"
            >
              <Image
                src="/images/temples.jpg"
                alt="Ancient temple heritage site"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="bg-white py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Column: Heading and Lead */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:col-span-5"
            >
              <motion.p variants={fadeInUp} className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B]">The Legacy</motion.p>
              <motion.h2 variants={fadeInUp} className="mb-8 font-serif text-4xl font-bold text-[#1a2d47] lg:text-5xl uppercase">
                Our Story
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl leading-relaxed text-[#5a7394] font-medium tracking-wide">
                Recon International Charitable Trust (ReKnow) is a globally respected nonprofit organization headquartered in Hyderabad, India, with a distinguished legacy of over <strong className="text-[#335C8B]">30 years of leadership</strong> in cultural preservation, education, social development, international cultural exchange, and tourism promotion.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-12 border-l-4 border-[#335C8B] pl-6 py-2">
                <p className="font-serif text-2xl italic text-[#1a2d47] leading-snug">
                  "Save Our Culture for the Next Generation."
                </p>
                <p className="mt-3 text-sm uppercase tracking-widest text-[#335C8B] font-bold">Our Enduring Vision</p>
              </motion.div>
            </motion.div>

            {/* Right Column: Grid Details */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:col-span-7 flex flex-col justify-between"
            >
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 text-[#5a7394] text-justify text-sm leading-relaxed tracking-wide">
                
                {/* Cultural Pillar */}
                <div className="space-y-6">
                  <motion.p variants={fadeInUp}>
                    Recon International is committed to safeguarding intangible cultural heritage while empowering artists, educators, cultural practitioners, and emerging talent.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    The Trust creates structured and sustainable opportunities for dance teachers, cultural mentors, and their disciples, ensuring the continuity and global relevance of India's classical and folk traditions.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    Through professionally curated national and international platforms, Recon International bridges tradition with innovation and heritage with contemporary global audiences.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    Adopting a holistic and globally aligned approach, Recon International integrates culture, education, tourism exchange, and social responsibility into every initiative.
                  </motion.p>
                </div>

                {/* Global & Diplomatic Pillar */}
                <div className="space-y-6">
                  <motion.p variants={fadeInUp}>
                    Over the past three decades, Recon International has successfully conceptualized and delivered <strong className="text-[#1a2d47]">160+ national and international initiatives across 16 countries</strong>. Its global footprint spans Sri Lanka, Mauritius, the Middle East, Malaysia, Singapore, South Africa, Bhutan, Nepal, and Europe, among others.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    These initiatives have been implemented in collaboration with, and on behalf of, State and Central Government Tourism and Cultural Departments. Recon International positions culture as a strategic instrument of cultural diplomacy, international tourism exchange, and people-to-people engagement.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    Through festivals, performances, cultural delegations, and curated showcases, the Trust actively promotes India's tourism destinations and heritage narratives worldwide. Beyond cultural representation, Recon International advances education and social empowerment through CSR initiatives and academic support for economically disadvantaged students.
                  </motion.p>
                </div>
              </div>

              {/* Concluding Statement */}
              <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-[#e0e7ef]">
                <p className="font-bold text-[#335C8B] italic text-lg leading-relaxed text-center">
                  Guided by integrity, professionalism, and excellence, Recon International continues to strengthen India's global cultural presence and soft power, creating lasting impact for future generations.
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Members */}
      <section id="members" className="bg-[#FBFBFB] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mb-16 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B]">Leadership</motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl font-bold text-[#1a2d47]">Trust Members</motion.h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trustMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col h-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#e0e7ef] hover:-translate-y-1 transition-transform"
              >
                <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#dde6f0]">
                  <Image src={member.portrait} alt={member.name} fill className="object-cover" />
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-[#1a2d47] uppercase tracking-wide leading-tight">{member.name}</h3>
                  <p className="text-sm text-[#335C8B] font-bold mt-2 uppercase tracking-wider">{member.role}</p>
                  <p className="text-xs text-[#8a9bb5] mt-1 uppercase tracking-widest">{member.country}</p>
                </div>
                <p className="text-sm text-[#5a7394] leading-relaxed text-justify flex-grow">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
