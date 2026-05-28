import type { Metadata } from 'next'
import AboutPage from '@/_pages/About'

export const metadata: Metadata = {
  title: 'About Us — Our Mission, History & Leadership',
  description:
    'Learn about Recon International Charitable Trust — our mission in cultural diplomacy, our history spanning 60+ nations, and the trust members driving heritage preservation under the aegis of IIIRRC Trust.',
  keywords: [
    'about Recon International',
    'Recon International history',
    'K Chandra Shekher Rao',
    'IIIRRC Trust',
    'Managing Trustee',
    'cultural diplomacy mission',
    'heritage preservation India',
    'trust members',
    'Telangana cultural trust',
    'Andhra Pradesh cultural organisation',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Recon International — Our Mission & History',
    description:
      'Learn about our mission in cultural diplomacy, our history, and the trust members shaping cultural diplomacy worldwide.',
    url: '/about',
  },
}

export default function About() {
  return <AboutPage />
}
