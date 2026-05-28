import type { Metadata } from 'next'
import EventsPage from '@/_pages/Events'

export const metadata: Metadata = {
  title: 'Events — Summits, Festivals & Cultural Exchanges',
  description:
    'Explore past and upcoming cultural summits, heritage festivals, spiritual pilgrimages, trade exhibitions, and international cultural exchanges organised by Recon International.',
  keywords: [
    'Recon International events',
    'cultural exchange events',
    'heritage festivals India',
    'Ugadi celebrations',
    'Bathukamma festival',
    'Kuchipudi dance international',
    'Perini dance',
    'spiritual pilgrimage events',
    'India trade exhibitions',
    'international cultural summit',
    'Golden Jubilee celebrations',
    'Telugu Sangham events',
    'Malaysia cultural events',
    'Sri Lanka cultural exchange',
  ],
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Events — Recon International Cultural Exchanges & Festivals',
    description:
      'Upcoming summits, festivals, workshops, and cultural exchanges hosted by Recon International worldwide.',
    url: '/events',
  },
}

export default function Events() {
  return <EventsPage />
}
