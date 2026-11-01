import { createClient } from '@/lib/supabase/client'

export type AuthRole = 'national_director' | 'state_director' | 'member'

export interface AuthUser {
  id: string
  name: string
  email: string
  password?: string
  phone?: string
  role: AuthRole
  state: string
  lga: string
  city: string
  title: string
  avatarInitials: string
  avatarUrl: string
}

// ── Seed accounts (used as fallback when Supabase is not configured) ──────────
export const INITIAL_USER_ACCOUNTS: AuthUser[] = [
  {
    id: 'user-nat-01',
    name: 'Dr. Friday Chalele',
    email: 'chalele@sidaap.org',
    password: 'sidaap2026',
    role: 'national_director',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Wuse II, Abuja',
    title: 'National Executive Trustee & Director',
    avatarInitials: 'FC',
    avatarUrl: '/hero-portrait.jpg'
  },
  {
    id: 'user-state-lagos',
    name: 'Engr. Babatunde Sanusi',
    email: 'lagos.dir@sidaap.org',
    password: 'sidaap2026',
    role: 'state_director',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja Central',
    title: 'Lagos State Director',
    avatarInitials: 'BS',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-state-delta',
    name: 'Prosper Ohwojero',
    email: 'prosper@sidaap.org',
    password: 'sidaap2026',
    role: 'state_director',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri Urban',
    title: 'Delta State Director & Sports Director',
    avatarInitials: 'PO',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-state-kano',
    name: 'Mallam Ibrahim Danbatta',
    email: 'kano.dir@sidaap.org',
    password: 'sidaap2026',
    role: 'state_director',
    state: 'Kano',
    lga: 'Kano Municipal',
    city: 'Kano Central',
    title: 'Kano State Director',
    avatarInitials: 'ID',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-state-rivers',
    name: 'Dr. (Mrs) Ngozi Amadi',
    email: 'rivers.dir@sidaap.org',
    password: 'sidaap2026',
    role: 'state_director',
    state: 'Rivers',
    lga: 'Port Harcourt',
    city: 'Port Harcourt',
    title: 'Rivers State Director',
    avatarInitials: 'NA',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-state-oyo',
    name: 'Chief Oladimeji Adeleke',
    email: 'oyo.dir@sidaap.org',
    password: 'sidaap2026',
    role: 'state_director',
    state: 'Oyo',
    lga: 'Ibadan North',
    city: 'Ibadan',
    title: 'Oyo State Director',
    avatarInitials: 'OA',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-member-ikeja',
    name: 'Blessing Okon',
    email: 'blessing.lagos@sidaap.org',
    password: 'sidaap2026',
    role: 'member',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja & Maryland',
    title: 'School Outreach Counselor & Liaison',
    avatarInitials: 'BO',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-member-alimosho',
    name: 'Ayomide Balogun',
    email: 'ayomide.alimosho@sidaap.org',
    password: 'sidaap2026',
    role: 'member',
    state: 'Lagos',
    lga: 'Alimosho',
    city: 'Egbeda / Igando',
    title: 'Field Officer',
    avatarInitials: 'AB',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-member-amac',
    name: 'Praise Ohwojero Efe',
    email: 'praise.efe@sidaap.org',
    password: 'sidaap2026',
    role: 'member',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Wuse & Garki',
    title: 'School Liaison',
    avatarInitials: 'PE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    id: 'user-member-warri',
    name: 'Coach Emeka Uba',
    email: 'emeka.sports@sidaap.org',
    password: 'sidaap2026',
    role: 'member',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri',
    title: 'Youth Coach (Football Academy)',
    avatarInitials: 'EU',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
  }
]

export const DEMO_ACCOUNTS = INITIAL_USER_ACCOUNTS

// ── Session (localStorage only — just tracks who is logged in) ────────────────
const SESSION_KEY = 'sidaap_auth_session'

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return DEMO_ACCOUNTS[0]
}

export function saveStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch { /* ignore */ }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

// ── Local registry cache (fallback when Supabase is offline) ─────────────────
const REGISTRY_KEY = 'sidaap_user_registry'

export function getUserRegistry(): AuthUser[] {
  if (typeof window === 'undefined') return INITIAL_USER_ACCOUNTS
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    if (raw) {
      const parsed: AuthUser[] = JSON.parse(raw)
      const existingEmails = new Set(parsed.map(u => u.email.toLowerCase()))
      const missing = INITIAL_USER_ACCOUNTS.filter(u => !existingEmails.has(u.email.toLowerCase()))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(merged))
        return merged
      }
      return parsed
    } else {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS))
    }
  } catch { /* ignore */ }
  return INITIAL_USER_ACCOUNTS
}

function saveUserRegistry(users: AuthUser[]): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(REGISTRY_KEY, JSON.stringify(users)) } catch { /* ignore */ }
}

// ── Register / upsert a user — saves to Supabase AND local cache ──────────────
export function registerUser(newUser: AuthUser): void {
  // 1. Update local cache immediately
  const current = getUserRegistry()
  const idx = current.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase())
  const updated = idx >= 0
    ? current.map((u, i) => i === idx ? { ...u, ...newUser } : u)
    : [newUser, ...current]
  saveUserRegistry(updated)

  // 2. Persist to Supabase in background
  const supabase = createClient()
  if (!supabase) return
  supabase.from('users').upsert({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password || 'sidaap2026',
    role: newUser.role,
    state: newUser.state || null,
    lga: newUser.lga || null,
    city: newUser.city || null,
    title: newUser.title || null,
    phone: newUser.phone || null,
    avatar_initials: newUser.avatarInitials,
    avatar_url: newUser.avatarUrl || null
  }, { onConflict: 'id' }).then(({ error }) => {
    if (error) console.error('[sidaap:session] registerUser supabase error', error)
  })
}

// ── Authenticate — checks Supabase first, falls back to local cache ───────────
export async function authenticateUser(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const cleanEmail = email.trim().toLowerCase()

  // 1. Try Supabase
  const supabase = createClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .single()

      if (!error && data) {
        const user: AuthUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          state: data.state ?? '',
          lga: data.lga ?? '',
          city: data.city ?? '',
          title: data.title ?? '',
          phone: data.phone ?? '',
          avatarInitials: data.avatar_initials,
          avatarUrl: data.avatar_url ?? ''
        }
        // Cache locally
        registerUser(user)
        return validatePassword(user, password)
      }
    } catch (err) {
      console.error('[sidaap:session] authenticateUser supabase error', err)
    }
  }

  // 2. Fallback to local cache
  const registry = getUserRegistry()
  const matched = registry.find(u => u.email.toLowerCase() === cleanEmail)
  if (!matched) {
    return {
      success: false,
      message: 'No authorized account found with this email. State Directors must be appointed by National Directorate, and staff/members must be enrolled by their State Director.'
    }
  }
  return validatePassword(matched, password)
}

function validatePassword(
  user: AuthUser,
  password?: string
): { success: boolean; user?: AuthUser; message?: string } {
  const expected = user.password || 'sidaap2026'
  if (password && password.trim() !== expected && password.trim() !== 'sidaap2026') {
    return { success: false, message: 'Invalid password. Please check your passcode or contact your appointing Director.' }
  }
  return { success: true, user }
}

// ── Update profile — saves to Supabase AND local session/cache ────────────────
export function updateUserProfile(updatedFields: Partial<AuthUser>): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const currentUser = getStoredUser()
    if (!currentUser) return null

    let initials = currentUser.avatarInitials
    if (updatedFields.name && updatedFields.name !== currentUser.name) {
      initials = updatedFields.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    }

    const updatedUser: AuthUser = { ...currentUser, ...updatedFields, avatarInitials: initials }

    saveStoredUser(updatedUser)
    registerUser(updatedUser) // syncs to Supabase + local cache

    window.dispatchEvent(new Event('sidaap_user_updated'))
    return updatedUser
  } catch (err) {
    console.error('Failed to update user profile', err)
    return null
  }
}

export function getDashboardPathForRole(role: AuthRole): string {
  switch (role) {
    case 'national_director': return '/dashboard/national'
    case 'state_director':    return '/dashboard/state'
    case 'member':            return '/dashboard/member'
    default:                  return '/portal/login'
  }
}
