'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDashboardPathForRole, getStoredUser } from '@/lib/auth/session'

export default function DashboardIndexRouter() {
  const router = useRouter()

  useEffect(() => {
    const user = getStoredUser()
    router.replace(user ? getDashboardPathForRole(user.role) : '/portal/login')
  }, [router])

  return null
}
