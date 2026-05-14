import type { Metadata } from 'next'
import AboutPage from '@/_pages/About'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Recon International — our mission, history, and the trust members shaping cultural diplomacy worldwide.',
}

export default function About() {
  return <AboutPage />
}
