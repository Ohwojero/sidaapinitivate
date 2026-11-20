import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#18312a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <p className="text-xl font-bold tracking-[0.12em]">SIDAAP</p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Smart Initiative for Drug Abuse Awareness and Prevention.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9ec63]">Explore</p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Link href="/about" className="hover:text-[#c9ec63]">About SIDAAP</Link>
              <Link href="/programs" className="hover:text-[#c9ec63]">Programs</Link>
              <Link href="/find-help" className="hover:text-[#c9ec63]">Find help</Link>
              <Link href="/resources" className="hover:text-[#c9ec63]">Resources</Link>
              <Link href="/portal/login" className="hover:text-[#c9ec63]">Staff login</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9ec63]">Get support</p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
            <a href="tel:08063430562" className="flex items-center gap-2 hover:text-[#c9ec63]">
              <Phone className="h-4 w-4" /> 0806 343 0562
            </a>
            <a href="mailto:smartinitiativedaap@gmail.com" className="flex items-center gap-2 hover:text-[#c9ec63]">
              <Mail className="h-4 w-4" /> Email us
            </a>
            <Link href="/credentials" className="hover:text-[#c9ec63]">Credentials</Link>
            <Link href="/contact" className="hover:text-[#c9ec63]">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SIDAAP. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> Abuja, Nigeria
          </p>
        </div>
      </div>
    </footer>
  )
}
