'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, X, Loader2, LayoutGrid, Eye, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

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
  created_at: string
}

const CATEGORIES = [
  'Cultural Walk',
  'Pilgrimage Tour',
  'Global Summit',
  'Exhibition',
  'Community Event'
]

const ORIGINAL_UPCOMING_EVENTS = [
  {
    date: 'Jun 15, 2025',
    day: '15',
    month: 'JUN',
    title: 'Heritage Walk & Cultural Marathon',
    subtitle: 'Hyderabad Heritage Circuit',
    description: 'A 5 km heritage trail through the walled city of Hyderabad — past Charminar, Laad Bazaar, and Salar Jung. Live classical performances at each landmark.',
    category: 'Cultural Walk',
    color: '#c8a96e',
    seats: '400 spots left',
    image: null
  },
  {
    date: 'Jul 08, 2025',
    day: '08',
    month: 'JUL',
    title: 'Sacred India Pilgrimage Yatra',
    subtitle: 'Tirupati · Varanasi · Ayodhya',
    description: "A 12-day guided spiritual journey across India's most sacred dhams.Experience Ganga Aarti, temple darshan, and satsang sessions led by revered seers.",
    category: 'Pilgrimage Tour',
    color: '#335C8B',
    seats: '60 spots left',
    image: null
  },
  {
    date: 'Aug 22, 2025',
    day: '22',
    month: 'AUG',
    title: 'International Cultural Exchange Forum',
    subtitle: 'New Delhi — India Habitat Centre',
    description: 'A 2-day summit bringing together cultural attachés, artists, and diplomats from 20+ nations to foster bilateral cultural cooperation and people-to-people ties.',
    category: 'Global Summit',
    color: '#4a6fa5',
    seats: 'Registration open',
    image: null
  }
]

export default function UpcomingEventsDashboard() {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<UpcomingEvent | null>(null)
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual')
  
  // Visual Editor Specific State
  const [activeIdx, setActiveIdx] = useState(0)
  
  // Form State
  const [date, setDate] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [color, setColor] = useState('#c8a96e')
  const [seats, setSeats] = useState('')
  const [image, setImage] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [syncing, setSyncing] = useState(false)
  
  // Table View Filter State
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    try {
      const baseName = `upcoming-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const fullPath = `${baseName}.webp`
      const thumbPath = `${baseName}-thumb.webp`

      // Full WebP Image
      const fullFile = await imageCompression(file, {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: 'image/webp'
      })

      // Thumbnail WebP Image
      const thumbFile = await imageCompression(file, {
        maxSizeMB: 0.04,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        initialQuality: 0.6,
        fileType: 'image/webp'
      })

      const uploadOpts = {
        cacheControl: 'public, max-age=31536000, immutable',
        contentType: 'image/webp',
        upsert: true
      }

      await supabase.storage.from('event-images').upload(fullPath, fullFile, uploadOpts)
      await supabase.storage.from('event-images').upload(thumbPath, thumbFile, uploadOpts)

      const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fullPath)
      setImage(publicUrl)
      setCompressing(false)
    } catch (err: any) {
      console.error('Image upload error:', err)
      alert(`Failed to upload image: ${err.message || err}`)
      setCompressing(false)
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const openModal = (event?: UpcomingEvent) => {
    if (!event && events.length >= 4) {
      alert("Maximum 4 upcoming events allowed. Please delete an existing event to add a new one.")
      return
    }

    if (event) {
      setEditingEvent(event)
      setDate(event.date || '')
      setDay(event.day || '')
      setMonth(event.month || '')
      setTitle(event.title || '')
      setSubtitle(event.subtitle || '')
      setDescription(event.description || '')
      setCategory(event.category || CATEGORIES[0])
      setColor(event.color || '#c8a96e')
      setSeats(event.seats || '')
      setImage(event.image || '')
    } else {
      setEditingEvent(null)
      setDate('')
      setDay('')
      setMonth('')
      setTitle('')
      setSubtitle('')
      setDescription('')
      setCategory(CATEGORIES[0])
      setColor('#c8a96e')
      setSeats('')
      setImage('')
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = { 
      date, day, month, title, subtitle, description, category, color, seats, image
    }

    if (editingEvent) {
      await supabase.from('upcoming_events').update(payload).eq('id', editingEvent.id)
      setEvents(prev => prev.map(evt => evt.id === editingEvent.id ? { ...evt, ...payload } : evt))
    } else {
      if (events.length >= 4) {
        alert("Maximum 4 upcoming events allowed.")
        setSaving(false)
        return
      }
      const { data } = await supabase.from('upcoming_events').insert([payload]).select().single()
      if (data) setEvents(prev => [...prev, data])
    }

    setSaving(false)
    closeModal()
  }

  const deleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await supabase.from('upcoming_events').delete().eq('id', id)
      setEvents(prev => prev.filter(evt => evt.id !== id))
      setActiveIdx(0)
    }
  }

  const handleSync = async () => {
    if (confirm('This will delete all current upcoming events and reset them to the original default events. Continue?')) {
      setSyncing(true)
      try {
        const { error: delError } = await supabase
          .from('upcoming_events')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all safely

        if (delError) {
          alert('Failed to clear existing events. Make sure table exists.')
          setSyncing(false)
          return
        }

        const { error: insertError } = await supabase
          .from('upcoming_events')
          .insert(ORIGINAL_UPCOMING_EVENTS)

        if (insertError) {
          alert('Failed to insert original events.')
          console.error(insertError)
        } else {
          await fetchEvents()
          alert('Original events synced successfully!')
        }
      } catch (err) {
        alert('An error occurred during sync.')
      } finally {
        setSyncing(false)
      }
    }
  }

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Get filtered events for Table View
  const filteredTableEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          (evt.description || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0b1526] text-white selection:bg-[#335C8B]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/images/recon-logo.webp" alt="Logo" width={40} height={40} />
              <div>
                <h1 className="font-bold text-sm uppercase tracking-widest text-white">Recon Admin</h1>
                <p className="text-[10px] text-[#8bb8e8] uppercase tracking-wider">Visual CMS Editor</p>
              </div>
            </div>
            {/* Top Navigation */}
            <nav className="hidden md:flex items-center gap-2 pl-6 ml-6 border-l border-white/10">
              <Link href="/dashboard" className="text-sm font-semibold text-[#8a9bb5] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                Past Events
              </Link>
              <Link href="/dashboard/upcoming" className="text-sm font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full transition-colors">
                Upcoming Events
              </Link>
            </nav>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'visual' ? 'bg-[#335C8B] text-white' : 'text-[#8a9bb5] hover:text-white'
                }`}
              >
                <Eye size={14} />
                Visual
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-[#335C8B] text-white' : 'text-[#8a9bb5] hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                Table
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-[#8a9bb5] hover:text-white transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Title Actions */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Upcoming Events (Max 4)</h2>
          <p className="text-[#8a9bb5]">
            {viewMode === 'visual' 
              ? 'Preview how the popup will look. Hover cards to edit.' 
              : 'Add, update, or remove database rows below.'
            }
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all"
          >
            {syncing ? 'Syncing...' : 'Sync Original Events'}
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#335C8B] hover:bg-[#4a7ab5] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#335C8B]/20"
          >
            <Plus size={16} />
            Add Upcoming Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-[#8a9bb5]">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Loading Events CMS...</p>
        </div>
      ) : viewMode === 'table' ? (
        /* ================== TABLE VIEW ================== */
        <main className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
            <div className="w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white focus:border-[#335C8B] focus:outline-none transition-colors"
              />
            </div>
            <div className="text-[#8a9bb5] text-sm">
              {events.length} / 4 Events Used
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            {filteredTableEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#8a9bb5]">
                <p>No matching events found. Add a new event to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto" data-lenis-prevent>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#8bb8e8]">
                      <th className="p-5 font-bold w-[15%]">Image</th>
                      <th className="p-5 font-bold w-[25%]">Title</th>
                      <th className="p-5 font-bold w-[15%]">Date</th>
                      <th className="p-5 font-bold w-[15%]">Category</th>
                      <th className="p-5 font-bold w-[20%]">Description</th>
                      <th className="p-5 font-bold w-auto text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTableEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-5">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-[#0f1d30]">
                            {evt.image ? (
                              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-[#8a9bb5]">No Image</div>
                            )}
                          </div>
                        </td>
                        <td className="p-5 font-bold text-sm">{evt.title}</td>
                        <td className="p-5 text-sm text-[#8a9bb5]">{evt.date}</td>
                        <td className="p-5">
                          <span className="inline-flex items-center gap-2 bg-[#335C8B]/20 text-[#8bb8e8] border border-[#335C8B]/40 rounded-full px-3 py-1 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: evt.color }}></span>
                            {evt.category}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-[#8a9bb5] max-w-xs truncate">{evt.description}</td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openModal(evt)}
                              className="p-2 text-[#8bb8e8] hover:bg-[#335C8B]/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteEvent(evt.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      ) : (
        /* ================== VISUAL LIVE PREVIEW CMS ================== */
        <main className="mt-8 border-t border-white/10 bg-[#e0e7ef] text-[#1a2d47] min-h-[70vh] p-12 flex justify-center items-start">
          <div className="w-full max-w-2xl bg-[#FBFBFB] rounded-[2rem] overflow-hidden shadow-2xl relative">
            {events.length === 0 ? (
              <div className="p-16 text-center text-[#8a9bb5]">
                <p>No upcoming events created.</p>
                <button onClick={() => openModal()} className="mt-4 bg-[#335C8B] text-white px-6 py-2 rounded-full text-sm font-bold">Create Event</button>
              </div>
            ) : (
              <>
                {/* ── Header ── */}
                <div
                  className="relative px-8 pt-8 pb-6 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #0f1e38 0%, #1a2d47 60%, #243d60 100%)' }}
                >
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.18) 0%, transparent 70%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.4), transparent)' }} />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: 'rgba(200,169,110,0.8)' }}>
                        ✦ Recon International
                      </p>
                      <h2 className="font-serif text-2xl font-light text-white leading-snug">
                        Upcoming <span className="italic text-[#c8a96e]">Events</span>
                      </h2>
                    </div>
                  </div>
                  {/* Tab indicators */}
                  <div className="flex gap-2 mt-5">
                    {events.map((ev, i) => (
                      <button
                        key={ev.id}
                        onClick={() => setActiveIdx(i)}
                        className="h-1 rounded-full transition-all duration-400 flex-1"
                        style={{ background: i === activeIdx ? '#c8a96e' : 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Event Cards ── */}
                <div className="p-8 relative group">
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(events[activeIdx])} className="bg-[#335C8B] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"><Pencil size={12} /> Edit</button>
                    <button onClick={() => deleteEvent(events[activeIdx].id)} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"><Trash2 size={12} /> Delete</button>
                  </div>
                  
                  {events[activeIdx] && (
                    <div className="relative">
                      {events[activeIdx].image && (
                        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 shadow-md border border-[#e0e7ef]">
                          <img src={events[activeIdx].image} alt="Event Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                          style={{ background: `${events[activeIdx].color}18`, border: `1.5px solid ${events[activeIdx].color}30` }}>
                          <span className="text-xl font-bold leading-none" style={{ color: events[activeIdx].color }}>{events[activeIdx].day}</span>
                          <span className="text-[9px] font-bold tracking-widest" style={{ color: events[activeIdx].color }}>{events[activeIdx].month}</span>
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                            style={{ background: `${events[activeIdx].color}15`, color: events[activeIdx].color }}
                          >
                            {events[activeIdx].category}
                          </span>
                          <p className="mt-1 text-[11px] text-[#8a9bb5] tracking-wide">{events[activeIdx].date}</p>
                        </div>
                      </div>
                       <h3 className="font-serif text-xl font-semibold text-[#1a2d47] leading-snug mb-1 break-words">
                        {events[activeIdx].title}
                      </h3>
                      <p className="text-xs font-medium text-[#335C8B] mb-3 tracking-wide">
                        📍 {events[activeIdx].subtitle}
                      </p>
                      <p className="text-sm text-[#5a7394] leading-relaxed mb-5 break-words">
                        {events[activeIdx].description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#c8a96e] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse inline-block" />
                          {events[activeIdx].seats}
                        </span>
                        <div
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all"
                          style={{ background: `linear-gradient(135deg, #1a2d47, #335C8B)` }}
                        >
                          View Details
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation arrows */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#e8eef5]">
                    <button
                      onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
                      disabled={activeIdx === 0}
                      className="w-9 h-9 rounded-full border border-[#d0dae6] flex items-center justify-center text-[#5a7394] transition-all disabled:opacity-30 hover:border-[#335C8B]"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <p className="text-[11px] text-[#8a9bb5]">
                      {activeIdx + 1} <span className="mx-1 opacity-40">/</span> {events.length}
                    </p>
                    <button
                      onClick={() => setActiveIdx((p) => Math.min(events.length - 1, p + 1))}
                      disabled={activeIdx === events.length - 1}
                      className="w-9 h-9 rounded-full border border-[#d0dae6] flex items-center justify-center text-[#5a7394] transition-all disabled:opacity-30 hover:border-[#335C8B]"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#0b1526]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              data-lenis-prevent
              className="relative w-full max-w-2xl bg-[#0f1d30] border border-white/10 rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto text-white scrollbar-thin scrollbar-thumb-white/10"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-[#8a9bb5] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-serif font-bold text-white mb-6">
                {editingEvent ? 'Edit Upcoming Event' : 'Add Upcoming Event'}
              </h3>

              <form onSubmit={saveEvent} className="space-y-6">
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Date String</label>
                    <input type="text" required value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Jun 15, 2025" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Day (Number)</label>
                    <input type="text" required value={day} onChange={(e) => setDay(e.target.value)} placeholder="e.g. 15" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Month (Short)</label>
                    <input type="text" required value={month} onChange={(e) => setMonth(e.target.value)} placeholder="e.g. JUN" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none uppercase" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Subtitle (Location)</label>
                    <input type="text" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Category</label>
                    <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Cultural Walk" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Theme Color (Hex)</label>
                    <div className="flex gap-2">
                      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-10 bg-transparent border-0 cursor-pointer p-0" />
                      <input type="text" required value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Seats Status</label>
                    <input type="text" required value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="e.g. 400 spots left" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">
                    Banner Image (Auto-Compresses)
                  </label>
                  {compressing ? (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5 text-[#8bb8e8] text-xs">
                      <Loader2 className="animate-spin mb-2" size={20} />
                      <p>Compressing & Optimizing Image...</p>
                    </div>
                  ) : image ? (
                    <div className="relative border border-white/10 rounded-xl bg-white/5 p-3 flex flex-row items-center justify-between gap-3 min-w-0 w-full overflow-hidden">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative w-24 h-12 rounded-lg overflow-hidden bg-[#0f1d30] flex-shrink-0">
                          <img src={image} className="w-full h-full object-cover" alt="Upload Preview" />
                        </div>
                        <span className="text-xs text-[#8a9bb5] truncate min-w-0 flex-1">
                          Image uploaded successfully!
                        </span>
                      </div>
                      <button type="button" onClick={() => setImage('')} className="text-xs font-bold text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5 cursor-pointer hover:bg-white/[0.07] text-[#8a9bb5] hover:text-white">
                      <Upload size={20} className="mb-2" />
                      <span className="text-xs font-semibold">Click to select banner image</span>
                      <span className="text-[10px] opacity-60 mt-1">Recommended size: 800x400px</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none resize-none"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-full text-sm font-bold text-[#8a9bb5] hover:text-white">Cancel</button>
                  <button type="submit" disabled={saving} className="bg-[#335C8B] hover:bg-[#4a7ab5] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Upcoming Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
