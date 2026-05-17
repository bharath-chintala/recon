import type { Metadata } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import { Preloader } from '@/components/ui/Preloader'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['700', '800'],
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
    <html lang="en" className={`${geist.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
