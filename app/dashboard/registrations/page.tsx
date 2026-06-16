'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, LogOut, Loader2, Search, Calendar, User, Mail, Phone, MapPin, FileText, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Registration {
  id: string
  event_id: string
  event_title: string
  full_name: string
  aadhar_no: string
  pan_no: string
  address: string
  mobile_no: string
  email: string
  spouse_name: string
  ticket_no: string
  created_at: string
}

interface ContactRegistration {
  id: string
  full_name: string
  email: string
  organisation: string
  reason: string
  message: string
  created_at: string
}

export default function RegistrationsDashboard() {
  const [activeTab, setActiveTab] = useState<'initiatives' | 'contacts'>('initiatives')
  const [initiativeRegs, setInitiativeRegs] = useState<Registration[]>([])
  const [contactRegs, setContactRegs] = useState<ContactRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactRegistration | null>(null)
  
  const router = useRouter()

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // 1. Fetch upcoming event registrations
      const { data: initData, error: initErr } = await supabase
        .from('upcoming_registrations')
        .select('*')
        .order('created_at', { ascending: false })
      if (initErr) throw initErr
      if (initData) setInitiativeRegs(initData)

      // 2. Fetch contact form registrations
      const { data: contData, error: contErr } = await supabase
        .from('contact_registrations')
        .select('*')
        .order('created_at', { ascending: false })
      if (contErr) throw contErr
      if (contData) setContactRegs(contData)
    } catch (err) {
      console.error('Error fetching dashboard registration data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        fetchAllData()
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const deleteRegistration = async (id: string, ticketNo: string) => {
    if (confirm(`Are you sure you want to delete registration ${ticketNo}?`)) {
      try {
        const { error } = await supabase
          .from('upcoming_registrations')
          .delete()
          .eq('ticket_no', ticketNo)

        if (error) throw error

        setInitiativeRegs(prev => prev.filter(reg => reg.ticket_no !== ticketNo))
        if (selectedReg?.ticket_no === ticketNo) {
          setSelectedReg(null)
        }
      } catch (err) {
        console.error('Error deleting registration:', err)
        alert('Failed to delete registration')
      }
    }
  }

  const deleteContactRegistration = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete contact inquiry from ${name}?`)) {
      try {
        const { error } = await supabase
          .from('contact_registrations')
          .delete()
          .eq('id', id)

        if (error) throw error

        setContactRegs(prev => prev.filter(reg => reg.id !== id))
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
      } catch (err) {
        console.error('Error deleting contact inquiry:', err)
        alert('Failed to delete contact inquiry')
      }
    }
  }

  // Filter lists by search query
  const filteredInitiatives = initiativeRegs.filter(reg => {
    const term = searchTerm.toLowerCase()
    return (
      reg.full_name?.toLowerCase().includes(term) ||
      reg.email?.toLowerCase().includes(term) ||
      reg.mobile_no?.toLowerCase().includes(term) ||
      reg.ticket_no?.toLowerCase().includes(term) ||
      reg.event_title?.toLowerCase().includes(term)
    )
  })

  const filteredContacts = contactRegs.filter(reg => {
    const term = searchTerm.toLowerCase()
    return (
      reg.full_name?.toLowerCase().includes(term) ||
      reg.email?.toLowerCase().includes(term) ||
      reg.reason?.toLowerCase().includes(term) ||
      reg.organisation?.toLowerCase().includes(term) ||
      reg.message?.toLowerCase().includes(term)
    )
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
            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-2 pl-6 ml-6 border-l border-white/10">
              <Link href="/dashboard" className="text-sm font-semibold text-[#8a9bb5] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                Past Events
              </Link>
              <Link href="/dashboard/upcoming" className="text-sm font-semibold text-[#8a9bb5] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                Upcoming Events
              </Link>
              <Link href="/dashboard/registrations" className="text-sm font-semibold text-white bg-white/10 px-4 py-1.5 rounded-full transition-colors">
                Registrations
              </Link>
            </nav>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">User Registrations</h2>
            <p className="text-[#8a9bb5]">
              View, search, and manage credentials of pilgrims, summit attendees, and contact inquiries.
            </p>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => {
              setActiveTab('initiatives')
              setSearchTerm('')
            }}
            className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 border-b-2 mr-8 ${
              activeTab === 'initiatives'
                ? 'text-white border-[#335C8B]'
                : 'text-[#8a9bb5] hover:text-white border-transparent'
            }`}
          >
            Initiative Passes ({initiativeRegs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('contacts')
              setSearchTerm('')
            }}
            className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 border-b-2 ${
              activeTab === 'contacts'
                ? 'text-white border-[#335C8B]'
                : 'text-[#8a9bb5] hover:text-white border-transparent'
            }`}
          >
            Contact Inquiries ({contactRegs.length})
          </button>
        </div>

        {/* Search filter controls */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-3.5 text-white/30" size={16} />
            <input
              type="text"
              placeholder={activeTab === 'initiatives' 
                ? "Search by name, email, phone, ticket ID or initiative..."
                : "Search by name, email, organisation, reason or message..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3 text-sm text-white focus:border-[#335C8B] focus:outline-none transition-colors placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Main Split Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#8a9bb5]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading database records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Table/List View (Left Column) */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm h-fit">
              {activeTab === 'initiatives' ? (
                /* ================== INITIATIVES TABLE ================== */
                filteredInitiatives.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-[#8a9bb5]">
                    <p>No initiative registrations found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#8bb8e8]">
                          <th className="p-4 font-bold">Ticket ID</th>
                          <th className="p-4 font-bold">Attendee</th>
                          <th className="p-4 font-bold">Initiative</th>
                          <th className="p-4 font-bold">Contact</th>
                          <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredInitiatives.map((reg) => (
                          <tr 
                            key={reg.id || reg.ticket_no} 
                            onClick={() => {
                              setSelectedReg(reg)
                              setSelectedContact(null)
                            }}
                            className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                              selectedReg?.ticket_no === reg.ticket_no ? 'bg-white/5' : ''
                            }`}
                          >
                            <td className="p-4 font-mono text-xs font-bold text-saffron">
                              {reg.ticket_no}
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-sm">{reg.full_name}</p>
                              {reg.spouse_name && (
                                <p className="text-[10px] text-[#8a9bb5]">Acc: {reg.spouse_name}</p>
                              )}
                            </td>
                            <td className="p-4 text-xs font-medium max-w-[180px] truncate">
                              {reg.event_title}
                            </td>
                            <td className="p-4 text-xs text-[#8a9bb5]">
                              <p>{reg.email}</p>
                              <p className="font-mono mt-0.5">{reg.mobile_no}</p>
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => deleteRegistration(reg.id, reg.ticket_no)}
                                className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                title="Delete registration"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                /* ================== CONTACT REGISTRATIONS TABLE ================== */
                filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-[#8a9bb5]">
                    <p>No contact inquiries found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#8bb8e8]">
                          <th className="p-4 font-bold">Date</th>
                          <th className="p-4 font-bold">Full Name</th>
                          <th className="p-4 font-bold">Reason</th>
                          <th className="p-4 font-bold">Organisation</th>
                          <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredContacts.map((reg) => (
                          <tr 
                            key={reg.id} 
                            onClick={() => {
                              setSelectedContact(reg)
                              setSelectedReg(null)
                            }}
                            className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                              selectedContact?.id === reg.id ? 'bg-white/5' : ''
                            }`}
                          >
                            <td className="p-4 text-xs text-[#8a9bb5] font-mono">
                              {new Date(reg.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-sm">{reg.full_name}</p>
                              <p className="text-[10px] text-[#8a9bb5]">{reg.email}</p>
                            </td>
                            <td className="p-4 text-xs font-semibold text-saffron">
                              {reg.reason}
                            </td>
                            <td className="p-4 text-xs text-[#8a9bb5]">
                              {reg.organisation || '—'}
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => deleteContactRegistration(reg.id, reg.full_name)}
                                className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>

            {/* Detail View Pane (Right Column) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm min-h-[420px] flex flex-col">
                <AnimatePresence mode="wait">
                  {activeTab === 'initiatives' && selectedReg ? (
                    /* ================== INITIATIVE DETAIL VIEW ================== */
                    <motion.div
                      key={selectedReg.ticket_no}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="pb-4 border-b border-white/10 mb-5">
                        <span className="text-[10px] font-bold text-saffron uppercase tracking-widest block mb-1">Pass Credentials</span>
                        <h3 className="text-xl font-bold font-serif">{selectedReg.full_name}</h3>
                      </div>

                      <div className="space-y-4 flex-1 text-sm text-white/90">
                        <div>
                          <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5">Ticket ID</span>
                          <span className="font-mono text-saffron font-bold text-base">{selectedReg.ticket_no}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5">Registered Initiative</span>
                          <span className="font-semibold text-white">{selectedReg.event_title}</span>
                        </div>

                        {selectedReg.spouse_name && (
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5">Accompanying Spouse</span>
                            <span>{selectedReg.spouse_name}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><Mail size={10} /> Email</span>
                            <span className="text-xs truncate block" title={selectedReg.email}>{selectedReg.email}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><Phone size={10} /> Mobile</span>
                            <span className="text-xs font-mono">{selectedReg.mobile_no}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><FileText size={10} /> Aadhar No.</span>
                            <span className="text-xs font-mono">{selectedReg.aadhar_no}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><FileText size={10} /> PAN No.</span>
                            <span className="text-xs font-mono uppercase">{selectedReg.pan_no}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><MapPin size={10} /> Dispatch Address</span>
                          <span className="text-xs text-[#8a9bb5] leading-relaxed block whitespace-pre-wrap">{selectedReg.address}</span>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-[10px] text-[#8a9bb5] font-mono flex justify-between items-center mt-auto">
                          <span>REG DATE: {new Date(selectedReg.created_at).toLocaleDateString()}</span>
                          <span className="text-[#4CAF50] font-bold">VALID PASSPORT</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'contacts' && selectedContact ? (
                    /* ================== CONTACT DETAIL VIEW ================== */
                    <motion.div
                      key={selectedContact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="pb-4 border-b border-white/10 mb-5">
                        <span className="text-[10px] font-bold text-saffron uppercase tracking-widest block mb-1">Inquiry Detail</span>
                        <h3 className="text-xl font-bold font-serif">{selectedContact.full_name}</h3>
                      </div>

                      <div className="space-y-4 flex-1 text-sm text-white/90">
                        <div>
                          <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5 flex items-center gap-1"><Send size={10} /> Reason for Contact</span>
                          <span className="font-semibold text-saffron text-sm">{selectedContact.reason}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5"><Mail size={10} className="inline mr-1" /> Email</span>
                            <a href={`mailto:${selectedContact.email}`} className="text-xs text-[#8bb8e8] hover:underline truncate block" title={selectedContact.email}>
                              {selectedContact.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-0.5">Organisation</span>
                            <span className="text-xs truncate block" title={selectedContact.organisation || 'N/A'}>
                              {selectedContact.organisation || 'Personal / None'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex-1 flex flex-col">
                          <span className="text-[10px] text-[#8a9bb5] uppercase tracking-wider block mb-1">Message Body</span>
                          <div className="bg-[#0b1526]/50 border border-white/5 rounded-xl p-4 text-xs text-[#8a9bb5] leading-relaxed overflow-y-auto max-h-[160px] whitespace-pre-wrap flex-1">
                            {selectedContact.message}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-[10px] text-[#8a9bb5] font-mono flex justify-between items-center mt-auto">
                          <span>RECEIVED: {new Date(selectedContact.created_at).toLocaleDateString()}</span>
                          <span className="text-[#8bb8e8] font-bold">GENERAL INQUIRY</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ================== NO SELECTED CARD PLACEHOLDER ================== */
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-[#8a9bb5]">
                      <User className="opacity-20 mb-4" size={48} />
                      <p className="text-sm font-medium">
                        Select an item from the {activeTab === 'initiatives' ? 'passes' : 'inquiries'} list to view complete details.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
