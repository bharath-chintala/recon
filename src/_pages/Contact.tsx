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
    'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all'

  return (
    <main className="pt-20">
      {/* Page hero */}
      <section className="relative bg-stone-950 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-950" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Reach Out
          </motion.p>
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="font-serif text-5xl font-bold text-white md:text-6xl">
            Get In Touch
          </motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mt-6 max-w-xl mx-auto text-lg text-stone-400">
            Whether you're a government, foundation, cultural institution, or individual — we'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Info panel */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <h2 className="mb-6 font-serif text-3xl font-bold text-stone-900">
                Let's Build Something Together
              </h2>
              <p className="mb-10 text-stone-600 leading-relaxed text-lg">
                Our team typically responds within two business days. For urgent enquiries or press requests, please call our New Delhi office directly.
              </p>

              <div className="space-y-6">
                {[
                  { icon: '📍', label: 'Headquarters', value: 'New Delhi, India' },
                  { icon: '📧', label: 'Email', value: 'hello@reconinternational.org' },
                  { icon: '📞', label: 'Phone', value: '+91 11 2345 6789' },
                  { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri, 9am–6pm IST' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{item.label}</p>
                      <p className="text-stone-800 font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Press anchor */}
              <div id="press" className="mt-12 rounded-2xl bg-amber-50 border border-amber-100 p-6">
                <h3 className="font-bold text-stone-900 mb-2">Press & Media</h3>
                <p className="text-sm text-stone-600">
                  For media enquiries, interview requests, and press releases, contact our Communications team at{' '}
                  <a href="mailto:press@reconinternational.org" className="text-amber-700 font-semibold hover:underline">
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
                  className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-stone-100"
                >
                  <span className="text-5xl mb-4">✅</span>
                  <h3 className="text-2xl font-bold text-stone-900 mb-3">Message Sent!</h3>
                  <p className="text-stone-600">
                    Thank you for reaching out. Our team will be in touch within two business days.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  id="contact-form"
                  className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100 space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold text-stone-700">
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
                      <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold text-stone-700">
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
                    <label htmlFor="contact-org" className="mb-1.5 block text-xs font-bold text-stone-700">
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
                    <label htmlFor="contact-reason" className="mb-1.5 block text-xs font-bold text-stone-700">
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
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold text-stone-700">
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
                    Send Message →
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
