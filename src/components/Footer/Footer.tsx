import Link from 'next/link'
import Image from 'next/image'

const LINKS = {
  Organisation: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Our History', href: '/about#history' },
    { label: 'Trust Members', href: '/about#members' },
  ],
  Initiatives: [
    { label: 'Awaken Through Travel', href: '/initiatives' },
    { label: 'Journeys of the Soul', href: '/initiatives' },
    { label: 'Sacred Paths', href: '/initiatives' },
    { label: 'Global Impact', href: '/initiatives' },
  ],
  Connect: [
    { label: 'Upcoming Events', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Partner With Us', href: '/contact#partner' },
    { label: 'Get Involved', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0b1526] text-[#f5f0e8]">
      {/* Top wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="block h-12 w-full"
          aria-hidden
        >
          <path
            d="M0,30 C300,60 900,0 1200,30 L1200,0 L0,0 Z"
            fill="#0a1420"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-12">
        <div className="grid gap-12 grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2.5 group"
            >
              <Image
                src="/images/recon-logo.png"
                alt="Recon Logo"
                width={56}
                height={56}
              />
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold uppercase tracking-wide text-white">
                  recon
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8bb8e8]">
                  International
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#d4c8b4] max-w-xs mt-4">
              A global trust dedicated to cultural diplomacy, heritage
              preservation, and people-to-people connections across 60+ nations.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {['𝕏', 'in', 'f', '▶'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-[#e8e0d4] hover:border-[#335C8B] hover:text-white transition-colors"
                  aria-label={`Social: ${icon}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#f5f0e8]">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#d4c8b4] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-[#a89b87]">
            © {new Date().getFullYear()} Recon International Trust. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-[#a89b87] hover:text-[#f5f0e8] transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
