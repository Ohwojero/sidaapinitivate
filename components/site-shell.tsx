'use client'

import { usePathname } from 'next/navigation'
import { EmergencyBanner } from '@/components/emergency-banner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LiveChatWidget } from '@/components/live-chat-widget'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname?.startsWith('/dashboard') || pathname?.startsWith('/portal')

  // When inside /dashboard or /portal, hide public navbar, emergency banner and public footer completely
  if (isPortal) {
    return <main className="min-h-screen bg-[#0d1815]">{children}</main>
  }

  return (
    <>
      <EmergencyBanner />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <LiveChatWidget />
    </>
  )
}
