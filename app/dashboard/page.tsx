'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getStoredUser,
  getDashboardPathForRole,
  DEMO_ACCOUNTS,
  saveStoredUser,
  AuthUser
} from '@/lib/auth/session'
import {
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react'

export default function DashboardIndexRouter() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setMounted(true)
    const user = getStoredUser()
    setCurrentUser(user)
    if (user) {
      router.replace(getDashboardPathForRole(user.role))
    }
  }, [router])

  const handleLaunch = (acc: AuthUser) => {
    saveStoredUser(acc)
    router.push(getDashboardPathForRole(acc.role))
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0c1614] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="h-14 w-14 rounded-2xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center mx-auto shadow-xl">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#c9ec63] font-bold">
            SIDAAP Command Center Router
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
            Select Your Directorate Tier
          </h1>
          <p className="text-xs text-[#a9b9a8] mt-2 max-w-md mx-auto">
            Each role has a distinct, isolated dashboard. Click your authorized role below to enter your designated workspace:
          </p>
        </div>

        <div className="space-y-3 pt-4 text-left">
          {/* National */}
          <button
            onClick={() => handleLaunch(DEMO_ACCOUNTS[0])}
            className="w-full p-4 rounded-2xl bg-[#13231f] hover:bg-[#1a332d] border border-white/10 hover:border-[#c9ec63] transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black text-sm">
                FC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">National Director</h3>
                  <span className="text-[9px] font-mono bg-white/10 text-[#c9ec63] px-2 py-0.5 rounded uppercase font-bold">
                    Abuja HQ
                  </span>
                </div>
                <p className="text-[11px] text-[#a9b9a8]">
                  Dr. Friday Chalele &bull; Appoints State Directors &bull; All 36 States + FCT
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#c9ec63] transition group-hover:translate-x-1" />
          </button>

          {/* State */}
          <button
            onClick={() => handleLaunch(DEMO_ACCOUNTS[1])}
            className="w-full p-4 rounded-2xl bg-[#13231f] hover:bg-[#1a332d] border border-white/10 hover:border-amber-400 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-sm">
                BS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">State Director</h3>
                  <span className="text-[9px] font-mono bg-white/10 text-amber-300 px-2 py-0.5 rounded uppercase font-bold">
                    Lagos State
                  </span>
                </div>
                <p className="text-[11px] text-[#a9b9a8]">
                  Engr. Babatunde Sanusi &bull; Onboards LGA Staff &bull; Logs Outreaches
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-300 transition group-hover:translate-x-1" />
          </button>

          {/* Member */}
          <button
            onClick={() => handleLaunch(DEMO_ACCOUNTS[3])}
            className="w-full p-4 rounded-2xl bg-[#13231f] hover:bg-[#1a332d] border border-white/10 hover:border-blue-400 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-400 text-stone-900 flex items-center justify-center font-black text-sm">
                BO
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Local LGA Member</h3>
                  <span className="text-[9px] font-mono bg-white/10 text-blue-300 px-2 py-0.5 rounded uppercase font-bold">
                    Ikeja LGA
                  </span>
                </div>
                <p className="text-[11px] text-[#a9b9a8]">
                  Blessing Okon &bull; Digital Field Pass &bull; School Visits Dispatch
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-blue-300 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <Link href="/portal/login" className="text-stone-400 hover:text-white underline font-mono">
            Full Portal Login &rarr;
          </Link>
          <Link href="/" className="text-stone-400 hover:text-white underline font-mono">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
