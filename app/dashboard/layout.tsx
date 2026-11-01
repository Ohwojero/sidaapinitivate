'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Users,
  Building2,
  LogOut,
  MapPin,
  FileCheck2,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle2,
  Camera
} from 'lucide-react'
import {
  getStoredUser,
  clearStoredUser,
  saveStoredUser,
  AuthUser,
  DEMO_ACCOUNTS,
  getDashboardPathForRole
} from '@/lib/auth/session'
import { EditProfileModal } from '@/components/edit-profile-modal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  // Refs for outside-click detection on the header dropdown
  const headerDropdownRef = useRef<HTMLDivElement>(null)

  const isChat = pathname === '/dashboard/chat'

  useEffect(() => {
    const updateUser = () => setUser(getStoredUser())
    updateUser()
    window.addEventListener('sidaap_user_updated', updateUser)
    return () => window.removeEventListener('sidaap_user_updated', updateUser)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (!headerDropdownRef.current?.contains(target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    clearStoredUser()
    router.push('/portal/login')
  }

  const handleSwitchUser = (account: AuthUser) => {
    saveStoredUser(account)
    setUser(account)
    setProfileDropdownOpen(false)
    router.push(getDashboardPathForRole(account.role))
  }

  const roleHomePath = user ? getDashboardPathForRole(user.role) : '/dashboard'

  // Shared dropdown content — rendered once, used in both sidebar (fixed) and header (absolute)
  const dropdownContent = (
    <>
      {/* User Profile Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#c9ec63] shadow-md shrink-0" />
        ) : (
          <div className="h-12 w-12 rounded-2xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black text-sm shrink-0">
            {user?.avatarInitials || 'DIR'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm truncate">{user?.name}</h4>
          <p className="text-[11px] text-[#a9b9a8] font-mono truncate">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#c9ec63]/20 text-[#c9ec63] border border-[#c9ec63]/30">
            {user?.title}
          </span>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="py-2.5 border-b border-white/10">
        <button
          onClick={() => { setProfileDropdownOpen(false); setIsEditProfileOpen(true) }}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#c9ec63] hover:bg-white text-[#13231f] transition text-xs font-bold shadow"
        >
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Edit Profile &amp; Change Photo</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Jurisdiction Info */}
      <div className="py-2.5 text-[11px] text-stone-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-stone-400">Jurisdiction:</span>
          <span className="font-medium text-white">{user?.state} State</span>
        </div>
        {user?.lga && (
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Assigned LGA:</span>
            <span className="font-medium text-white">{user.lga}</span>
          </div>
        )}
      </div>

      {/* Role Switcher */}
      <div className="py-2.5 border-t border-white/10">
        <span className="text-[9px] font-mono uppercase text-[#c9ec63] font-bold block mb-2 tracking-wider">Switch Active Persona</span>
        <div className="space-y-1.5">
          {[
            { account: DEMO_ACCOUNTS[0], label: 'National Director (Abuja)', active: user?.role === 'national_director', color: 'bg-[#c9ec63] text-[#13231f]' },
            { account: DEMO_ACCOUNTS[1], label: 'State Director (Lagos)', active: user?.id === DEMO_ACCOUNTS[1].id, color: 'bg-amber-400 text-stone-900' },
            { account: DEMO_ACCOUNTS[3], label: 'LGA Counselor (Ikeja)', active: user?.role === 'member', color: 'bg-blue-400 text-stone-900' },
          ].map(({ account, label, active, color }) => (
            <button
              key={account.id}
              onClick={() => handleSwitchUser(account)}
              className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition ${active ? `${color} font-bold` : 'hover:bg-white/5 text-[#d1d9cf]'}`}
            >
              <div className="flex items-center gap-2">
                <img src={account.avatarUrl} className="h-5 w-5 rounded-full object-cover" />
                <span className="text-[11px]">{label}</span>
              </div>
              {active && <CheckCircle2 className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2.5 border-t border-white/10 space-y-1">
        <Link
          href="/credentials"
          onClick={() => setProfileDropdownOpen(false)}
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-stone-300 hover:text-white transition"
        >
          <FileCheck2 className="h-3.5 w-3.5 text-[#c9ec63]" />
          <span>View SIDAAP Credentials &amp; CAC</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-950/40 text-red-300 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out / Return to Login</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#0c1614] text-white flex font-sans overflow-hidden">

      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-150" />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0e1a17] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href={roleHomePath} className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-black shadow transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black tracking-widest text-white">SIDAAP</span>
                <span className="rounded-full bg-[#c9ec63]/15 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-[#c9ec63] border border-[#c9ec63]/30">
                  {user?.role === 'national_director' && 'National HQ'}
                  {user?.role === 'state_director' && `${user.state} State`}
                  {user?.role === 'member' && 'LGA Portal'}
                  {!user && 'Gov Portal'}
                </span>
              </div>
              <span className="text-[10px] text-[#a9b9a8] tracking-wider uppercase block">Command &amp; Operations</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card — no dropdown trigger, just display */}
        <div className="mx-4 my-3 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-[#c9ec63] shrink-0 shadow-md" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c9ec63] to-[#8c9d39] text-[#13231f] flex items-center justify-center font-black text-sm shrink-0">
                {user?.avatarInitials || 'DIR'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || 'Authorized Official'}</h4>
              <span className="text-[10px] font-mono text-[#c9ec63] uppercase block font-semibold truncate">{user?.title || 'Directorate Member'}</span>
              <span className="text-[9px] text-[#a9b9a8] flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                {user?.lga ? `${user.lga}, ${user.state}` : user?.state || 'Nigeria'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#a9b9a8]/60 font-bold block mb-1.5">Workspaces</span>
            <div className="space-y-1">
              <Link href={roleHomePath} onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${pathname === roleHomePath ? 'bg-[#c9ec63] text-[#13231f] font-bold shadow-md' : 'text-[#d1d9cf] hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>
                    {user?.role === 'national_director' && 'National Oversight'}
                    {user?.role === 'state_director' && `${user.state} Command`}
                    {user?.role === 'member' && 'Field Workspace'}
                    {!user && 'Overview'}
                  </span>
                </div>
              </Link>
              <Link href="/dashboard/chat" onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${isChat ? 'bg-[#00a884] text-white font-bold shadow-md' : 'text-[#d1d9cf] hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Chat</span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-[#c9ec63] animate-pulse" />
              </Link>
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#a9b9a8]/60 font-bold block mb-1.5">Available Dashboards</span>
            <div className="space-y-1">
              {[
                { href: '/dashboard/national', label: 'National Director', icon: <Building2 className="h-3.5 w-3.5 text-[#c9ec63]" />, active: pathname === '/dashboard/national', tag: user?.role === 'national_director' ? 'Current' : null, tagColor: 'text-emerald-400' },
                { href: '/dashboard/state', label: 'State Director', icon: <MapPin className="h-3.5 w-3.5 text-amber-400" />, active: pathname === '/dashboard/state', tag: user?.role === 'state_director' ? 'Current' : null, tagColor: 'text-amber-300' },
                { href: '/dashboard/member', label: 'LGA Member / Staff', icon: <Users className="h-3.5 w-3.5 text-blue-400" />, active: pathname === '/dashboard/member', tag: user?.role === 'member' ? 'Current' : null, tagColor: 'text-blue-300' },
              ].map(({ href, label, icon, active, tag, tagColor }) => (
                <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${active ? 'bg-white/10 text-[#c9ec63] font-bold' : 'text-[#d1d9cf] hover:bg-white/5 hover:text-white'}`}>
                  <div className="flex items-center gap-2">{icon}<span>{label}</span></div>
                  {tag && <span className={`text-[9px] font-mono ${tagColor}`}>{tag}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#a9b9a8]/60 font-bold block mb-1.5">Public Registers</span>
            <div className="space-y-1">
              <Link href="/find-help" className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#d1d9cf] hover:bg-white/5 hover:text-white transition">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /><span>36 States Directory</span>
              </Link>
              <Link href="/credentials" className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#d1d9cf] hover:bg-white/5 hover:text-white transition">
                <FileCheck2 className="h-3.5 w-3.5 text-[#c9ec63]" /><span>CAC &amp; Trademarks</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/portal/login" className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#c9ec63] text-xs font-bold uppercase tracking-wider transition">
            <ArrowRightLeft className="h-3.5 w-3.5" /><span>Switch Role / Sign In</span>
          </Link>
          <Link href="/" className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider transition">
            <LogOut className="h-3.5 w-3.5" /><span>Exit to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#111e1b] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-white/80 hover:bg-white/10" aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {pathname.includes('national') && '🏛️ National Executive Command & Oversight'}
                {pathname.includes('state') && `📍 ${user?.state || 'State'} Directorate Command Center`}
                {pathname.includes('member') && `👤 ${user?.lga || 'LGA'} Field Officer Workspace`}
                {pathname.includes('chat') && '💬 SIDAAP WhatsApp Collaboration Engine'}
                {pathname === '/dashboard' && 'Command Center'}
              </h2>
              <span className="text-[10px] text-[#a9b9a8] font-mono hidden sm:inline">
                CAC RN: 8390984 &bull; SCUML RN: SC 151423666 &bull; CAMA 2020 Statutory Governance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/chat" className="hidden sm:flex items-center gap-2 rounded-xl bg-[#00a884] hover:bg-[#029071] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition shadow">
              <MessageSquare className="h-3.5 w-3.5" /><span>WhatsApp Chat</span>
              <span className="flex h-2 w-2 rounded-full bg-[#c9ec63] animate-pulse" />
            </Link>

            <button onClick={() => setIsEditProfileOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#c9ec63] hover:text-[#13231f] border border-white/10 text-xs font-semibold text-stone-300 transition group"
              title="Edit Profile and Photo">
              <Camera className="h-3.5 w-3.5 text-[#c9ec63] group-hover:text-[#13231f]" /><span>Edit Profile</span>
            </button>

            {/* Header profile dropdown */}
            <div ref={headerDropdownRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/15"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-[#c9ec63] shadow" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#c9ec63] text-[#13231f] flex items-center justify-center font-bold text-xs">
                    {user?.avatarInitials || 'DIR'}
                  </div>
                )}
                <div className="hidden md:block text-left text-xs leading-tight">
                  <span className="font-bold text-white block max-w-[130px] truncate">{user?.name || 'Official'}</span>
                  <span className="text-[9px] text-[#c9ec63] font-mono uppercase block">
                    {user?.role === 'national_director' && 'National Director'}
                    {user?.role === 'state_director' && `${user.state} Director`}
                    {user?.role === 'member' && `${user.lga || 'LGA'} Staff`}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-[#c9ec63]' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl bg-[#142621] border border-white/15 shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {dropdownContent}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} />
      </div>
    </div>
  )
}
