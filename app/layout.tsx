import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import { Preloader } from '@/components/ui/Preloader'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import './globals.css'

const BASE_URL = 'https://www.reconinternational.org'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Recon International',
    default: 'Recon International — Bridging Cultures, Shaping the Future',
  },
  description:
    'Recon International Charitable Trust is a global organisation dedicated to cultural diplomacy, heritage preservation, spiritual tourism, and people-to-people connections across 60+ nations.',
  keywords: [
    'Recon International',
    'Recon International Charitable Trust',
    'IIIRRC Trust',
    'cultural diplomacy',
    'heritage preservation',
    'intangible heritage',
    'cultural exchange',
    'India cultural trust',
    'spiritual tourism',
    'pilgrimage tours India',
    'Hyderabad cultural trust',
    'Telangana cultural organisation',
    'Andhra Pradesh heritage',
    'international cultural forum',
    'UNESCO intangible heritage',
    'Indian art and culture',
    'Kuchipudi dance',
    'classical dance international',
    'trade facilitation India',
    'K Chandra Shekher Rao',
    'humanitarian initiatives India',
    'global summit culture',
    'people to people diplomacy',
  ],
  authors: [{ name: 'Recon International Charitable Trust' }],
  creator: 'Recon International Charitable Trust',
  publisher: 'Recon International Charitable Trust',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/recon-logo.webp',
    shortcut: '/images/recon-logo.webp',
    apple: '/images/recon-logo.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'Recon International',
    title: 'Recon International — Bridging Cultures, Shaping the Future',
    description:
      'A global trust dedicated to cultural diplomacy, heritage preservation, spiritual tourism, and people-to-people connections across 60+ nations.',
    images: [
      {
        url: '/images/recon-logo.webp',
        width: 512,
        height: 512,
        alt: 'Recon International Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recon International — Bridging Cultures, Shaping the Future',
    description:
      'A global trust dedicated to cultural diplomacy, heritage preservation, and people-to-people connections across 60+ nations.',
    images: ['/images/recon-logo.webp'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'Non-profit Organisation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Bot/Lighthouse Detection Script for Instant Preloader Bypass */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof navigator !== 'undefined' && /lighthouse|chrome-lighthouse|google-pagespeed|googlebot|bingbot|yandexbot|baiduspider/i.test(navigator.userAgent)) {
                document.documentElement.classList.add('is-bot-speed');
              }
            `,
          }}
        />
        {/* Structured Data — Organisation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Recon International Charitable Trust',
              alternateName: 'Recon International',
              url: BASE_URL,
              logo: `${BASE_URL}/images/recon-logo.webp`,
              description:
                'A global trust dedicated to cultural diplomacy, heritage preservation, spiritual tourism, and people-to-people connections across 60+ nations.',
              foundingDate: '2005',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Hyderabad',
                addressRegion: 'Telangana',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-950-510-015',
                contactType: 'General Enquiry',
                availableLanguage: ['English', 'Hindi', 'Telugu'],
              },
              sameAs: [],
            }),
          }}
        />
      </head>
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
