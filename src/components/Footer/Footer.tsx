'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LINKS = {
  Organisation: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Our History', href: '/about#history' },
    { label: 'Trust Members', href: '/about#members' },
  ],
  Initiatives: [
    { label: 'Awaken Through Travel', href: '/events' },
    { label: 'Journeys of the Soul', href: '/events' },
    { label: 'Sacred Paths', href: '/events' },
    { label: 'Global Impact', href: '/events' },
  ],
  Connect: [
    { label: 'Upcoming Events', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Partner With Us', href: '/contact#partner' },
    { label: 'Get Involved', href: '/contact' },
  ],
}

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null
  }

  return (
    <footer className="relative bg-[#000435] border-t border-white/10 overflow-hidden">
      {/* Calm cinematic fog fade-in */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-warm-ivory/10 to-transparent opacity-40"
        aria-hidden
      />
      <div className="cinematic-fg-particle pointer-events-none absolute left-[20%] top-[30%] h-1 w-1 rounded-full bg-amber-200/15" aria-hidden />
      <div
        className="cinematic-fg-particle pointer-events-none absolute right-[25%] bottom-[40%] h-0.5 w-0.5 rounded-full bg-white/10 [animation-delay:3s]"
        aria-hidden
      />

      {/* Delicate Royal Separation Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative Traditional Circular Silhouette in Footer Corner */}
      <div className="absolute bottom-4 left-4 w-48 h-48 opacity-[0.12] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-white w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-12 relative z-10">
        <div className="grid gap-12 grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Mission Statement */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-3 group"
            >
              <Image
                src="/images/recon-logo.webp"
                alt="Recon Logo"
                width={64}
                height={64}
                className="transition-transform duration-500 group-hover:scale-105 filter brightness-100"
              />
              <div className="flex flex-col leading-none">
                <span className="font-logo text-[18px] font-extrabold uppercase tracking-wide text-white">
                  recon
                </span>
                <span className="font-logo text-[10px] font-bold uppercase tracking-[0.2em] text-white mt-0.5">
                  International
                </span>
                <h5 className="font-logo text-[8.5px] font-semibold uppercase tracking-[0.12em] text-white/80 mt-1">
                  Charitable Trust
                </h5>
              </div>
            </Link>
            
            <p className="text-xs md:text-sm leading-relaxed text-white/60 max-w-xs mt-4 font-light text-justify">
              A global trust dedicated to cultural diplomacy, heritage
              preservation, and people-to-people connections across 60+ nations.
            </p>
            
            {/* Animated Dark/Light Glassmorphic Social Icons */}
            <div className="mt-8 flex gap-3">
              {[
                { name: '𝕏', icon: '𝕏' },
                { name: 'LinkedIn', icon: 'in' },
                { name: 'Facebook', icon: 'f' },
                { name: 'YouTube', icon: '▶' }
              ].map((soc) => (
                <a
                  key={soc.name}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-[#17A3FF] hover:text-white hover:border-[#17A3FF] hover:scale-105 hover:shadow-md transition-all duration-300"
                  aria-label={`Social Link: ${soc.name}`}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-6 font-cinzel text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs md:text-sm text-white/60 hover:text-[#17A3FF] hover:translate-x-1 inline-block transition-all duration-300 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright and legal bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[10px] md:text-xs text-white/40 font-light">
            © {new Date().getFullYear()} Recon International Trust. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[10px] md:text-xs text-white/40 hover:text-[#17A3FF] transition-colors duration-300 font-light"
                >
                  {item}
                </Link>
              )
            )}
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-[10px] md:text-xs text-white/40 hover:text-[#17A3FF] transition-colors duration-300 font-light"
            >
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
