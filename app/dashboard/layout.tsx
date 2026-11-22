'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  CalendarDays,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  AuthUser,
  clearStoredUser,
  getDashboardPathForRole,
  getStoredUser,
} from '@/lib/auth/session'
import { EditProfileModal } from '@/components/edit-profile-modal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [leadershipOpen, setLeadershipOpen] = useState(true)

  useEffect(() => {
    const updateUser = () => {
      const storedUser = getStoredUser()
      setUser(storedUser)
      if (!storedUser) {
        router.replace('/portal/login')
        return
      }
      if (
        (pathname.startsWith('/dashboard/national') && storedUser.role !== 'national_director') ||
        (pathname.startsWith('/dashboard/state') && storedUser.role !== 'state_director') ||
        (pathname.startsWith('/dashboard/member') && storedUser.role !== 'member') ||
        (pathname.startsWith('/dashboard/programs') && storedUser.role === 'member')
      ) {
        router.replace(getDashboardPathForRole(storedUser.role))
      }
    }
    updateUser()
    window.addEventListener('sidaap_user_updated', updateUser)
    return () => window.removeEventListener('sidaap_user_updated', updateUser)
  }, [pathname])

  const roleHome = user ? getDashboardPathForRole(user.role) : '/dashboard'
  const workspaceLabel =
    user?.role === 'national_director'
      ? 'National director'
      : user?.role === 'state_director'
        ? `${user.state} state`
        : user?.role === 'member'
          ? `${user.lga || 'LGA'} field team`
          : 'SIDAAP dashboard'

  const navItems = [
    { href: roleHome, label: 'Overview', icon: LayoutDashboard },
    ...(user?.role === 'national_director'
      ? [{ href: '/dashboard/national#lga-members', label: 'LGA members', icon: Users }]
      : []),
    ...(user?.role === 'state_director'
      ? [{ href: '/dashboard/state#lga-members', label: 'Local LGA team', icon: Users }]
      : []),
    ...(user?.role === 'member'
      ? [{ href: '/dashboard/member', label: 'My field work', icon: MapPin }]
      : []),
    { href: '/dashboard/programs', label: 'Programs', icon: CalendarDays },
    { href: '/dashboard/chat', label: 'Messages', icon: MessageSquare },
  ]

  const signOut = () => {
    clearStoredUser()
    router.push('/portal/login')
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#eef1ed] text-[#18312a]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#18312a] text-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href={roleHome} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9ec63] text-[#18312a]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm tracking-[0.16em]">SIDAAP</strong>
              <span className="block text-[10px] text-white/55">{workspaceLabel}</span>
            </span>
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === roleHome
                ? pathname === roleHome
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                  active ? 'bg-[#c9ec63] text-[#18312a]' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          {user?.role === 'national_director' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setLeadershipOpen((open) => !open)}
                aria-expanded={leadershipOpen}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold ${
                  pathname === '/dashboard/board-of-trustees' || pathname === '/dashboard/national'
                    ? 'text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 className="h-4 w-4" />
                  Leadership
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${leadershipOpen ? 'rotate-180' : ''}`} />
              </button>
              {leadershipOpen && (
                <div className="ml-3 mt-1 space-y-1 border-l border-white/15 pl-3">
                  <Link
                    href="/dashboard/national"
                    onClick={() => setSidebarOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      pathname === '/dashboard/national'
                        ? 'bg-[#c9ec63] font-bold text-[#18312a]'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    National Director
                  </Link>
                  <Link
                    href="/dashboard/national#state-directors"
                    onClick={() => setSidebarOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    State Directors
                  </Link>
                  <Link
                    href="/dashboard/board-of-trustees"
                    onClick={() => setSidebarOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      pathname === '/dashboard/board-of-trustees'
                        ? 'bg-[#c9ec63] font-bold text-[#18312a]'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Board of Trustees
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link
            href="/"
            className="mt-1 flex rounded-lg px-3 py-3 text-sm text-white/55 hover:bg-white/10 hover:text-white"
          >
            Back to website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#18312a]/10 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-[#18312a]/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold">{workspaceLabel}</p>
              <p className="hidden text-xs text-[#718079] sm:block">SIDAAP operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#18312a]/15 px-3 py-2 text-xs font-bold hover:border-[#18312a]"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18312a] text-[10px] text-white">
                {user?.avatarInitials || 'S'}
              </span>
            )}
            <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} user={user} />
    </div>
  )
}
