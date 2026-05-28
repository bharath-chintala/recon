// app/page.tsx — Home route
// Re-exports the Home page component from src/pages/
import type { Metadata } from 'next'
import HomePageComponent from '@/_pages/Home'

export const metadata: Metadata = {
  title: 'Home — Cultural Diplomacy & Heritage Preservation',
  description:
    'Recon International Charitable Trust — bridging cultures and shaping the future through cultural diplomacy, spiritual tourism, heritage preservation, and people-to-people connections across 60+ nations.',
  keywords: [
    'Recon International home',
    'cultural diplomacy India',
    'heritage preservation trust',
    'India cultural exchange',
    'spiritual tourism',
    'people-to-people diplomacy',
    'IIIRRC Trust',
    'Hyderabad cultural trust',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Recon International — Bridging Cultures, Shaping the Future',
    description:
      'A global trust dedicated to cultural diplomacy, heritage preservation, and people-to-people connections across 60+ nations.',
    url: '/',
  },
}

export default function HomePage() {
  return <HomePageComponent />
}
