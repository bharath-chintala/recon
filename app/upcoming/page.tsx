'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Mail, Phone, FileText, CheckCircle, Loader2, Sparkles, X, ChevronRight, Bookmark } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

const ORIGINAL_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: '1',
    date: 'Jun 15, 2025',
    day: '15',
    month: 'JUN',
    title: 'Heritage Walk & Cultural Marathon',
    subtitle: 'Charminar to Salar Jung, Hyderabad',
    description: 'A 5 km heritage trail through the walled city of Hyderabad — past Charminar, Laad Bazaar, and Salar Jung. Experience live classical performances at each historic landmark.',
    category: 'Cultural Walk',
    color: '#c8a96e',
    seats: '400 spots left',
    image: '/images/Haridwar event 2023/IMG_6700.webp'
  },
  {
    id: '2',
    date: 'Jul 08, 2025',
    day: '08',
    month: 'JUL',
    title: 'Sacred India Pilgrimage Yatra',
    subtitle: 'Tirupati · Varanasi · Ayodhya',
    description: "A 12-day guided spiritual journey across India's most sacred dhams. Experience Ganga Aarti, premium temple darshan, and interactive satsangs led by revered seers.",
    category: 'Pilgrimage Tour',
    color: '#335C8B',
    seats: '60 spots left',
    image: '/images/satyanarayana.webp'
  },
  {
    id: '3',
    date: 'Aug 22, 2025',
    day: '22',
    month: 'AUG',
    title: 'International Cultural Exchange Forum',
    subtitle: 'India Habitat Centre, New Delhi',
    description: 'A 2-day summit bringing together cultural attachés, traditional artists, and diplomats from 20+ nations to celebrate intangible heritage and build people-to-people soft power.',
    category: 'Global Summit',
    color: '#4a6fa5',
    seats: '120 spots left',
    image: '/images/Parakram Diwas/pa1.webp'
  }
]

export default function UpcomingEvents() {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null)
  const [registeredList, setRegisteredList] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRegs = localStorage.getItem('recon_registrations')
      return savedRegs ? JSON.parse(savedRegs) : []
    }
    return []
  })
  
  // Registration Form State
  const [fullName, setFullName] = useState('')
  const [aadharNo, setAadharNo] = useState('')
  const [panNo, setPanNo] = useState('')
  const [address, setAddress] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [emailNo, setEmailNo] = useState('')
  const [spouseName, setSpouseName] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [successRegistration, setSuccessRegistration] = useState<{ id: string; ticket: string } | null>(null)
  
  // Validation Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('upcoming_events')
          .select('*')
          .order('created_at', { ascending: true })
          
        if (data && data.length > 0) {
          setEvents(data)
        } else {
          setEvents(ORIGINAL_UPCOMING_EVENTS)
        }
      } catch {
        setEvents(ORIGINAL_UPCOMING_EVENTS)
      } finally {
        setLoading(false)
      }
    }
    fetchUpcoming()
  }, [])

  // Dynamic Seats Adjustment based on local storage registrations
  const getEventSeats = (event: UpcomingEvent) => {
    const isRegistered = registeredList.includes(event.id)
    if (isRegistered) {
      const num = parseInt(event.seats) - 1
      return isNaN(num) ? 'Registered' : `${num} spots left`
    }
    return event.seats
  }

  // Format Aadhar Card (XXXX XXXX XXXX)
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // remove non-digits
    if (value.length > 12) value = value.slice(0, 12) // limit to 12 digits
    
    // Group by 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setAadharNo(formatted)
  }

  // Format PAN Card (Capitalize first 5 chars, 4 digits, 1 char)
  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length > 10) value = value.slice(0, 10)
    setPanNo(value)
  }

  const validateForm = () => {
    const errs: { [key: string]: string } = {}
    
    if (fullName.trim().length < 3) errs.fullName = 'Full Name must be at least 3 characters.'
    
    const plainAadhar = aadharNo.replace(/\s/g, '')
    if (plainAadhar.length !== 12) errs.aadharNo = 'Aadhar must be exactly 12 digits.'
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(panNo)) errs.panNo = 'Enter a valid PAN (e.g. ABCDE1234F).'
    
    if (address.trim().length < 10) errs.address = 'Please provide a complete address.'
    
    const mobRegex = /^[6-9]\d{9}$/
    if (!mobRegex.test(mobileNo)) errs.mobileNo = 'Enter a valid 10-digit mobile number.'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailNo)) errs.emailNo = 'Enter a valid email address.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !selectedEvent) return

    setSubmitting(true)
    const ticketId = `RI-${selectedEvent.id}-${Date.now().toString().slice(-6)}`
    
    const registrationData = {
      event_id: selectedEvent.id,
      event_title: selectedEvent.title,
      full_name: fullName,
      aadhar_no: aadharNo.replace(/\s/g, ''),
      pan_no: panNo,
      address: address,
      mobile_no: mobileNo,
      email: emailNo,
      spouse_name: spouseName || null,
      ticket_no: ticketId,
      created_at: new Date().toISOString()
    }

    try {
      // Defensive insert to database, falling back elegantly if upcoming_registrations table does not exist
      const { error } = await supabase.from('upcoming_registrations').insert([registrationData])
      if (error) throw error
    } catch (err) {
      console.warn('Supabase insert failed, caching registration to localStorage:', err)
    }

    // Save registration locally
    const newRegList = [...registeredList, selectedEvent.id]
    setRegisteredList(newRegList)
    
    setTimeout(() => {
      localStorage.setItem('recon_registrations', JSON.stringify(newRegList))
      
      // Store exact ticket info locally
      const allTickets = JSON.parse(localStorage.getItem('recon_tickets') || '[]')
      allTickets.push(registrationData)
      localStorage.setItem('recon_tickets', JSON.stringify(allTickets))
    }, 0)

    setSuccessRegistration({ id: selectedEvent.id, ticket: ticketId })
    setSubmitting(false)
  }

  const handleCloseSuccess = () => {
    setSuccessRegistration(null)
    setSelectedEvent(null)
    
    // Clear form states
    setFullName('')
    setAadharNo('')
    setPanNo('')
    setAddress('')
    setMobileNo('')
    setEmailNo('')
    setSpouseName('')
    setErrors({})
  }

  return (
    <main className="min-h-screen bg-warm-ivory text-royal relative overflow-hidden pt-32 pb-24">
      {/* Cinematic watermarks */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-royal/[0.02] rounded-full pointer-events-none select-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-royal w-full h-full opacity-[0.03]">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.25" fill="none" />
          <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" stroke="currentColor" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Cinematic Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-[1.2px] w-8 bg-royal/20" />
            <p className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-saffron">
              Sacred Custody & Diplomacy
            </p>
            <span className="h-[1.2px] w-8 bg-royal/20" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cinzel text-4xl sm:text-6xl font-light text-royal leading-none tracking-tight mb-6"
          >
            Upcoming <span className="italic font-normal">Initiatives</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-cormorant text-xl md:text-2xl text-royal/70 italic leading-relaxed"
          >
            Participate in our upcoming pilgrim expeditions, international summits, and cultural preservation missions. Secure your credentials below.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-royal/60">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-medium tracking-wide">Loading Upcoming initiatives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, idx) => {
              const isRegistered = registeredList.includes(event.id)
              const seatsLabel = getEventSeats(event)

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-[2rem] border border-royal/10 shadow-xl shadow-royal/[0.02] overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-royal/[0.05] hover:-translate-y-1.5 transition-all duration-500"
                >
                  {/* Event image card */}
                  <div className="h-56 relative overflow-hidden bg-royal/10">
                    <img
                      src={event.image || '/images/events.webp'}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.src = '/images/festivals.webp' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Floating Date Badge */}
                    <div
                      className="absolute top-6 left-6 w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-md"
                      style={{ background: 'rgba(255,255,255,0.9)' }}
                    >
                      <span className="text-xl font-bold leading-none font-sans" style={{ color: event.color || '#000435' }}>
                        {event.day}
                      </span>
                      <span className="text-[9px] font-bold tracking-widest uppercase font-sans mt-0.5" style={{ color: event.color || '#000435' }}>
                        {event.month}
                      </span>
                    </div>

                    {/* Floating Category Badge */}
                    <span
                      className="absolute bottom-6 left-6 inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md"
                      style={{ backgroundColor: event.color || '#000435' }}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="font-serif text-2xl font-semibold text-royal leading-snug mb-2 group-hover:text-saffron transition-colors duration-300">
                      {event.title}
                    </h3>
                    
                    <p className="text-xs font-semibold text-saffron tracking-wider uppercase mb-5 flex items-center gap-1.5">
                      <MapPin size={13} className="text-saffron" />
                      {event.subtitle}
                    </p>

                    <p className="text-royal/70 font-light text-sm leading-relaxed mb-8 flex-1 text-justify">
                      {event.description}
                    </p>

                    <div className="pt-6 border-t border-royal/10 flex items-center justify-between mt-auto">
                      <span className="text-[11px] font-bold text-royal/60 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                        {seatsLabel}
                      </span>

                      {isRegistered ? (
                        <div className="flex items-center gap-1.5 bg-[#4CAF50]/10 text-[#4CAF50] px-4 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase">
                          <CheckCircle size={14} /> Registered
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex items-center gap-1.5 bg-royal hover:bg-saffron text-white hover:text-white px-5 py-2.5 rounded-full text-xs font-extrabold tracking-widest transition-all duration-300 shadow-md group/btn"
                        >
                          REGISTER NOW
                          <ChevronRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL FORM */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSuccess}
              className="absolute inset-0 bg-royal/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white border border-royal/10 rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-royal p-8 md:p-10"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseSuccess}
                className="absolute top-6 right-6 text-royal/40 hover:text-royal transition-colors p-2 hover:bg-royal/5 rounded-full"
              >
                <X size={20} />
              </button>

              {/* SUCCESS REGISTRATION PAGE */}
              {successRegistration ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={44} />
                  </motion.div>

                  <h3 className="font-serif text-3xl font-bold text-royal mb-3">
                    Registration Confirmed!
                  </h3>
                  
                  <p className="text-royal/60 text-sm max-w-sm mb-8 leading-relaxed">
                    Your credentials have been authenticated. An official invite package will be dispatched to your registered address.
                  </p>

                  <div className="bg-warm-ivory border border-royal/10 rounded-2xl p-6 w-full max-w-md mb-8 text-left">
                    <div className="flex items-center justify-between pb-4 border-b border-royal/10 mb-4">
                      <span className="text-[10px] font-bold text-royal/40 uppercase tracking-widest">REGISTRATION DETAILS</span>
                      <span className="text-[10px] font-bold text-white bg-royal px-2.5 py-1 rounded-full uppercase tracking-wider">OFFICIAL INVITE</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-royal/40 uppercase tracking-wider block">EVENT TITLE</span>
                        <span className="text-sm font-semibold text-royal leading-tight block">{selectedEvent.title}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-royal/40 uppercase tracking-wider block">FULL NAME</span>
                          <span className="text-xs font-semibold text-royal block">{fullName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-royal/40 uppercase tracking-wider block">MOBILE NUMBER</span>
                          <span className="text-xs font-mono font-semibold text-royal block">{mobileNo}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-royal/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-royal/40 uppercase tracking-wider block">CONFIRMATION TICKET NO.</span>
                          <span className="text-sm font-mono font-bold text-saffron block">{successRegistration.ticket}</span>
                        </div>
                        <Bookmark size={20} className="text-saffron" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseSuccess}
                    className="bg-royal hover:bg-saffron text-white px-8 py-3 rounded-full text-xs font-extrabold tracking-widest transition-colors duration-300"
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              ) : (
                /* REGISTRATION FORM */
                <div>
                  <div className="mb-8 pr-10">
                    <p className="text-[10px] font-bold text-saffron uppercase tracking-[0.2em] mb-2">✦ OFFICIAL ACCREDITATION FORM</p>
                    <h3 className="font-serif text-3xl font-semibold text-royal leading-snug mb-2">
                      Secure Your Pass
                    </h3>
                    <p className="text-royal/60 text-sm">
                      Registering for: <span className="font-bold text-royal">{selectedEvent.title}</span>
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Row: Full Name & Spouse Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Full Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name as per identity documents"
                          className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl px-4 py-2.5 text-sm text-royal focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                        />
                        {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Spouse Name (Optional)</label>
                        <input
                          type="text"
                          value={spouseName}
                          onChange={(e) => setSpouseName(e.target.value)}
                          placeholder="Enter spouse name (if accompanying)"
                          className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl px-4 py-2.5 text-sm text-royal focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                        />
                      </div>
                    </div>

                    {/* Row: Mobile Number & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 text-royal/30" size={15} />
                          <input
                            type="tel"
                            required
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile number"
                            className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-royal focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                          />
                        </div>
                        {errors.mobileNo && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.mobileNo}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 text-royal/30" size={15} />
                          <input
                            type="email"
                            required
                            value={emailNo}
                            onChange={(e) => setEmailNo(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-royal focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                          />
                        </div>
                        {errors.emailNo && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.emailNo}</p>}
                      </div>
                    </div>

                    {/* Row: Aadhar & PAN Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Aadhar Card Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-3.5 text-royal/30" size={15} />
                          <input
                            type="text"
                            required
                            value={aadharNo}
                            onChange={handleAadharChange}
                            placeholder="XXXX XXXX XXXX"
                            className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-royal focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                          />
                        </div>
                        {errors.aadharNo && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.aadharNo}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">PAN Card Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-3.5 text-royal/30" size={15} />
                          <input
                            type="text"
                            required
                            value={panNo}
                            onChange={handlePanChange}
                            placeholder="ABCDE1234F"
                            className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-royal uppercase focus:bg-white focus:border-royal focus:outline-none transition-all placeholder:text-royal/30"
                          />
                        </div>
                        {errors.panNo && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.panNo}</p>}
                      </div>
                    </div>

                    {/* Complete Address */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-royal/50 uppercase tracking-widest mb-1.5">Address <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Provide your complete residential address for official dispatch"
                        className="w-full bg-royal/[0.02] border border-royal/15 rounded-xl px-4 py-2.5 text-sm text-royal focus:bg-white focus:border-royal focus:outline-none transition-all resize-none placeholder:text-royal/30"
                      />
                      {errors.address && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.address}</p>}
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 flex justify-end gap-4 border-t border-royal/10">
                      <button
                        type="button"
                        onClick={handleCloseSuccess}
                        className="px-6 py-3 rounded-full text-xs font-bold text-royal/60 hover:text-royal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-royal hover:bg-saffron text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin" size={13} />
                            SUBMITTING...
                          </>
                        ) : (
                          <>
                            SUBMIT REGISTRATION
                            <Sparkles size={13} className="text-saffron" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
