'use client'

import { PhoneCall, ShieldAlert, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative bg-[#0e1b18] text-[#f5f1e9] border-b border-white/10 text-xs py-2.5 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            24/7 Emergency Support Helpline
          </span>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:inline text-white/80">Confidential, toll-free guidance for individuals and families</span>
        </div>

        <div className="flex items-center gap-4 text-[12px] font-mono">
          <a
            href="tel:08063430562"
            className="flex items-center gap-1.5 font-bold text-[#c9ec63] hover:underline"
          >
            <PhoneCall className="h-3 w-3" />
            0806 343 0562
          </a>
          <span className="text-white/30">•</span>
          <a
            href="tel:08028531259"
            className="hidden sm:flex items-center gap-1.5 font-bold text-white hover:text-[#c9ec63]"
          >
            0802 853 1259
          </a>
          <Link
            href="/find-help"
            className="hidden lg:inline-block rounded-full bg-white/10 hover:bg-white/20 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-white"
          >
            Find Local Centre
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-white/60 hover:text-white ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
