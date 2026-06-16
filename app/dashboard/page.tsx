'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, X, Loader2, LayoutGrid, Eye, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'
import { clearCachedData } from '@/lib/cache'
import { SEED_DATA } from '@/data/seed-events'

interface Event {
  id: string
  title: string
  description: string
  image: string
  category: string
  created_at: string
}

const CATEGORIES = [
  'Key Cultural & Spiritual Initiatives',
  'Humanitarian & Social Impact Initiatives',
  'Education, CSR & Volunteerism',
  'Trade Facilitation Expertise'
]

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual')
  
  // Visual Editor Specific State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [customCategory, setCustomCategory] = useState('')
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [compressing, setCompressing] = useState(false)
  
  // Table View Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [tableCategoryFilter, setTableCategoryFilter] = useState('All')

  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    try {
      const baseName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const fullPath = `${baseName}.webp`
      const thumbPath = `${baseName}-thumb.webp`

      // Generate Full WebP Image
      const fullFile = await imageCompression(file, {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: 'image/webp'
      })

      // Generate Thumbnail WebP Image
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
    } catch (err) {
      console.error('Image upload error:', err)
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Failed to upload image: ${msg}`)
      setCompressing(false)
    }
  }

  const [page, setPage] = useState(0)
  const EVENTS_PER_PAGE = 10
  const [hasMore, setHasMore] = useState(true)

  const fetchEvents = async (pageNum = 0, append = false) => {
    if (!append) setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true })
      .range(pageNum * EVENTS_PER_PAGE, (pageNum + 1) * EVENTS_PER_PAGE - 1)
      
    if (data) {
      if (append) {
        setEvents(prev => [...prev, ...data])
      } else {
        setEvents(data)
      }
      setHasMore(data.length === EVENTS_PER_PAGE)
    }
    if (!append) setLoading(false)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchEvents(nextPage, true)
  }

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        fetchEvents()
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const openModal = (event?: Event, defaultCategory?: string) => {
    if (event) {
      setEditingEvent(event)
      setTitle(event.title)
      setDescription(event.description || '')
      setImage(event.image || '')
      
      if (CATEGORIES.includes(event.category)) {
        setCategory(event.category)
        setIsCustomCategory(false)
      } else {
        setCategory('custom')
        setCustomCategory(event.category)
        setIsCustomCategory(true)
      }
    } else {
      setEditingEvent(null)
      setTitle('')
      setDescription('')
      setImage('')
      setCategory(defaultCategory || CATEGORIES[0])
      setCustomCategory('')
      setIsCustomCategory(false)
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

    const finalCategory = isCustomCategory ? customCategory : category
    const payload = { 
      title, 
      description, 
      image,
      category: finalCategory
    }

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingEvent.id)

        if (error) throw error

        setEvents(prev => prev.map(evt => evt.id === editingEvent.id ? { ...evt, ...payload } : evt))
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([payload])
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          setEvents(prev => [...prev, data[0]])
        }
      }

      // Invalidate memory cache immediately on successful database save
      clearCachedData('events_page_data')

      closeModal()
    } catch (err) {
      console.error('Error saving past event:', err)
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Failed to save event: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id)

        if (error) throw error

        setEvents(prev => prev.filter(evt => evt.id !== id))
        
        // Invalidate memory cache immediately on successful database deletion
        clearCachedData('events_page_data')
      } catch (err) {
        console.error('Error deleting past event:', err)
        const msg = err instanceof Error ? err.message : String(err)
        alert(`Failed to delete event: ${msg}`)
      }
    }
  }

  const handleImportEvents = async () => {
    if (confirm('This will delete all current database events and reset them to match the original website content exactly. Do you want to continue?')) {
      setImporting(true)
      try {
        const { error: deleteError } = await supabase.from('events').delete().neq('title', '')
        if (deleteError) throw deleteError
        
        const { error: seedError } = await supabase.from('events').insert(SEED_DATA)
        if (seedError) throw seedError
        
        // Invalidate memory cache immediately on successful database import
        clearCachedData('events_page_data')

        await fetchEvents()
        alert('Events imported successfully!')
      } catch (err) {
        console.error('Error importing past events:', err)
        const msg = err instanceof Error ? err.message : String(err)
        alert(`An error occurred during import: ${msg}`)
      } finally {
        setImporting(false)
      }
    }
  }

  // Group events by category
  const groupedEvents: { [key: string]: Event[] } = {}
  events.forEach(evt => {
    const cat = evt.category || CATEGORIES[0]
    if (!groupedMapContains(cat)) {
      groupedEvents[cat] = []
    }
    groupedEvents[cat].push(evt)
  })

  function groupedMapContains(cat: string) {
    return Object.keys(groupedEvents).includes(cat)
  }

  // Dynamically aggregate all unique categories currently saved in the database
  const allCategories = Array.from(new Set([
    ...CATEGORIES,
    ...events.map(evt => evt.category).filter(Boolean)
  ]))

  // Get filtered events for Table View
  const filteredTableEvents = events.filter(evt => {
    const matchesCategory = tableCategoryFilter === 'All' || evt.category === tableCategoryFilter
    const matchesSearch = evt.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          (evt.description || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get active preview image
  const filteredEvents = events.filter(evt => evt.category === activeCategory)
  const activePreviewImage = hoveredImage || filteredEvents[0]?.image || '/images/events.webp'

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
            <nav className="hidden md:flex items-center gap-2 pl-6 ml-6 border-l border-white/10">
              <a href="/dashboard" className="text-sm font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full transition-colors">
                Past Events
              </a>
              <a href="/dashboard/upcoming" className="text-sm font-semibold text-[#8a9bb5] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                Upcoming Events
              </a>
              <a href="/dashboard/registrations" className="text-sm font-semibold text-[#8a9bb5] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                Registrations
              </a>
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
                Visual Editor
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-[#335C8B] text-white' : 'text-[#8a9bb5] hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                Table View
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-[#8a9bb5] hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Title Actions */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Events & Programs</h2>
          <p className="text-[#8a9bb5]">
            {viewMode === 'visual' 
              ? 'Hover and click directly on elements below to edit them on the live page layout.' 
              : 'Add, update, or remove database rows below.'
            }
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleImportEvents}
            disabled={importing}
            className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all"
          >
            {importing ? 'Importing...' : 'Import Website Events'}
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#335C8B] hover:bg-[#4a7ab5] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#335C8B]/20"
          >
            <Plus size={16} />
            Add New Event
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
          {/* Table Search & Filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
            {/* Search Input */}
            <div className="w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white focus:border-[#335C8B] focus:outline-none transition-colors"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="w-full sm:w-auto flex items-center gap-3">
              <span className="text-xs text-[#8a9bb5] uppercase font-bold tracking-wider whitespace-nowrap">Filter Category:</span>
              <select
                value={tableCategoryFilter}
                onChange={(e) => setTableCategoryFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white focus:border-[#335C8B] focus:outline-none transition-colors"
              >
                <option value="All" className="bg-[#0f1d30]">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0f1d30]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            {filteredTableEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#8a9bb5]">
                <p>No matching events found. Try adjusting your search/filter settings.</p>
              </div>
            ) : (
              <div className="overflow-x-auto" data-lenis-prevent>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#8bb8e8]">
                      <th className="p-5 font-bold w-[15%]">Image</th>
                      <th className="p-5 font-bold w-[25%]">Title</th>
                      <th className="p-5 font-bold w-[20%]">Category</th>
                      <th className="p-5 font-bold w-[30%]">Description</th>
                      <th className="p-5 font-bold w-auto text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTableEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-5">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-[#0f1d30]">
                            {evt.image && (
                              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                        </td>
                        <td className="p-5 font-bold text-sm">{evt.title}</td>
                        <td className="p-5">
                          <span className="inline-block bg-[#335C8B]/20 text-[#8bb8e8] border border-[#335C8B]/40 rounded-full px-3 py-1 text-xs font-semibold">
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
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#8bb8e8] px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              >
                Load More Events
              </button>
            </div>
          )}
        </main>
      ) : (
        /* ================== VISUAL LIVE PREVIEW CMS ================== */
        <main className="mt-8 border-t border-white/10 bg-[#FBFBFB] text-[#1a2d47]">
          {/* Category Filter Menu - Replicating original filter bar */}
          <div className="bg-[#FBFBFB] border-b border-[#d0dae6] sticky top-20 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-6">
                {allCategories.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setActiveCategory(catName)}
                    className={`whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 border-b-2 ${
                      activeCategory === catName
                        ? 'text-[#1a2d47] border-[#335C8B]'
                        : 'text-[#8a9bb5] hover:text-[#1a2d47] border-transparent'
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Split-Screen Live Editor Area */}
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16">
            <div className="lg:grid lg:grid-cols-12 lg:gap-24 relative">
              
              {/* LEFT: Sticky Live Image Column */}
              <div className="hidden lg:block lg:col-span-6 relative h-full">
                <div className="sticky top-40 h-[70vh] w-full overflow-hidden rounded-2xl bg-[#0b1526] shadow-2xl">
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={activePreviewImage}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
                      alt="Section Preview"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1526]/60 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* RIGHT: Dynamic CMS Editable List Column */}
              <div className="lg:col-span-6">
                <div className="mb-12">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif text-3xl lg:text-4xl font-light text-[#1a2d47] leading-tight">
                      {activeCategory}
                    </h3>
                    <button
                      onClick={() => openModal(undefined, activeCategory)}
                      className="flex items-center gap-1.5 border border-[#335C8B]/30 hover:bg-[#335C8B]/10 text-[#335C8B] px-4 py-2 rounded-full font-bold text-xs transition-all shadow-sm"
                    >
                      <Plus size={14} />
                      Add to section
                    </button>
                  </div>
                  <div className="h-0.5 bg-[#e0e7ef] w-full" />
                </div>

                <div className="space-y-4">
                  {(!groupedEvents[activeCategory] || groupedEvents[activeCategory].length === 0) ? (
                    <div className="py-16 text-center text-[#8a9bb5] border border-dashed border-[#e0e7ef] rounded-2xl">
                      <p className="font-semibold mb-3">No events in this section yet.</p>
                      <button
                        onClick={() => openModal(undefined, activeCategory)}
                        className="bg-[#335C8B] text-white font-bold text-xs py-2 px-4 rounded-full"
                      >
                        + Add First Event
                      </button>
                    </div>
                  ) : (
                    groupedEvents[activeCategory].map((item, index) => (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredImage(item.image)}
                        onMouseLeave={() => setHoveredImage(null)}
                        className="group relative p-8 border-b border-[#e0e7ef] hover:bg-[#335C8B]/5 transition-all duration-300 rounded-2xl flex flex-col cursor-default"
                      >
                        {/* Interactive Edit Overlay HUD */}
                        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={() => openModal(item)}
                            className="flex items-center gap-1.5 bg-[#335C8B] text-white hover:bg-[#4a7ab5] px-3.5 py-1.5 rounded-full font-bold text-xs transition-colors shadow-lg shadow-[#335C8B]/20"
                            title="Edit Event Content"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(item.id)}
                            className="bg-red-500 text-white hover:bg-red-600 p-1.5 rounded-full transition-colors shadow-lg"
                            title="Delete Event"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Number indicator */}
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#335C8B] uppercase opacity-60 mb-2">
                          No. {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Title */}
                        <h4 className="font-serif text-xl lg:text-2xl text-[#1a2d47] font-semibold leading-snug mb-3 group-hover:text-[#335C8B] transition-colors pr-16 break-words">
                          {item.title}
                        </h4>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-[#5a7394] font-light break-words">
                          {item.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
              className="relative w-full max-w-lg bg-[#0f1d30] border border-white/10 rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto text-white scrollbar-thin scrollbar-thumb-white/10"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-[#8a9bb5] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-serif font-bold text-white mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>

              <form onSubmit={saveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      setIsCustomCategory(e.target.value === 'custom')
                    }}
                    className="w-full bg-[#0b1526]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0f1d30]">
                        {cat}
                      </option>
                    ))}
                    <option value="custom" className="bg-[#0f1d30]">-- Custom Category --</option>
                  </select>
                </div>

                {isCustomCategory && (
                  <div>
                    <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Custom Category Name</label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Special Events"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">
                    Image (Auto-Compresses Client-Side)
                  </label>
                  {compressing ? (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5 text-[#8bb8e8] text-xs">
                      <Loader2 className="animate-spin mb-2" size={20} />
                      <p>Compressing & Optimizing Image...</p>
                    </div>
                  ) : image ? (
                    <div className="relative border border-white/10 rounded-xl bg-white/5 p-3 flex flex-row items-center justify-between gap-3 min-w-0 w-full overflow-hidden">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#0f1d30] flex-shrink-0">
                          <img src={image} className="w-full h-full object-cover" alt="Upload Preview" />
                        </div>
                        <span className="text-xs text-[#8a9bb5] truncate min-w-0 flex-1">
                          Image uploaded successfully!
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex-shrink-0 ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5 cursor-pointer hover:bg-white/[0.07] transition-all text-[#8a9bb5] hover:text-white">
                      <Upload size={20} className="mb-2" />
                      <span className="text-xs font-semibold">Click to select image</span>
                      <span className="text-[10px] opacity-60 mt-1">Automatically optimized & compressed</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {/* Optional Fallback Text Input */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Or paste direct image URL here..."
                      value={image.startsWith('data:') ? '' : image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-[#8a9bb5] focus:border-[#335C8B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#8bb8e8] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#335C8B] focus:outline-none transition-colors resize-none"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-[#8a9bb5] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#335C8B] hover:bg-[#4a7ab5] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Event'}
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
