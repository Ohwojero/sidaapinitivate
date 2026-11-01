'use client'

import Link from 'next/link'
import {
  ShieldCheck,
  HeartHandshake,
  Users,
  Search,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  PhoneCall,
  Sparkles,
  BookOpen,
  Trophy,
  GraduationCap,
  Building2,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { NIGERIA_STATES } from '@/lib/data/nigeria-data'
import { CREDENTIAL_DOCUMENTS } from '@/lib/data/credentials-data'

export default function HomePage() {
  const [selectedQuickState, setSelectedQuickState] = useState('')
  const youthSectionParallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const handleParallax = () => {
      if (youthSectionParallaxRef.current) {
        const parent = youthSectionParallaxRef.current.parentElement
        if (parent) {
          const rect = parent.getBoundingClientRect()
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const centerDiff = rect.top + rect.height / 2 - window.innerHeight / 2
            const offset = centerDiff * 0.25
            youthSectionParallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`
          }
        }
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    handleParallax()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#13231f]">
      {/* Hero Section */}
      <section className="relative min-h-[760px] bg-[#13231f] pt-12 pb-24 text-[#f5f1e9] overflow-hidden">

        {/* ── Portrait image pinned to the right (Desktop only — avoids mobile overlap) ── */}
        <div className="absolute inset-y-0 right-0 w-[55%] pointer-events-none hidden lg:block">
          <img
            src="/hero-portrait.jpg"
            alt="Friday Chalele — National Executive Director, SIDAAP"
            className="h-full w-full object-cover object-top"
          />

          {/* Desktop gradient: smooth fade from solid dark to transparent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #13231f 5%, rgba(19,35,31,0.85) 35%, rgba(19,35,31,0.35) 65%, transparent 100%)'
            }}
          />

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#13231f] to-transparent pointer-events-none" />

          {/* ── Name tag floating bottom-right over portrait — desktop ── */}
          <div className="absolute bottom-28 right-6 pointer-events-none">
            <div className="backdrop-blur-md bg-[#0c1614]/80 border border-[#c9ec63]/30 rounded-2xl px-5 py-4 shadow-2xl max-w-[260px]">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-[#c9ec63] font-bold mb-1">
                National Executive Director
              </span>
              <h3 className="text-base font-black text-white leading-tight">Friday Chalele</h3>
              <p className="text-[11px] text-[#a9b9a8] mt-0.5 leading-snug">
                Strategic Oversight &amp; National Community Engagement
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Active · Nationwide</span>
              </div>
            </div>
          </div>

          {/* ── Board leadership strip — desktop ── */}
          <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {[
                { initial: 'DB', name: 'Doris Bode', role: 'Trustee' },
                { initial: 'SA', name: 'Steve Ahans', role: 'Trustee' },
                { initial: 'PO', name: 'Praise O. Efe', role: 'Trustee' },
                { initial: 'AO', name: 'A. O. Donald', role: 'Trustee' },
                { initial: 'PH', name: 'Prosper Ohwojero', role: 'Sports Dir.' },
              ].map((m) => (
                <div
                  key={m.initial}
                  className="flex items-center gap-2 bg-[#0c1614]/75 backdrop-blur-sm border border-white/10 rounded-full pl-1 pr-3 py-1"
                >
                  <div className="h-6 w-6 rounded-full bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black text-[9px] shrink-0">
                    {m.initial}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-white leading-none">{m.name}</span>
                    <span className="block text-[9px] font-mono text-[#a9b9a8] uppercase tracking-wide leading-none mt-0.5">{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle grid pattern — sits above the image */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(201,236,99,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(201,236,99,.2)_1px,transparent_1px)] [background-size:56px_56px]" />

        {/* Ambient lime glow */}
        <div className="absolute left-1/4 bottom-0 h-72 w-72 rounded-full bg-emerald-600/10 blur-[90px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl xl:max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[#c9ec63] border border-white/15 mb-8 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              <span>CAC RN: 8390984 &bull; SCUML Certified &bull; CAMA 2020</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-white">
              Protect <br />
              <span className="text-[#c9ec63]">Potential.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base sm:text-xl text-[#d1d9cf] leading-relaxed">
              A registered national civic-health movement stopping drug experimentation, empowering Nigerian youth through the <strong>SIDAAP Football Academy</strong>, and delivering confidential treatment referrals nationwide.
            </p>

            {/* Mobile Executive Director Spotlight Card (Clean, high-impact, no background clutter) */}
            <div className="lg:hidden mt-6 mb-2 rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-md flex items-center gap-3.5 shadow-lg">
              <div className="relative shrink-0">
                <img
                  src="/hero-portrait.jpg"
                  alt="Friday Chalele — National Executive Director"
                  className="h-14 w-14 rounded-xl object-cover object-top ring-2 ring-[#c9ec63] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-[#13231f] flex items-center justify-center">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#c9ec63] font-bold">
                    National Leadership
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">Friday Chalele</h3>
                <p className="text-[11px] text-[#a9b9a8] leading-tight truncate mt-0.5">
                  National Executive Director &bull; CAC RN: 8390984
                </p>
              </div>
            </div>

            {/* Quick State Search Bar */}
            <div className="mt-8 max-w-xl rounded-2xl bg-white/10 p-2.5 border border-white/20 backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl text-xs">
                <MapPin className="h-4 w-4 text-[#c9ec63] shrink-0" />
                <select
                  value={selectedQuickState}
                  onChange={(e) => setSelectedQuickState(e.target.value)}
                  className="w-full bg-transparent text-white outline-none text-xs font-medium cursor-pointer"
                >
                  <option value="" className="text-stone-900">Select your state to find nearest support...</option>
                  {NIGERIA_STATES.map((s) => (
                    <option key={s.code} value={s.name} className="text-stone-900">
                      {s.name} State ({s.zone})
                    </option>
                  ))}
                </select>
              </div>
              <Link
                href={selectedQuickState ? `/find-help?state=${encodeURIComponent(selectedQuickState)}` : '/find-help'}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] px-6 py-3 text-xs font-bold uppercase tracking-wider transition shadow-md whitespace-nowrap"
              >
                <Search className="h-3.5 w-3.5" />
                Search Directory
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:08063430562"
                className="flex items-center gap-2 rounded-full bg-[#c9ec63] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#13231f] transition hover:bg-white shadow-lg"
              >
                <PhoneCall className="h-4 w-4" />
                24/7 Helpline: 0806 343 0562
              </a>
              <Link
                href="/programs"
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#c9ec63] hover:text-[#c9ec63]"
              >
                Explore Our Work <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/credentials"
                className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#b6c4b9] transition hover:text-white"
              >
                <FileCheck2 className="h-4 w-4 text-[#c9ec63]" />
                Verified Credentials
              </Link>
            </div>

            {/* Credential strip */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#a9b9a8]">
              <span>CAC Inc: <strong className="font-mono text-[#c9ec63]">RN 8390984</strong></span>
              <span>SCUML: <strong className="font-mono text-white">SC 151423666</strong></span>
              <span>Football Academy: <strong className="font-mono text-white">RC 9864105</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-stone-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
              01 / Core Pillars
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mt-2">
              From Awareness to Tangible Recovery
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            Our multi-dimensional approach ensures young people never start, those struggling receive medical care, and communities stay vigilant.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-emerald-800">01</span>
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">Prevent</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Secondary school workshops, peer drug-free clubs, and free anti-drug educational exercise books distributed directly to students across Nigerian states.
              </p>
            </div>
            <Link
              href="/programs"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950"
            >
              School Campaigns <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-blue-800">02</span>
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">Treat &amp; Recover</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                24/7 confidential helplines, compassionate non-judgmental counseling, and direct admission pathways to accredited residential detox and rehabilitation centers.
              </p>
            </div>
            <Link
              href="/find-help"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 hover:text-blue-950"
            >
              Find Help Directory <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-amber-800">03</span>
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">Mobilise &amp; Empower</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                SIDAAP Football Academy Ltd (RC: 9864105) provides structured athletic training, tournaments, and mentorship to steer youth away from drug culture.
              </p>
            </div>
            <Link
              href="/programs"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950"
            >
              Football Academy <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Parallax Section 1: The National Slogan & Mandate Break */}
      <section
        className="relative py-28 sm:py-36 bg-fixed bg-center bg-cover text-white overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Single semi-transparent overlay — image stays visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1614]/80 via-[#13231f]/50 to-[#0c1614]/80" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#c9ec63]/15 border border-[#c9ec63]/30 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>CAC RN: 8390984 &bull; SCUML Certified &bull; CAMA 2020</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal italic tracking-tight text-white leading-tight">
            &ldquo;Breaking the Chains: Prevention, Treatment and Recovery for All!&rdquo;
          </h2>

          <p className="text-sm sm:text-lg text-[#d1d9cf] max-w-2xl mx-auto leading-relaxed">
            Every secondary school student we reach with branded anti-substance exercise books is one less youth lost to Colorado, Mkpuru Mmiri, or Tramadol.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/find-help"
              className="flex items-center gap-2 rounded-full bg-[#c9ec63] hover:bg-white text-[#13231f] px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-lg"
            >
              <MapPin className="h-4 w-4" />
              Find Support in Your State
            </Link>
            <Link
              href="/credentials"
              className="flex items-center gap-2 rounded-full border border-white/30 hover:border-[#c9ec63] hover:text-[#c9ec63] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition"
            >
              <FileCheck2 className="h-4 w-4" />
              View Legal Certificates
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Directory Teaser */}
      <section className="bg-[#13231f] text-white py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">
                02 / National Coverage
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
                A Database-Powered Directory <br />
                <span className="text-[#c9ec63]">Across All 36 States + FCT</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#b6c4b9] max-w-md">
              Need a rehabilitation clinic in Lagos, a psychiatric center in Edo, or a SIDAAP desk in Abuja? Our state and local directory indexes verified locations.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { state: 'Abuja (FCT)', count: '10+ Verified Centers', note: 'National HQ & NDLEA Command' },
              { state: 'Lagos State', count: '18+ Verified Centers', note: 'State Desk, Yaba Left & CADAM' },
              { state: 'Edo State', count: '8+ Verified Centers', note: 'FNPH Uselu & Community Desks' },
              { state: 'Rivers State', count: '7+ Verified Centers', note: 'Port Harcourt Outreaches' },
            ].map((loc) => (
              <div key={loc.state} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#c9ec63] transition flex flex-col justify-between">
                <div>
                  <MapPin className="h-6 w-6 text-[#c9ec63] mb-4" />
                  <h4 className="text-lg font-bold text-white">{loc.state}</h4>
                  <p className="font-mono text-xs text-[#c9ec63] mt-1 font-semibold">{loc.count}</p>
                  <p className="text-xs text-[#a9b9a8] mt-2">{loc.note}</p>
                </div>
                <Link
                  href={`/find-help?state=${encodeURIComponent(loc.state)}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c9ec63]"
                >
                  Explore State <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/find-help"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c9ec63] text-[#13231f] px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-white transition shadow-lg"
            >
              Browse Complete 36 States + 774 LGAs Directory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Verified Credentials Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-stone-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
              03 / Credibility &amp; Trust
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mt-2">
              Statutory Incorporations &amp; Registrations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            SIDAAP is a registered corporate trust and incorporated sports company with certified anti-money laundering clearance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CREDENTIAL_DOCUMENTS.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase px-3 py-0.5">
                    {doc.status}
                  </span>
                  <span className="font-mono text-xs text-stone-500">{doc.dateIssued}</span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[#13231f] text-[#c9ec63] flex items-center justify-center mb-4">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 leading-snug">{doc.shortTitle}</h3>
                <p className="font-mono text-xs font-bold text-emerald-800 mt-1">{doc.registrationNumber}</p>
                <p className="text-xs text-stone-600 mt-3 leading-relaxed line-clamp-3">{doc.summary}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/credentials"
                  className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950"
                >
                  <span>Inspect Official Certificate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/credentials"
            className="inline-flex items-center gap-2 rounded-xl bg-[#13231f] hover:bg-[#1d3730] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition"
          >
            <ShieldCheck className="h-4 w-4 text-[#c9ec63]" />
            View All 6 Verified Statutory Documents &amp; Trustees &rarr;
          </Link>
        </div>
      </section>

      {/* Parallax Section 2: Youth Sports & Football Academy Impact (Navbar background color #13231f with dynamic parallax) */}
      <section className="relative py-28 sm:py-36 text-white overflow-hidden shadow-2xl">
        {/* Parallax Background Layer - Hardware Accelerated translate3d */}
        <div
          ref={youthSectionParallaxRef}
          className="absolute inset-x-0 -top-[30%] h-[160%] w-full pointer-events-none will-change-transform bg-center bg-cover"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        {/* SIDAAP Navbar Color (#13231f) overlay - balanced so stadium background is visibly clear for parallax */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#13231f]/92 via-[#13231f]/78 to-[#13231f]/92 pointer-events-none" />

        {/* Ambient brand glows */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full bg-[#c9ec63]/12 blur-[130px] pointer-events-none" />
        <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9ec63]/15 border border-[#c9ec63]/30 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[#c9ec63] font-bold backdrop-blur-md">
                <Trophy className="h-4 w-4 text-[#c9ec63]" />
                <span>Athletic Mentorship &bull; SIDAAP Football Academy Ltd (RC: 9864105)</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                Channeling Youth Energy into <span className="text-[#c9ec63]">Champions, Not Addiction</span>
              </h2>

              <p className="text-sm sm:text-base text-[#b6c4b9] max-w-2xl leading-relaxed">
                By investing in structured football leagues, scouting trials, and mandatory substance education, we provide vulnerable Nigerian youth with purpose, athletic discipline, and an undeniable path to greatness.
              </p>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c9ec63] text-[#13231f] px-7 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-white transition shadow-xl font-mono"
                >
                  <Trophy className="h-4 w-4" />
                  Football Academy Program
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider hover:border-[#c9ec63] hover:text-[#c9ec63] hover:bg-white/5 transition"
                >
                  Join / Scout Youth Talent
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center hover:border-[#c9ec63]/60 transition shadow-xl">
                <span className="font-mono text-3xl font-black text-[#c9ec63]">37</span>
                <p className="text-[11px] uppercase tracking-wider text-[#d1d9cf] mt-1 font-semibold">State Chapters</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center hover:border-[#c9ec63]/60 transition shadow-xl">
                <span className="font-mono text-3xl font-black text-[#c9ec63]">774</span>
                <p className="text-[11px] uppercase tracking-wider text-[#d1d9cf] mt-1 font-semibold">LGAs Targeted</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center hover:border-[#c9ec63]/60 transition shadow-xl">
                <span className="font-mono text-3xl font-black text-white">15.4K+</span>
                <p className="text-[11px] uppercase tracking-wider text-[#d1d9cf] mt-1 font-semibold">Exercise Books</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center hover:border-[#c9ec63]/60 transition shadow-xl">
                <span className="font-mono text-3xl font-black text-[#c9ec63]">24/7</span>
                <p className="text-[11px] uppercase tracking-wider text-[#d1d9cf] mt-1 font-semibold">Crisis Hotlines</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / Take Decisive Action Section */}
      <section className="bg-[#13231f] text-white py-20 px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c9ec63]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center pb-12 border-b border-white/10">
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9ec63]/15 border border-[#c9ec63]/30 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-[#c9ec63] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c9ec63] animate-pulse" />
                <span>04 / Take Decisive Action &bull; Nationwide Movement</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Addiction Steals Potential. <br className="hidden sm:inline" />
                <span className="text-[#c9ec63]">We Help Reclaim It.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#b6c4b9] max-w-xl leading-relaxed">
                Do not suffer in silence. Whether you need immediate medical detox referrals, want anti-drug campaigns in your school, or wish to enrol a youth in our Football Academy, SIDAAP operates statutory doors across Nigeria.
              </p>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#a9b9a8]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#c9ec63]" />
                  <span>100% Confidential Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#c9ec63]" />
                  <span>NDLEA &amp; Hospital Referrals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#c9ec63]" />
                  <span>Statutory CAC RN: 8390984</span>
                </div>
              </div>
            </div>

            {/* Right Quick Action Links */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href="tel:08063430562"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#c9ec63] hover:text-[#13231f] border border-white/10 hover:border-[#c9ec63] text-white transition group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-bold shrink-0 group-hover:bg-[#13231f] group-hover:text-[#c9ec63] transition-colors">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Speak to a Counselor</h4>
                    <span className="font-mono text-xs text-[#b6c4b9] group-hover:text-[#13231f]/80 block">0806 343 0562 &bull; 24/7 Free</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#c9ec63] group-hover:text-[#13231f] group-hover:translate-x-1 transition-all" />
              </a>

              <Link
                href="/contact"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#c9ec63] hover:text-[#13231f] border border-white/10 hover:border-[#c9ec63] text-white transition group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold shrink-0 group-hover:bg-[#13231f] group-hover:text-[#c9ec63] transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Contact National Desk</h4>
                    <span className="text-xs text-[#b6c4b9] group-hover:text-[#13231f]/80 block">HQ Abuja &bull; State Liaison Desks</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#c9ec63] group-hover:text-[#13231f] group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* 3 Interactive Pathway Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#c9ec63]/50 transition flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-[#c9ec63] flex items-center justify-center mb-4">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Individuals &amp; Families</h3>
                <p className="text-xs text-[#b6c4b9] mt-2 leading-relaxed">
                  Confidential intake, non-judgmental family counseling, and direct placement into accredited medical rehab centers nationwide.
                </p>
              </div>
              <Link
                href="/find-help"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c9ec63] hover:text-white transition"
              >
                <span>Find Treatment Centers</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#c9ec63]/50 transition flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-[#c9ec63]/20 text-[#c9ec63] flex items-center justify-center mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Schools &amp; Institutions</h3>
                <p className="text-xs text-[#b6c4b9] mt-2 leading-relaxed">
                  Invite our outreach team for campus lectures, establish drug-free school clubs, and receive free anti-substance exercise books.
                </p>
              </div>
              <Link
                href="/programs"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c9ec63] hover:text-white transition"
              >
                <span>Request School Campaign</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#c9ec63]/50 transition flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Youth &amp; Athletes</h3>
                <p className="text-xs text-[#b6c4b9] mt-2 leading-relaxed">
                  Enrol in SIDAAP Football Academy Ltd (RC: 9864105). Channel raw athletic energy into coaching, scouting trials, and tournament glory.
                </p>
              </div>
              <Link
                href="/programs"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c9ec63] hover:text-white transition"
              >
                <span>Football Academy Details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
