import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recon International Charitable Trust',
    short_name: 'Recon Intl',
    description:
      'A global trust dedicated to cultural diplomacy, heritage preservation, and people-to-people connections across 60+ nations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1526',
    theme_color: '#0b1526',
    icons: [
      {
        src: '/images/recon-logo.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/images/recon-logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  }
}
