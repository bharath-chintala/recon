import type { Metadata } from 'next'
import EventsPage from '@/_pages/Events'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming summits, festivals, workshops, and cultural exchanges hosted by Recon International worldwide.',
}

export default function Events() {
  return <EventsPage />
}
