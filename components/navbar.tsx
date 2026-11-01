'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ShieldCheck,
  MapPin,
  FileCheck2,
  BookOpen,
  ArrowRight,
  Lock,
  HeartHandshake,
  Users,
  ChevronDown,
  Trophy,
  GraduationCap,
  Megaphone,
  Award,
  AlertTriangle,
  Calendar,
  Building2,
  PhoneCall
} from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on route change
  useEffect(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#13231f]/95 text-[#f5f1e9] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 1. BRAND EMBLEM & IDENTITY */}
        {/* ========================================================= */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9ec63] to-[#8c9d39] text-[#13231f] shadow-md ring-2 ring-white/10 transition-transform group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-black tracking-[0.2em] text-white">
                SIDAAP
              </span>
              <span className="hidden sm:inline-block rounded-full bg-[#c9ec63]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#c9ec63] border border-[#c9ec63]/30">
                RN: 8390984
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-[#a9b9a8] tracking-wider uppercase font-medium">
              Drug Abuse Awareness &amp; Prevention
            </span>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* 2. SPACIOUS GROUPED NAVIGATION (Clean 4-Item Layout) */}
        {/* ========================================================= */}
        <nav
          ref={dropdownRef}
          className="hidden lg:flex items-center gap-8 text-[13px] font-semibold tracking-wider uppercase"
        >
          {/* HOME */}
          <Link
            href="/"
            className={`py-2 transition-colors ${
              pathname === '/' ? 'text-[#c9ec63]' : 'text-[#d1d9cf] hover:text-[#c9ec63]'
            }`}
          >
            Home
          </Link>

          {/* DROPDOWN 1: ABOUT & GOVERNANCE */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
              onMouseEnter={() => setActiveDropdown('about')}
              className={`flex items-center gap-1.5 py-2 transition-colors ${
                pathname.startsWith('/about') || pathname.startsWith('/credentials')
                  ? 'text-[#c9ec63]'
                  : 'text-[#d1d9cf] hover:text-[#c9ec63]'
              }`}
            >
              <span>About Us</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === 'about' ? 'rotate-180 text-[#c9ec63]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {activeDropdown === 'about' && (
              <div
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute left-0 top-full pt-2 w-80 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="rounded-2xl border border-white/15 bg-[#162924] p-3 shadow-2xl backdrop-blur-xl">
                  <Link
                    href="/about"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-white/10 text-[#c9ec63] flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                        About SIDAAP &amp; Trustees
                      </div>
                      <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                        Our mandate, vision, board of trustees, and NDLEA partnerships.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/credentials"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c9ec63] flex items-center gap-1.5">
                        <span>Legal Credentials &amp; CAC</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded">Verified</span>
                      </div>
                      <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                        CAC incorporation, SCUML anti-money laundering &amp; trademarks.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* DROPDOWN 2: OUR PROGRAMS */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'programs' ? null : 'programs')}
              onMouseEnter={() => setActiveDropdown('programs')}
              className={`flex items-center gap-1.5 py-2 transition-colors ${
                pathname.startsWith('/programs') ? 'text-[#c9ec63]' : 'text-[#d1d9cf] hover:text-[#c9ec63]'
              }`}
            >
              <span>Our Programs</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === 'programs' ? 'rotate-180 text-[#c9ec63]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu With Featured Image */}
            {activeDropdown === 'programs' && (
              <div
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[620px] animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="rounded-3xl border border-white/15 bg-[#142621]/95 p-4 shadow-2xl backdrop-blur-2xl grid grid-cols-12 gap-3">
                  {/* Left Column: Program Links */}
                  <div className="col-span-7 space-y-1">
                    <Link
                      href="/programs"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                          Secondary School Outreaches
                        </div>
                        <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                          Classroom workshops &amp; free anti-drug exercise books.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/programs"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                          SIDAAP Football Academy Ltd
                        </div>
                        <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                          Youth sports mentorship away from substance abuse.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/programs"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                          Community Sensitization Rallies
                        </div>
                        <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                          Joint marches with NDLEA field officers across states.
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Right Column: Featured Visual Image Card */}
                  <Link
                    href="/programs"
                    className="col-span-5 rounded-2xl overflow-hidden bg-[#0c1815] border border-white/10 relative flex flex-col justify-end p-4 group hover:border-[#c9ec63]/50 transition shadow-inner"
                  >
                    {/* Background Program Image with Gradient */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-60"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80')`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1815] via-[#0c1815]/70 to-transparent" />

                    <div className="relative z-10 space-y-1.5">
                      <span className="rounded-full bg-[#c9ec63] text-[#13231f] px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
                        Featured Initiative
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#c9ec63] transition-colors leading-tight">
                        SIDAAP Football Academy &bull; RC: 9864105
                      </h4>
                      <p className="text-[10px] text-[#b6c4b9] normal-case leading-snug">
                        Developing today&apos;s youth talent for tomorrow&apos;s drug-free leaders.
                      </p>
                      <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-[#c9ec63] font-mono">
                        <span>Explore Program</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* HIGHLIGHTED ITEM: FIND HELP (DIRECT PIN) */}
          <Link
            href="/find-help"
            className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              pathname === '/find-help'
                ? 'bg-[#c9ec63] text-[#13231f] font-bold shadow-sm'
                : 'text-[#c9ec63] hover:bg-white/10'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Find Help</span>
          </Link>

          {/* DROPDOWN 3: RESOURCES & NEWS */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
              onMouseEnter={() => setActiveDropdown('resources')}
              className={`flex items-center gap-1.5 py-2 transition-colors ${
                pathname.startsWith('/resources') || pathname.startsWith('/news-events')
                  ? 'text-[#c9ec63]'
                  : 'text-[#d1d9cf] hover:text-[#c9ec63]'
              }`}
            >
              <span>Resources</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === 'resources' ? 'rotate-180 text-[#c9ec63]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {activeDropdown === 'resources' && (
              <div
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute left-0 top-full pt-2 w-80 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="rounded-2xl border border-white/15 bg-[#162924] p-3 shadow-2xl backdrop-blur-xl">
                  <Link
                    href="/resources"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                        Drug Factsheets &amp; Laws
                      </div>
                      <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                        Colorado, Meth, Tramadol dangers &amp; NDLEA legal penalties.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/news-events"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:bg-[#c9ec63] group-hover:text-[#13231f] transition">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c9ec63]">
                        News &amp; Field Events
                      </div>
                      <p className="text-[11px] text-[#a9b9a8] normal-case mt-0.5">
                        School book distribution reports and upcoming outreach dates.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT */}
          <Link
            href="/contact"
            className={`py-2 transition-colors ${
              pathname === '/contact' ? 'text-[#c9ec63]' : 'text-[#d1d9cf] hover:text-[#c9ec63]'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* ========================================================= */}
        {/* 3. RIGHT CALL-TO-ACTION BUTTON (Spacious & Clean) */}
        {/* ========================================================= */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/portal/login"
            className="flex items-center gap-2 rounded-full border border-[#c9ec63]/60 bg-white/5 hover:bg-[#c9ec63] hover:text-[#13231f] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#c9ec63] transition shadow-md group"
          >
            <Lock className="h-3.5 w-3.5 transition group-hover:scale-110" />
            <span>Staff Portal</span>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 4. MOBILE HAMBURGER BUTTON */}
        {/* ========================================================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-xl p-2.5 text-white/80 hover:text-white hover:bg-white/10 transition"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 5. MOBILE ACCORDION DRAWER */}
      {/* ========================================================= */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0d1a17] px-6 py-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white/5 text-white"
            >
              Home
            </Link>

            {/* About Group */}
            <div className="py-2 border-y border-white/5">
              <span className="text-[10px] text-[#c9ec63] font-mono tracking-widest block px-3 mb-2">
                ABOUT &amp; CREDENTIALS
              </span>
              <div className="flex flex-col gap-1 pl-3">
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-stone-300 hover:text-white"
                >
                  About SIDAAP &amp; Trustees
                </Link>
                <Link
                  href="/credentials"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-stone-300 hover:text-white"
                >
                  Verified CAC &amp; SCUML Documents
                </Link>
              </div>
            </div>

            {/* Programs Group */}
            <div className="py-2 border-b border-white/5">
              <span className="text-[10px] text-[#c9ec63] font-mono tracking-widest block px-3 mb-2">
                OUR PROGRAMS
              </span>
              <div className="flex flex-col gap-1 pl-3">
                <Link
                  href="/programs"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-stone-300 hover:text-white"
                >
                  Secondary School Outreaches &amp; Books
                </Link>
                <Link
                  href="/programs"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-stone-300 hover:text-white"
                >
                  SIDAAP Football Academy Ltd
                </Link>
                <Link
                  href="/programs"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-stone-300 hover:text-white"
                >
                  Community &amp; NDLEA Sensitization Marches
                </Link>
              </div>
            </div>

            <Link
              href="/find-help"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-[#c9ec63] text-[#13231f] font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Find Help in Your State
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/resources"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white/5 text-stone-300"
            >
              Drug Factsheets &amp; Resources
            </Link>

            <Link
              href="/news-events"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white/5 text-stone-300"
            >
              News &amp; Outreach Updates
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white/5 text-stone-300"
            >
              Contact &amp; Helplines
            </Link>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/portal/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10"
              >
                <Lock className="h-4 w-4 text-[#c9ec63]" />
                Staff &amp; Director Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
