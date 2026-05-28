import type { Metadata } from 'next'
import ContactPage from '@/_pages/Contact'

export const metadata: Metadata = {
  title: 'Contact Us — Partnerships & Enquiries',
  description:
    'Get in touch with Recon International Charitable Trust — enquiries, partnerships, press, cultural programme collaborations, and sponsorship opportunities. Based in Hyderabad, Telangana.',
  keywords: [
    'contact Recon International',
    'Recon International Hyderabad',
    'cultural trust contact',
    'partnership enquiry',
    'cultural collaboration India',
    'press enquiry cultural trust',
    'sponsorship cultural events',
    'Telangana cultural organisation contact',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Recon International — Partnerships & Enquiries',
    description:
      'Get in touch with Recon International — enquiries, partnerships, press, and programme collaborations welcome.',
    url: '/contact',
  },
}

export default function Contact() {
  return <ContactPage />
}
