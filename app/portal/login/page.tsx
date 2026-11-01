'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react'
import {
  saveStoredUser,
  getDashboardPathForRole,
  authenticateUser
} from '@/lib/auth/session'

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Handle standard role-based login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    const result = await authenticateUser(email.trim(), password)
    if (result.success && result.user) {
      saveStoredUser(result.user)
      router.push(getDashboardPathForRole(result.user.role))
    } else {
      setErrorMsg(result.message || 'Authentication failed. Please check your official email and password.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0c1614] text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="mx-auto max-w-4xl w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black shadow transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-mono text-sm font-bold tracking-widest text-white">
              SIDAAP
            </span>
            <span className="text-[10px] text-[#a9b9a8] tracking-wider uppercase block">
              Digital Governance Portal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white transition"
        >
          &larr; Back to Public Website
        </Link>
      </div>

      {/* Main Centered Login Card */}
      <div className="mx-auto max-w-md w-full my-auto py-8">
        <div className="rounded-3xl bg-[#13231f] border border-white/10 p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c9ec63]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sign In to Portal
            </h1>
            <p className="mt-1 text-xs text-[#b6c4b9] leading-relaxed">
              Enter your assigned official email and password to access your statutory dashboard (National HQ, State Directorate, or LGA Field Staff).
            </p>

            {errorMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed flex-1">{errorMsg}</span>
                <button onClick={() => setErrorMsg('')} className="shrink-0 text-red-400 hover:text-red-200 transition cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#d1d9cf] mb-1.5 uppercase tracking-wider text-[11px]">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    required
                    type="email"
                    placeholder="e.g. director@sidaap.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#182c27] text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 outline-none focus:border-[#c9ec63] focus:ring-1 focus:ring-[#c9ec63] text-xs placeholder:text-white/30"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[#d1d9cf] uppercase tracking-wider text-[11px]">
                    Password
                  </label>
                  <span className="text-[10px] text-[#a9b9a8] font-mono">Secured</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#182c27] text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 outline-none focus:border-[#c9ec63] focus:ring-1 focus:ring-[#c9ec63] text-xs placeholder:text-white/30 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] py-3 text-xs font-bold uppercase tracking-wider transition shadow-lg mt-3 font-mono disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating Role &amp; Tier...</span>
                ) : (
                  <>
                    <span>Sign In &amp; Launch Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Role Governance & Issuance Notice */}
          <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-[#a9b9a8] space-y-2">
            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
              <KeyRound className="h-4 w-4 text-[#c9ec63] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Credentials Notice:</strong> State Director logins are issued by National HQ. Field &amp; LGA staff logins are enrolled by their State Directorate.
              </p>
            </div>
            <div className="pt-2 text-[10px] text-stone-500 font-mono flex items-center justify-between">
              <span>CAMA 2020 Statutory Auth</span>
              <span>RC: 8390984</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-4xl w-full text-center text-xs text-[#a9b9a8] py-2">
        &copy; {new Date().getFullYear()} SIDAAP Nigeria. Statutory Anti-Substance Portal. All access audited under CAMA 2020.
      </div>
    </div>
  )
}
