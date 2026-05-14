// Home page — assembles all homepage sections
import { HeroSection } from '@/components/Hero/HeroSection'
import { AboutPreview } from '@/components/sections/AboutPreview'
import { GlobalMap } from '@/components/sections/GlobalMap'
import { MilestonesPreview } from '@/components/sections/MilestonesPreview'
import { Testimonials } from '@/components/sections/Testimonials'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutPreview />
      <GlobalMap />
      <MilestonesPreview />
      <Testimonials />
    </main>
  )
}
