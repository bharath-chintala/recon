import type { Metadata } from 'next'
import ContactPage from '@/_pages/Contact'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Recon International — enquiries, partnerships, press, and programme collaborations welcome.',
}

export default function Contact() {
  return <ContactPage />
}
