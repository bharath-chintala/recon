import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Recon International',
    default: 'Recon International — Bridging Cultures, Shaping the Future',
  },
  description:
    'Recon International is a global trust dedicated to cultural diplomacy, heritage preservation, and people-to-people connections across 60+ nations.',
  keywords: [
    'cultural diplomacy',
    'heritage preservation',
    'Recon International',
    'cultural exchange',
    'intangible heritage',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Recon International',
    title: 'Recon International — Bridging Cultures, Shaping the Future',
    description:
      'A global trust dedicated to cultural diplomacy and heritage preservation across 60+ nations.',
  },
}

import { SmoothScroll } from '@/components/ui/SmoothScroll'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <SmoothScroll>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
