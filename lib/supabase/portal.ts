/**
 * SIDAAP Portal Data Service (Supabase + Local Fallback)
 * Handles: users, state_directors, state_staff, state_activities, national_directives
 */

import { createClient } from './client'
import {
  StateDirector,
  StateStaffMember,
  StateActivity,
  NationalDirective,
  getStoredDirectors,
  saveStoredDirectors,
  getStoredStaff,
  saveStoredStaff,
  getStoredActivities,
  saveStoredActivities,
  INITIAL_NATIONAL_DIRECTIVES
} from '@/lib/data/portal-data'
import { AuthUser, getUserRegistry, registerUser } from '@/lib/auth/session'

// ── Users ─────────────────────────────────────────────────────────────────────

export async function syncUserToSupabase(user: AuthUser): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password || 'sidaap2026',
      role: user.role,
      state: user.state || null,
      lga: user.lga || null,
      city: user.city || null,
      title: user.title || null,
      phone: user.phone || null,
      avatar_initials: user.avatarInitials,
      avatar_url: user.avatarUrl || null
    }, { onConflict: 'id' })
  } catch (err) {
    console.error('[sidaap:portal] syncUserToSupabase error', err)
  }
}

export async function fetchUsersFromSupabase(): Promise<AuthUser[]> {
  const supabase = createClient()
  if (!supabase) return getUserRegistry()
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error || !data || data.length === 0) return getUserRegistry()
    return data.map((u: any): AuthUser => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role,
      state: u.state ?? '',
      lga: u.lga ?? '',
      city: u.city ?? '',
      title: u.title ?? '',
      phone: u.phone ?? '',
      avatarInitials: u.avatar_initials,
      avatarUrl: u.avatar_url ?? ''
    }))
  } catch (err) {
    console.error('[sidaap:portal] fetchUsersFromSupabase error', err)
    return getUserRegistry()
  }
}

// ── State Directors ───────────────────────────────────────────────────────────

export async function fetchDirectors(): Promise<StateDirector[]> {
  const supabase = createClient()
  if (!supabase) return getStoredDirectors()
  try {
    const { data, error } = await supabase
      .from('state_directors')
      .select('*')
      .order('created_at', { ascending: true })
    if (error || !data || data.length === 0) return getStoredDirectors()
    const directors: StateDirector[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone ?? '',
      state: d.state,
      lga: d.lga ?? '',
      city: d.city ?? '',
      appointedDate: d.appointed_date,
      status: d.status,
      staffCount: d.staff_count,
      facilitiesCount: d.facilities_count,
      outreachCount: d.outreach_count,
      avatarUrl: d.avatar_url ?? undefined
    }))
    saveStoredDirectors(directors)
    return directors
  } catch (err) {
    console.error('[sidaap:portal] fetchDirectors error', err)
    return getStoredDirectors()
  }
}

export async function updateDirector(director: StateDirector): Promise<void> {
  const current = getStoredDirectors()
  saveStoredDirectors(current.map(d => d.id === director.id ? director : d))

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_directors').update({
      name: director.name,
      email: director.email,
      phone: director.phone || null,
      state: director.state,
      lga: director.lga || null,
      city: director.city || null,
      status: director.status,
      avatar_url: director.avatarUrl || null
    }).eq('id', director.id)

    // Also update the linked user account
    await supabase.from('users').update({
      name: director.name,
      email: director.email,
      phone: director.phone || null,
      state: director.state,
      lga: director.lga || null,
      city: director.city || null,
      avatar_initials: director.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    }).eq('email', director.email)
  } catch (err) {
    console.error('[sidaap:portal] updateDirector error', err)
  }
}

export async function deleteDirector(directorId: string, email: string): Promise<void> {
  saveStoredDirectors(getStoredDirectors().filter(d => d.id !== directorId))

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_directors').delete().eq('id', directorId)
    await supabase.from('users').delete().eq('email', email)
  } catch (err) {
    console.error('[sidaap:portal] deleteDirector error', err)
  }
}

export async function addDirector(director: StateDirector, user: AuthUser): Promise<void> {
  // 1. Save locally immediately
  const current = getStoredDirectors()
  saveStoredDirectors([director, ...current])
  registerUser(user)

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_directors').upsert({
      id: director.id,
      name: director.name,
      email: director.email,
      phone: director.phone || null,
      state: director.state,
      lga: director.lga || null,
      city: director.city || null,
      appointed_date: director.appointedDate,
      status: director.status,
      staff_count: director.staffCount,
      facilities_count: director.facilitiesCount,
      outreach_count: director.outreachCount,
      avatar_url: director.avatarUrl || null
    }, { onConflict: 'id' })

    await syncUserToSupabase(user)
  } catch (err) {
    console.error('[sidaap:portal] addDirector error', err)
  }
}

// ── State Staff ───────────────────────────────────────────────────────────────

export async function fetchStaff(): Promise<StateStaffMember[]> {
  const supabase = createClient()
  if (!supabase) return getStoredStaff()
  try {
    const { data, error } = await supabase
      .from('state_staff')
      .select('*')
      .order('created_at', { ascending: true })
    if (error || !data || data.length === 0) return getStoredStaff()
    const staff: StateStaffMember[] = data.map((s: any) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone ?? '',
      state: s.state,
      lga: s.lga,
      city: s.city ?? '',
      roleTitle: s.role_title,
      joinedDate: s.joined_date,
      assignedDirector: s.assigned_director,
      status: s.status,
      avatarUrl: s.avatar_url ?? undefined
    }))
    saveStoredStaff(staff)
    return staff
  } catch (err) {
    console.error('[sidaap:portal] fetchStaff error', err)
    return getStoredStaff()
  }
}

export async function updateStaffMember(member: StateStaffMember): Promise<void> {
  const current = getStoredStaff()
  saveStoredStaff(current.map(s => s.id === member.id ? member : s))

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_staff').update({
      name: member.name,
      email: member.email,
      phone: member.phone || null,
      lga: member.lga,
      city: member.city || null,
      role_title: member.roleTitle,
      status: member.status,
      avatar_url: member.avatarUrl || null
    }).eq('id', member.id)

    await supabase.from('users').update({
      name: member.name,
      email: member.email,
      phone: member.phone || null,
      lga: member.lga,
      city: member.city || null,
      title: member.roleTitle,
      avatar_initials: member.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    }).eq('email', member.email)
  } catch (err) {
    console.error('[sidaap:portal] updateStaffMember error', err)
  }
}

export async function deleteStaffMember(memberId: string, email: string): Promise<void> {
  saveStoredStaff(getStoredStaff().filter(s => s.id !== memberId))

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_staff').delete().eq('id', memberId)
    await supabase.from('users').delete().eq('email', email)
  } catch (err) {
    console.error('[sidaap:portal] deleteStaffMember error', err)
  }
}

export async function addStaffMember(member: StateStaffMember, user: AuthUser): Promise<void> {
  // 1. Save locally immediately
  const current = getStoredStaff()
  saveStoredStaff([member, ...current])
  registerUser(user)

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_staff').upsert({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone || null,
      state: member.state,
      lga: member.lga,
      city: member.city || null,
      role_title: member.roleTitle,
      joined_date: member.joinedDate,
      assigned_director: member.assignedDirector,
      status: member.status,
      avatar_url: member.avatarUrl || null
    }, { onConflict: 'id' })

    await syncUserToSupabase(user)
  } catch (err) {
    console.error('[sidaap:portal] addStaffMember error', err)
  }
}

// ── State Activities ──────────────────────────────────────────────────────────

export async function fetchActivities(): Promise<StateActivity[]> {
  const supabase = createClient()
  if (!supabase) return getStoredActivities()
  try {
    const { data, error } = await supabase
      .from('state_activities')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return getStoredActivities()
    const activities: StateActivity[] = data.map((a: any) => ({
      id: a.id,
      title: a.title,
      state: a.state,
      lga: a.lga,
      city: a.city ?? '',
      category: a.category,
      date: a.date,
      reportedBy: a.reported_by,
      studentsReached: a.students_reached ?? undefined,
      booksDistributed: a.books_distributed ?? undefined,
      status: a.status,
      notes: a.notes ?? ''
    }))
    saveStoredActivities(activities)
    return activities
  } catch (err) {
    console.error('[sidaap:portal] fetchActivities error', err)
    return getStoredActivities()
  }
}

export async function addActivity(activity: StateActivity): Promise<void> {
  // 1. Save locally immediately
  const current = getStoredActivities()
  saveStoredActivities([activity, ...current])

  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('state_activities').insert({
      id: activity.id,
      title: activity.title,
      state: activity.state,
      lga: activity.lga,
      city: activity.city || null,
      category: activity.category,
      date: activity.date,
      reported_by: activity.reportedBy,
      students_reached: activity.studentsReached ?? null,
      books_distributed: activity.booksDistributed ?? null,
      status: activity.status,
      notes: activity.notes || null
    })
  } catch (err) {
    console.error('[sidaap:portal] addActivity error', err)
  }
}

// ── National Directives ───────────────────────────────────────────────────────

export async function fetchDirectives(): Promise<NationalDirective[]> {
  const supabase = createClient()
  if (!supabase) return INITIAL_NATIONAL_DIRECTIVES
  try {
    const { data, error } = await supabase
      .from('national_directives')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return INITIAL_NATIONAL_DIRECTIVES
    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      issuedBy: d.issued_by,
      date: new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      priority: d.priority,
      content: d.content,
      targetScope: d.target_scope,
      upcomingEventDate: d.upcoming_event_date ?? undefined
    }))
  } catch (err) {
    console.error('[sidaap:portal] fetchDirectives error', err)
    return INITIAL_NATIONAL_DIRECTIVES
  }
}

export async function addDirective(directive: NationalDirective): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  try {
    await supabase.from('national_directives').insert({
      id: directive.id,
      title: directive.title,
      issued_by: directive.issuedBy,
      priority: directive.priority,
      content: directive.content,
      target_scope: directive.targetScope,
      upcoming_event_date: directive.upcomingEventDate || null
    })
  } catch (err) {
    console.error('[sidaap:portal] addDirective error', err)
  }
}
