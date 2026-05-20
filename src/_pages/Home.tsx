// Home page — continuous cinematic spiritual universe
import { HeroSection } from '@/components/Hero/HeroSection'
import {
  AboutPreview,
  ImpactStats,
  CorePillars,
  GlobalMap,
  MilestonesPreview,
  GalleryPreview,
  Testimonials,
  CtaSection,
} from '@/components/sections'
import { CinematicWorld, CinematicSection, SectionBridge } from '@/components/cinematic'
import { UpcomingEventsPopup } from '@/components/ui/UpcomingEventsPopup'

export default function Home() {
  return (
    <main className="cinematic-home relative overflow-x-hidden">
      <UpcomingEventsPopup />
      <CinematicWorld>
        <HeroSection />

        <SectionBridge warmth={0.15} />
        <CinematicSection depth={0.55} warmth={0.12}>
          <AboutPreview />
        </CinematicSection>

        <SectionBridge warmth={0.22} />
        <CinematicSection depth={0.5} warmth={0.2}>
          <ImpactStats />
        </CinematicSection>

        <SectionBridge warmth={0.28} />
        <CinematicSection depth={0.48} warmth={0.25}>
          <CorePillars />
        </CinematicSection>

        <SectionBridge warmth={0.32} />
        <CinematicSection depth={0.52} warmth={0.3}>
          <GlobalMap />
        </CinematicSection>

        <SectionBridge warmth={0.38} />
        <CinematicSection depth={0.5} warmth={0.35}>
          <MilestonesPreview />
        </CinematicSection>

        <SectionBridge warmth={0.42} />
        <CinematicSection depth={0.48} warmth={0.4}>
          <GalleryPreview />
        </CinematicSection>

        <SectionBridge warmth={0.48} />
        <CinematicSection depth={0.45} warmth={0.45}>
          <Testimonials />
        </CinematicSection>

        <SectionBridge warmth={0.55} />
        <CinematicSection depth={0.5} warmth={0.62}>
          <CtaSection />
        </CinematicSection>
      </CinematicWorld>
    </main>
  )
}
