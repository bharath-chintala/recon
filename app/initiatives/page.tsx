import type { Metadata } from 'next'
import InitiativesPage from '@/_pages/Initiatives'

export const metadata: Metadata = {
  title: 'Initiatives — Flagship Cultural Diplomacy Programmes',
  description:
    'Explore Recon International\'s four flagship programmes: cultural exchange delegations, spiritual tourism, heritage preservation, and humanitarian social impact initiatives across 60+ nations.',
  keywords: [
    'Recon International initiatives',
    'cultural diplomacy programmes',
    'heritage preservation initiatives',
    'spiritual tourism programme',
    'humanitarian initiatives India',
    'social impact India',
    'pilgrimage tours',
    'trade facilitation India',
    'cultural exchange delegations',
    'intangible cultural heritage',
    'visually impaired support India',
  ],
  alternates: {
    canonical: '/initiatives',
  },
  openGraph: {
    title: 'Initiatives — Recon International Flagship Programmes',
    description:
      'Four flagship programmes driving global cultural diplomacy and heritage preservation.',
    url: '/initiatives',
  },
}

export default function Initiatives() {
  return <InitiativesPage />
}
