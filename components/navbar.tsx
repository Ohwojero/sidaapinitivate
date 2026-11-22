'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  ShieldCheck,
  X,
  ChevronDown,
  Building2,
  MapPin,
  Target,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  // 'About' is handled with a dynamic hover dropdown
  { href: '/programs', label: 'Programs' },
  { href: '/find-help', label: 'Find help' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#18312a] text-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9ec63] text-[#18312a] shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>
            <strong className="block text-lg leading-none tracking-[0.12em]">SIDAAP</strong>
            <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-white/60 sm:block">
              Drug abuse prevention
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {/* Home */}
          <Link
            href="/"
            className={pathname === '/' ? 'text-[#c9ec63]' : 'text-white/80 hover:text-white'}
          >
            Home
          </Link>

          {/* About Dropdown (Hover & Click) */}
          <div
            className="relative"
            onMouseEnter={() => setAboutDropdownOpen(true)}
            onMouseLeave={() => setAboutDropdownOpen(false)}
          >
            <Link
              href="/about"
              className={`inline-flex items-center gap-1.5 py-2 transition ${
                pathname.startsWith('/about') ? 'text-[#c9ec63]' : 'text-white/80 hover:text-white'
              }`}
            >
              About
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  aboutDropdownOpen ? 'rotate-180 text-[#c9ec63]' : 'text-white/60'
                }`}
              />
            </Link>

            {/* Flyout Menu */}
            <div
              className={`absolute left-0 top-full pt-2 w-72 transition-all duration-200 ${
                aboutDropdownOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="rounded-2xl border border-white/15 bg-[#12241f] p-2 shadow-2xl backdrop-blur-xl">
                {/* About Overview */}
                <Link
                  href="/about"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9ec63]/15 text-[#c9ec63]">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">About SIDAAP</div>
                    <div className="text-[11px] text-white/60">Aims, vision, mission & mandate</div>
                  </div>
                </Link>

                <div className="my-1 border-t border-white/10" />

                {/* National Director */}
                <Link
                  href="/about#national-director"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-[#c9ec63]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">National Director</div>
                    <div className="text-[11px] text-white/60">Executive Directorate & leadership</div>
                  </div>
                </Link>

                {/* State Directors */}
                <Link
                  href="/about#state-directors"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">State Directors</div>
                    <div className="text-[11px] text-white/60">36 States & FCT coordination</div>
                  </div>
                </Link>

                {/* Board of Trustees */}
                <Link
                  href="/about#board-of-trustees"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Board of Trustees</div>
                    <div className="text-[11px] text-white/60">Statutory governance bodies</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Remaining links */}
          {navLinks
            .filter((l) => l.href !== '/')
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? 'text-[#c9ec63]' : 'text-white/80 hover:text-white'}
              >
                {link.label}
              </Link>
            ))}

          <Link
            href="/portal/login"
            className="rounded-lg border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#c9ec63] hover:text-[#c9ec63]"
          >
            Staff login
          </Link>
          <a
            href="tel:08063430562"
            className="rounded-lg bg-[#c9ec63] px-4 py-2.5 text-xs font-bold text-[#18312a] transition hover:bg-white"
          >
            Call for help
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {open && (
        <nav className="border-t border-white/10 px-6 py-5 md:hidden bg-[#18312a]">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Home
            </Link>

            {/* Mobile About Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAboutOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                <span>About</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#c9ec63]' : ''}`}
                />
              </button>
              {mobileAboutOpen && (
                <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-white/15 pl-3">
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-xs font-medium text-white/80 hover:text-white"
                  >
                    About Overview
                  </Link>
                  <Link
                    href="/about#national-director"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-[#c9ec63] hover:underline"
                  >
                    National Director
                  </Link>
                  <Link
                    href="/about#state-directors"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-300 hover:underline"
                  >
                    State Directors
                  </Link>
                  <Link
                    href="/about#board-of-trustees"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-amber-300 hover:underline"
                  >
                    Board of Trustees
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/programs"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Programs
            </Link>
            <Link
              href="/find-help"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Find help
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Contact
            </Link>

            <Link
              href="/portal/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg bg-[#c9ec63] px-3 py-3 text-center text-sm font-bold text-[#18312a]"
            >
              Staff login
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
