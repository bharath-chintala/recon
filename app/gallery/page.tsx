import type { Metadata } from 'next'
import GalleryPage from '@/_pages/Gallery'

export const metadata: Metadata = {
  title: 'Gallery — Recon International',
  description: 'Explore moments captured from our cultural events, spiritual celebrations, and international humanitarian initiatives across the globe.',
}

export default function Gallery() {
  return <GalleryPage />
}
