'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { fadeInUp, slideInLeft, slideInRight, stagger, viewportOnce } from '@/animations/variants'

const CONTACT_REASONS = [
  'General Enquiry',
  'Event Partnership',
  'Media & Press',
  'Programme Collaboration',
  'Sponsorship',
  'Other',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    reason: CONTACT_REASONS[0],
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    setSubmitted(true)
  }

  const inputClass =
    'w-full rounded-xl border border-[#d0dae6] bg-[#FBFBFB] px-4 py-3 text-sm text-[#1a2d47] placeholder-[#8a9bb5] focus:border-[#335C8B] focus:outline-none focus:ring-2 focus:ring-[#335C8B]/20 transition-all'

  return (
    <main className="pt-20">
      {/* Page hero */}
      <section className="relative bg-[#0b1526] py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#0b1526]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8bb8e8]">
            Reach Out
          </motion.p>
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="font-serif text-5xl font-bold text-white md:text-6xl">
            Get In Touch
          </motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mt-6 max-w-xl mx-auto text-lg text-[#8a9bb5]">
            Whether you're a Government, Foundation, Cultural Institution, or individual — we'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-[#FBFBFB] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Info panel */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <h2 className="mb-6 font-serif text-3xl font-bold text-[#1a2d47]">
                Let's Build Something Together
              </h2>
              <p className="mb-10 text-[#5a7394] leading-relaxed text-lg">
                Our team typically responds within two business days. For urgent enquiries or press requests, please call our Hyderabad office directly.
              </p>

              <div className="space-y-6">
                {[
                  { icon: '📍', label: 'Headquarters', value: '#103, Mount Nasir Apartments,\nBeside Ravindrabharathi,\nSaifabad, Hyderabad,\nTelangana - 500004' },
                  { icon: '📧', label: 'Email', value: 'hello@reconinternational.org' },
                  { icon: '📞', label: 'Phone', value: '+91 11 2345 6789' },
                  { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri, 10am– 4pm IST' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dde6f0] text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8a9bb5]">{item.label}</p>
                      <p className="text-[#1a2d47] font-medium whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Press anchor */}
              <div id="press" className="mt-12 rounded-2xl bg-[#e8edf3] border border-[#d0dae6] p-6">
                <h3 className="font-bold text-[#1a2d47] mb-2">Press & Media</h3>
                <p className="text-sm text-[#5a7394]">
                  For media enquiries, interview requests, and press releases, contact our Communications team at{' '}
                  <a href="mailto:press@reconinternational.org" className="text-[#335C8B] font-semibold hover:underline">
                    press@reconinternational.org
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-[#e0e7ef]"
                >
                  <span className="text-5xl mb-4">✅</span>
                  <h3 className="text-2xl font-bold text-[#1a2d47] mb-3">Message Sent!</h3>
                  <p className="text-[#5a7394]">
                    Thank you for reaching out. Our team will be in touch within two business days.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  id="contact-form"
                  className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#e0e7ef] space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold text-[#3a5068]">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold text-[#3a5068]">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-org" className="mb-1.5 block text-xs font-bold text-[#3a5068]">
                      Organisation
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={form.organisation}
                      onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                      placeholder="Ministry of Culture / UNESCO"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-reason" className="mb-1.5 block text-xs font-bold text-[#3a5068]">
                      Reason for Contact
                    </label>
                    <select
                      id="contact-reason"
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className={inputClass}
                    >
                      {CONTACT_REASONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold text-[#3a5068]">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className={inputClass}
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Send →
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="bg-white py-24 border-t border-[#e0e7ef]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#335C8B]"
            >
              Common Questions
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl font-bold text-[#1a2d47]"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: 'What is the core mission of Recon International?',
                a: 'Recon International is dedicated to cultural diplomacy, heritage preservation, and fostering people-to-people connections across 60+ nations through transformative travel and global initiatives.',
              },
              {
                q: 'How long has Recon International been active?',
                a: 'With over 30 years of leadership, we have conceptualized and delivered high-impact cultural programmes, international forums, and tourism initiatives worldwide.',
              },
              {
                q: 'Does Recon International work with Governments?',
                a: 'Yes, we frequently collaborate with State and Central Government Tourism and Cultural Departments to deliver strategic initiatives and spiritual observances.',
              },
              {
                q: 'Can individuals join your travel journeys?',
                a: 'Absolutely. Our "Awaken Through Travel" initiative is designed for individuals seeking transformative experiences that nourish both mind and soul through cultural immersion.',
              },
              {
                q: 'Where is your primary office located?',
                a: 'Our headquarters is located at #103, Mount Nasir Apartments, Saifabad, Hyderabad, Telangana, where our core team manages global operations.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-[#e0e7ef] bg-[#FBFBFB] transition-all duration-300 hover:border-[#335C8B] hover:shadow-lg hover:shadow-[#335C8B]/5"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-[#1a2d47] transition-colors group-hover:text-[#335C8B]">
                      {faq.q}
                    </h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dde6f0] text-xs font-bold text-[#335C8B] transition-all group-hover:rotate-180 group-hover:bg-[#335C8B] group-hover:text-white">
                      ↓
                    </span>
                  </div>

                  {/* Hover reveal content */}
                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mt-4 text-[#5a7394] leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>

  )
}
