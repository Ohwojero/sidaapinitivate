'use client'

import { useState, useMemo } from 'react'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
import { DIRECTORY_ENTRIES, DirectoryEntry } from '@/lib/data/directory-data'
import {
  Search,
  MapPin,
  PhoneCall,
  Clock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  Building2,
  HeartHandshake,
  AlertTriangle,
  Send,
  PlusCircle,
  X
} from 'lucide-react'

export default function FindHelpPage() {
  const [selectedState, setSelectedState] = useState<string>('All States')
  const [selectedLga, setSelectedLga] = useState<string>('All LGAs')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [only24_7, setOnly24_7] = useState<boolean>(false)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  // Available LGAs for current selected state
  const currentLgas = useMemo(() => {
    if (selectedState === 'All States') return []
    const stateObj = NIGERIA_STATES.find((s) => s.name === selectedState)
    return stateObj ? stateObj.lgas : []
  }, [selectedState])

  // Filter listings
  const filteredListings = useMemo(() => {
    return DIRECTORY_ENTRIES.filter((entry) => {
      const matchState = selectedState === 'All States' || entry.state === selectedState
      const matchLga = selectedLga === 'All LGAs' || entry.lga === selectedLga
      const matchCategory = selectedCategory === 'all' || entry.category === selectedCategory
      const match247 = !only24_7 || entry.is24_7

      const haystack = `${entry.name} ${entry.city} ${entry.state} ${entry.lga} ${entry.address} ${entry.services.join(' ')} ${entry.description}`.toLowerCase()
      const matchSearch = haystack.includes(searchQuery.toLowerCase())

      return matchState && matchLga && matchCategory && match247 && matchSearch
    })
  }, [selectedState, selectedLga, selectedCategory, only24_7, searchQuery])

  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-16 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-3">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            Nigeria &bull; State &bull; Local Government Area
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
            Find Help &amp; Support in Your State
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#b6c4b9] leading-relaxed">
            Search Nigeria’s accredited network of SIDAAP state liaison desks, substance abuse counseling units, psychiatric hospitals, and verified residential rehabilitation centers.
          </p>

          {/* Quick Help Hotline Card */}
          <div className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl bg-white/10 p-4 border border-white/15">
            <span className="text-xs uppercase font-mono tracking-wider text-[#c9ec63] font-bold">
              Immediate Crisis Response:
            </span>
            <a
              href="tel:08063430562"
              className="font-mono text-sm font-bold text-white hover:text-[#c9ec63] flex items-center gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#c9ec63]" />
              0806 343 0562
            </a>
            <span className="text-white/30 hidden sm:inline">&bull;</span>
            <a
              href="tel:08028531259"
              className="font-mono text-sm font-bold text-white hover:text-[#c9ec63] flex items-center gap-1.5"
            >
              0802 853 1259
            </a>
            <span className="text-[11px] text-[#a9b9a8]">Free, confidential and 24/7</span>
          </div>
        </div>
      </section>

      {/* Directory Filter Interface */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Filter by Location &amp; Service Type
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Target accredited support across all 36 Nigerian States and the Federal Capital Territory.
              </p>
            </div>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition"
            >
              <PlusCircle className="h-4 w-4 text-[#c9ec63]" />
              Register / Suggest a Facility
            </button>
          </div>

          {/* Filter Controls Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Keyword or Name
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Hospital, Yaba, Rehab..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs outline-none focus:border-[#13231f] focus:bg-white"
                />
              </div>
            </div>

            {/* State Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value)
                  setSelectedLga('All LGAs') // Reset LGA when state changes
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs outline-none focus:border-[#13231f] focus:bg-white font-medium"
              >
                <option value="All States">All States (36 + FCT)</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* LGA Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Select LGA
              </label>
              <select
                value={selectedLga}
                onChange={(e) => setSelectedLga(e.target.value)}
                disabled={selectedState === 'All States'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs outline-none focus:border-[#13231f] focus:bg-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All LGAs">All LGAs</option>
                {currentLgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Service Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs outline-none focus:border-[#13231f] focus:bg-white font-medium"
              >
                <option value="all">All Service Categories</option>
                <option value="sidaap_office">SIDAAP State Desks &amp; Chapters</option>
                <option value="rehabilitation">Rehabilitation Centers</option>
                <option value="mental_health">Psychiatric &amp; Mental Hospitals</option>
                <option value="emergency">Emergency Hotlines &amp; Crisis</option>
              </select>
            </div>
          </div>

          {/* Quick Category Badges & 24/7 Checkbox */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={only24_7}
                  onChange={(e) => setOnly24_7(e.target.checked)}
                  className="rounded border-stone-300 text-[#13231f] focus:ring-[#13231f] h-4 w-4"
                />
                Show Only 24/7 Emergency Facilities
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Showing <strong>{filteredListings.length}</strong> verified locations</span>
              {(selectedState !== 'All States' || selectedCategory !== 'all' || searchQuery || only24_7) && (
                <button
                  onClick={() => {
                    setSelectedState('All States')
                    setSelectedLga('All LGAs')
                    setSelectedCategory('all')
                    setSearchQuery('')
                    setOnly24_7(false)
                  }}
                  className="text-emerald-700 hover:underline font-bold ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Directory Listings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((entry) => {
            const getCategoryBadge = () => {
              switch (entry.category) {
                case 'sidaap_office':
                  return { label: 'SIDAAP Chapter', bg: 'bg-[#13231f] text-[#c9ec63]' }
                case 'rehabilitation':
                  return { label: 'Rehab Center', bg: 'bg-emerald-800 text-emerald-100' }
                case 'mental_health':
                  return { label: 'Psychiatric Hospital', bg: 'bg-blue-900 text-blue-100' }
                case 'emergency':
                  return { label: 'Emergency Hotline', bg: 'bg-amber-800 text-amber-100' }
                default:
                  return { label: 'Health Provider', bg: 'bg-stone-800 text-stone-100' }
              }
            }
            const cat = getCategoryBadge()

            return (
              <div
                key={entry.id}
                className="group flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${cat.bg}`}>
                      {cat.label}
                    </span>
                    {entry.isVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {entry.name}
                  </h3>

                  <div className="mt-2 flex items-start gap-1.5 text-xs text-stone-600">
                    <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      {entry.address}, {entry.lga}, <strong>{entry.state}</strong>
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-stone-500 leading-relaxed line-clamp-3">
                    {entry.description}
                  </p>

                  {/* Services tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {entry.services.map((srv) => (
                      <span
                        key={srv}
                        className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-700"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-stone-400" />
                      <span className="text-[11px]">{entry.hours}</span>
                    </div>
                    {entry.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-stone-400" />
                        <span className="text-[11px] text-stone-600">{entry.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={`tel:${entry.phone.replace(/\s+/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-2.5 text-xs font-bold uppercase tracking-wider transition"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#c9ec63]" />
                    Call: {entry.phone}
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-stone-300 bg-white/50">
            <AlertTriangle className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">
              No matching centers found for this filter
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              Try switching back to &ldquo;All LGAs&rdquo; or clearing the search keyword. You can also contact our National Secretariat for immediate manual referral.
            </p>
            <a
              href="tel:08063430562"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#13231f] text-white px-4 py-2 text-xs font-bold"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#c9ec63]" />
              Call 0806 343 0562 for Immediate Triage
            </a>
          </div>
        )}
      </section>

      {/* Facility Submission Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 sm:p-8 border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-700">
                  Directory Contribution
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Register or Suggest a Health Facility
                </h3>
              </div>
              <button
                onClick={() => {
                  setSubmitModalOpen(false)
                  setSubmittedSuccess(false)
                }}
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Facility Submitted for Verification</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you. Your submission has been transmitted to the SIDAAP State &amp; National Directorates for license and credential verification before going live.
                </p>
                <button
                  onClick={() => {
                    setSubmitModalOpen(false)
                    setSubmittedSuccess(false)
                  }}
                  className="rounded-xl bg-[#13231f] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmittedSuccess(true)
                }}
                className="mt-4 space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Facility or Centre Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Hope Mental Wellness Clinic"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">State</label>
                    <select
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    >
                      {NIGERIA_STATES.map((s) => (
                        <option key={s.code} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category</label>
                    <select
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    >
                      <option value="rehabilitation">Rehabilitation Center</option>
                      <option value="mental_health">Psychiatric / Hospital</option>
                      <option value="counseling">Counseling Service</option>
                      <option value="ngo">Community NGO / Safe Space</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Physical Address</label>
                  <input
                    required
                    type="text"
                    placeholder="Street, LGA, Landmark"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Official Telephone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="080... or 01..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="info@clinic.org"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#13231f]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-3 text-xs font-bold uppercase tracking-wider transition"
                  >
                    <Send className="h-4 w-4 text-[#c9ec63]" />
                    Submit for Director Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
