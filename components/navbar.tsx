'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/find-help', label: 'Find help' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#18312a] text-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9ec63] text-[#18312a]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>
            <strong className="block text-lg leading-none tracking-[0.12em]">SIDAAP</strong>
            <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-white/60 sm:block">
              Drug abuse prevention
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {links.map((link) => (
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
            className="rounded-lg border border-white/25 px-4 py-2.5 text-xs font-bold text-white hover:border-[#c9ec63] hover:text-[#c9ec63]"
          >
            Staff login
          </Link>
          <a
            href="tel:08063430562"
            className="rounded-lg bg-[#c9ec63] px-4 py-2.5 text-xs font-bold text-[#18312a] hover:bg-white"
          >
            Call for help
          </a>
        </nav>

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

      {open && (
        <nav className="border-t border-white/10 px-6 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#c9ec63] px-3 py-3 text-center text-sm font-bold text-[#18312a]"
            >
              Staff login
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
