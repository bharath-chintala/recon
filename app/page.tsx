// app/page.tsx — Home route
// Re-exports the Home page component from src/pages/
import type { Metadata } from 'next'
import HomePageComponent from '@/_pages/Home'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return <HomePageComponent />
}
