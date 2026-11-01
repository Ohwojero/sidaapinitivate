'use client'

import { useState } from 'react'
import {
  CREDENTIAL_DOCUMENTS,
  CredentialDocument
} from '@/lib/data/credentials-data'
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building2,
  Scale,
  ExternalLink,
  X,
  Search,
  Filter
} from 'lucide-react'

export default function CredentialsPage() {
  const [selectedDoc, setSelectedDoc] = useState<CredentialDocument | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'incorporation' | 'trademark' | 'compliance' | 'subsidiary'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocs = CREDENTIAL_DOCUMENTS.filter((doc) => {
    const matchesCategory = activeFilter === 'all' || doc.category === activeFilter
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuingBody.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-[#f5f1e9] min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-[#13231f] text-[#f5f1e9] py-20 px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(201,236,99,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.15)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#c9ec63]/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c9ec63] mb-4">
            <span className="h-1.5 w-8 bg-[#c9ec63]" />
            Official Legal Transparency & Verification
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl">
            Our Statutory Credentials &amp; Registrations
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#b6c4b9] leading-relaxed">
            Smart Initiative for Drug Abuse Awareness and Prevention (SIDAAP) operates under full statutory compliance with Nigerian federal laws, registered under the Corporate Affairs Commission, SCUML anti-money laundering regulations, and federal trademark protections.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div>
              <span className="font-mono text-2xl font-black text-[#c9ec63]">RN 8390984</span>
              <p className="text-xs text-[#a9b9a8] uppercase tracking-wider mt-1">CAC Incorporation</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-black text-[#c9ec63]">SC 151423666</span>
              <p className="text-xs text-[#a9b9a8] uppercase tracking-wider mt-1">SCUML / EFCC Certified</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-black text-[#c9ec63]">Class 41</span>
              <p className="text-xs text-[#a9b9a8] uppercase tracking-wider mt-1">Registered Trademark</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-black text-[#c9ec63]">RC 9864105</span>
              <p className="text-xs text-[#a9b9a8] uppercase tracking-wider mt-1">Football Academy Ltd</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Verification Disclaimer Banner */}
        <div className="mb-10 rounded-2xl border border-amber-600/30 bg-amber-500/10 p-5 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-800">
            <Scale className="h-5 w-5" />
          </div>
          <div className="text-xs leading-relaxed text-stone-800">
            <span className="font-bold text-stone-900 uppercase tracking-wide block mb-0.5">
              Statutory Verification Disclaimer:
            </span>
            These certificates and acceptance documents authenticate legal registration, corporate capacity, trademark assignment, and anti-money laundering compliance under the Laws of the Federation of Nigeria (CAMA 2020 &amp; Money Laundering Prevention Act 2022). They attest to corporate legitimacy and identity.
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Documents' },
              { id: 'incorporation', label: 'CAC NGO' },
              { id: 'trademark', label: 'Trademarks' },
              { id: 'compliance', label: 'SCUML / Compliance' },
              { id: 'subsidiary', label: 'Sports & Academy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#13231f] text-[#c9ec63] shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by RN, filing ID, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs outline-none focus:border-[#13231f] focus:ring-1 focus:ring-[#13231f]"
            />
          </div>
        </div>

        {/* Grid of Documents */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#13231f]/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-[#c9ec63]/30 to-transparent rounded-bl-[4rem] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {doc.status}
                  </span>
                  <span className="font-mono text-xs font-semibold text-stone-500">
                    {doc.dateIssued}
                  </span>
                </div>

                <div className="h-12 w-12 rounded-xl bg-[#13231f] text-[#c9ec63] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <FileCheck2 className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#13231f] transition-colors leading-snug">
                  {doc.title}
                </h3>

                <p className="mt-1 font-mono text-xs font-bold text-emerald-700">
                  {doc.registrationNumber}
                </p>

                <p className="mt-3 text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {doc.summary}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-100 space-y-1.5 text-[11px] text-stone-500">
                  <div className="flex items-center justify-between">
                    <span>Issuing Body:</span>
                    <span className="font-medium text-stone-700 text-right truncate max-w-[160px]">{doc.issuingBody}</span>
                  </div>
                  {doc.taxId && (
                    <div className="flex items-center justify-between">
                      <span>Tax ID (TIN):</span>
                      <span className="font-mono font-medium text-stone-700">{doc.taxId}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Signatory:</span>
                    <span className="font-medium text-stone-700 truncate max-w-[160px]">{doc.signatory}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Eye className="h-3.5 w-3.5 text-[#c9ec63]" />
                  Inspect Record
                </button>
                <a
                  href={`/credentials/${doc.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedDoc(doc)
                  }}
                  className="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition"
                  title="View full certificate metadata"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Organization Leadership & Governance (From PDF) */}
        <div className="mt-20 rounded-3xl bg-white border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-700 mb-2">
            <Building2 className="h-4 w-4" />
            Board of Trustees &amp; Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Duly Appointed Trustees of SIDAAP
          </h2>
          <p className="mt-2 text-sm text-stone-600 max-w-3xl">
            As officially certified under the Companies and Allied Matters Act (CAC RN: 8390984), the following individuals are the appointed trustees entrusted with governance, fiduciary accountability, and national outreach policy:
          </p>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Friday Chalele', role: 'Trustee' },
              { name: 'Doris Bode', role: 'Trustee' },
              { name: 'Steve Ahans', role: 'Trustee' },
              { name: 'Praise Ohwojero Efe', role: 'Trustee' },
              { name: 'Anthony Odianosen Donald', role: 'Trustee' },
              { name: 'Prosper Ohwojero', role: 'Trustee & Sports Director' },
            ].map((trustee) => (
              <div key={trustee.name} className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#13231f] text-[#c9ec63] font-bold text-sm">
                  {trustee.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{trustee.name}</h4>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider">{trustee.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500">
            <span>Official Registered Address: Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse, Abuja</span>
            <span className="font-mono text-emerald-800 font-bold">CAC Verified Entity</span>
          </div>
        </div>
      </section>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#13231f] p-6 text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9ec63] text-[#13231f]">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#c9ec63]">
                    {selectedDoc.issuingBody}
                  </span>
                  <h3 className="text-lg font-bold">{selectedDoc.shortTitle}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-stone-700">
              {/* Document Certificate Representation */}
              <div className="rounded-2xl border-4 border-[#8c9d39]/40 bg-[#faf8f3] p-6 sm:p-8 text-center relative shadow-inner">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#13231f] text-[#c9ec63] mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-stone-500">
                  Federal Republic of Nigeria
                </p>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-stone-900 mt-1 uppercase tracking-tight">
                  {selectedDoc.title}
                </h4>
                <div className="my-4 inline-block rounded-full bg-emerald-100 text-emerald-800 px-4 py-1 font-mono text-xs font-bold border border-emerald-300">
                  {selectedDoc.registrationNumber}
                </div>
                <p className="text-stone-600 text-xs leading-relaxed max-w-lg mx-auto">
                  {selectedDoc.summary}
                </p>
                <div className="mt-6 pt-4 border-t border-stone-300 text-[11px] text-stone-500 font-mono flex flex-wrap justify-center gap-6">
                  <span>DATE: {selectedDoc.dateIssued}</span>
                  {selectedDoc.taxId && <span>TIN: {selectedDoc.taxId}</span>}
                  <span>STATUS: {selectedDoc.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                  Official Record Details
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Applicant / Entity</span>
                    <span className="font-bold text-stone-900">{selectedDoc.details.applicantName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Signatory</span>
                    <span className="font-bold text-stone-900">{selectedDoc.signatory}</span>
                  </div>
                </div>

                {selectedDoc.details.address && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Registered Office Address</span>
                    <span className="font-medium text-stone-800">{selectedDoc.details.address}</span>
                  </div>
                )}

                {selectedDoc.details.trustees && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1">Duly Appointed Trustees</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoc.details.trustees.map((t) => (
                        <span key={t} className="rounded-md bg-stone-200 px-2 py-0.5 text-[11px] font-medium text-stone-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDoc.details.class && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Classification</span>
                    <span className="font-medium text-stone-800">{selectedDoc.details.class}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold mb-0.5">Statutory Scope</span>
                  <p className="text-[11px] leading-relaxed">{selectedDoc.details.notes}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between bg-stone-100 p-4 border-t border-stone-200">
              <span className="text-[11px] text-stone-500">
                Official SIDAAP Document Registry
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-xl bg-[#13231f] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1d3730] transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
