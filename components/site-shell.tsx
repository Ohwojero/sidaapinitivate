'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname?.startsWith('/dashboard') || pathname?.startsWith('/portal')

  // When inside /dashboard or /portal, hide public navbar, emergency banner and public footer completely
  if (isPortal) {
    return <main className="min-h-screen bg-[#0d1815]">{children}</main>
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  )
}
