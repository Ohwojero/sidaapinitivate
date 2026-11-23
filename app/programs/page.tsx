'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ImageIcon,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import {
  ProgramActivity,
  getStoredPrograms,
  fetchStoredPrograms
} from '@/lib/data/programs-data'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramActivity[]>([])
  const [tabFilter, setTabFilter] = useState<'all' | 'past' | 'upcoming'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProgram, setSelectedProgram] = useState<ProgramActivity | null>(null)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

  useEffect(() => {
    setPrograms(getStoredPrograms())
    fetchStoredPrograms().then(setPrograms)
    const handleUpdate = () => {
      setPrograms(getStoredPrograms())
    }
    window.addEventListener('sidaap_programs_updated', handleUpdate)
    return () => window.removeEventListener('sidaap_programs_updated', handleUpdate)
  }, [])

  // All distinct categories
  const categories = Array.from(new Set(programs.map((p) => p.category)))

  // Filtered programs
  const filtered = programs.filter((p) => {
    const matchesTab =
      tabFilter === 'all'
        ? true
        : tabFilter === 'past'
        ? p.status === 'past'
        : p.status === 'upcoming' || p.status === 'ongoing'

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesCategory && matchesSearch
  })

  const pastCount = programs.filter((p) => p.status === 'past').length
  const upcomingCount = programs.filter((p) => p.status === 'upcoming' || p.status === 'ongoing').length

  return (
    <div className="bg-[#f7f5f0] min-h-screen text-[#13231f] font-sans">
      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-16 sm:py-24 px-6 lg:px-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(#c9ec63_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-3">
            <span className="h-1.5 w-6 bg-[#c9ec63] rounded-full" />
            Direct Field Impact &bull; 36 States + FCT
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Programs &amp; Activities
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#b6c4b9] leading-relaxed">
            Browse through our past completed outreaches and upcoming programs across secondary schools, youth athletic academies, market rallies, and rehabilitation centers across Nigeria.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs text-[#c9ec63] border border-white/10 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {pastCount} Completed Past Activities
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs text-amber-300 border border-white/10 font-mono">
              <Clock className="h-3.5 w-3.5" />
              {upcomingCount} Upcoming / Scheduled Programs
            </span>
          </div>
        </div>
      </section>

      {/* ── FILTER & CONTROLS ── */}
      <section className="z-30 border-b border-stone-200 bg-[#f7f5f0]/95 px-4 py-3 shadow-sm sm:px-6 sm:py-4 md:sticky md:top-0 lg:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 lg:flex lg:items-center lg:justify-between lg:gap-4">
          {/* Timing Filter Tabs */}
          <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-stone-200/70 p-1 sm:gap-1.5 sm:p-1.5 lg:w-auto lg:shrink-0 lg:gap-2">
            <button
              onClick={() => setTabFilter('all')}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:flex-row sm:gap-1.5 sm:px-2 sm:text-xs md:px-4 md:tracking-wider ${
                tabFilter === 'all'
                  ? 'bg-[#13231f] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-center">All Activities</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{programs.length}</span>
            </button>
            <button
              onClick={() => setTabFilter('past')}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:flex-row sm:gap-1.5 sm:px-2 sm:text-xs md:px-4 md:tracking-wider ${
                tabFilter === 'past'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-center">Past Programs</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{pastCount}</span>
            </button>
            <button
              onClick={() => setTabFilter('upcoming')}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:flex-row sm:gap-1.5 sm:px-2 sm:text-xs md:px-4 md:tracking-wider ${
                tabFilter === 'upcoming'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-center">Upcoming Programs</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{upcomingCount}</span>
            </button>
          </div>

          {/* Search Box & Category Filter */}
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,180px)] lg:w-auto lg:min-w-[460px] lg:grid-cols-[minmax(0,1fr)_150px]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search programs, state, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-stone-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#13231f]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#13231f]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── PROGRAM CARDS FEED ── */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-12">
        {filtered.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <CalendarDays className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No programs found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No activities match your current filter. Try selecting &quot;All Activities&quot; or clearing your search query.
            </p>
            <button
              onClick={() => {
                setTabFilter('all')
                setCategoryFilter('all')
                setSearchQuery('')
              }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13231f] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => {
              const isPast = item.status === 'past'
              return (
                <article
                  key={item.id}
                  onClick={() => {
                    setSelectedProgram(item)
                    setActiveGalleryIndex(0)
                  }}
                  className="rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative h-56 w-full bg-stone-900 overflow-hidden">
                    {item.mainImage ? (
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">No program photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Timing Status Pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                          isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-stone-950 font-black'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <span>{isPast ? 'Past Activity' : 'Upcoming Program'}</span>
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border border-white/20">
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        <MapPin className="h-3 w-3 text-[#c9ec63]" />
                        {item.state}
                      </span>
                      <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        📅 {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 text-[11px] text-stone-400 font-mono flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Highlights bullet preview */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="pt-3 border-t border-stone-100">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                          Key Achievements:
                        </span>
                        <ul className="text-xs text-stone-700 space-y-1">
                          {item.highlights.slice(0, 2).map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 truncate">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span className="truncate">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span>View Photos &amp; Full Story</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ── DETAIL MODAL WITH PHOTO GALLERY ── */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col text-[#13231f]">
            {/* Modal Header */}
            <div className="p-5 bg-[#13231f] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    selectedProgram.status === 'past'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-stone-900'
                  }`}
                >
                  {selectedProgram.status === 'past' ? 'Past Activity (Completed)' : 'Upcoming / Ongoing Program'}
                </span>
                <span className="text-xs text-[#a9b9a8]">•</span>
                <span className="text-xs text-[#c9ec63] font-mono">{selectedProgram.category}</span>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Photo Display */}
              <div>
                {(() => {
                  const allPhotos = [
                    selectedProgram.mainImage,
                    ...(selectedProgram.galleryImages || [])
                  ].filter(Boolean)

                  const activePhoto = allPhotos[activeGalleryIndex] || selectedProgram.mainImage

                  return (
                    <div className="space-y-3">
                      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                        {activePhoto ? (
                          <img
                            src={activePhoto}
                            alt={selectedProgram.title}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 text-white/60">
                            <ImageIcon className="h-10 w-10" />
                            <span className="text-sm">No program photos uploaded</span>
                          </div>
                        )}
                      </div>

                      {allPhotos.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {allPhotos.map((photo, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveGalleryIndex(i)}
                              className={`relative h-16 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                                activeGalleryIndex === i
                                  ? 'border-emerald-600 scale-105 shadow'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={photo} alt="" className="h-full w-full object-cover object-top" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Title & Meta */}
              <div className="space-y-2 border-b border-stone-200 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {selectedProgram.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 font-mono">
                  <span>📅 Date: <strong className="text-stone-800">{selectedProgram.date}</strong></span>
                  <span>📍 State: <strong className="text-stone-800">{selectedProgram.state}</strong></span>
                  <span>🏛️ Venue: <strong className="text-stone-800">{selectedProgram.location}</strong></span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                  Story &amp; Overview
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Highlights */}
              {selectedProgram.highlights && selectedProgram.highlights.length > 0 && (
                <div className="rounded-2xl bg-[#f7f5f0] p-4 border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                    Impact &amp; Key Highlights
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-stone-800">
                    {selectedProgram.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProgram.organizer && (
                <div className="text-xs text-stone-500 font-mono">
                  Organized by: <span className="font-bold text-stone-800">{selectedProgram.organizer}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-stone-500 font-mono">
                SIDAAP Nigeria &bull; CAC RN: 8390984
              </span>
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-2 rounded-xl bg-[#13231f] text-white text-xs font-bold hover:bg-stone-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
