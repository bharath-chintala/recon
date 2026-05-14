import type { Metadata } from 'next'
import InitiativesPage from '@/_pages/Initiatives'

export const metadata: Metadata = {
  title: 'Initiatives',
  description: 'Explore Recon International\'s four flagship programmes driving global cultural diplomacy and heritage preservation.',
}

export default function Initiatives() {
  return <InitiativesPage />
}
