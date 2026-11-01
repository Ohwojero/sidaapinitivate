import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteShell } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'SIDAAP — Smart Initiative for Drug Abuse Awareness & Prevention',
  description: 'Breaking the Chains: Prevention, Treatment and Recovery for All. Official platform of SIDAAP Nigeria (CAC RN: 8390984) and SIDAAP Football Academy Ltd.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#13231f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#f5f1e9] text-[#13231f] antialiased flex flex-col font-sans selection:bg-[#c9ec63] selection:text-[#13231f]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
