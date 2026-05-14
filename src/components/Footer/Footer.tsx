import Link from 'next/link'

const LINKS = {
  Organisation: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Trust Members', href: '/about#members' },
    { label: 'Annual Report', href: '/about#report' },
  ],
  Programmes: [
    { label: 'Heritage Fund', href: '/initiatives#heritage' },
    { label: 'Youth Ambassadors', href: '/initiatives#youth' },
    { label: 'Digital Archive', href: '/initiatives#digital' },
    { label: 'Diplomacy Academy', href: '/initiatives#academy' },
  ],
  Connect: [
    { label: 'Upcoming Events', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Press & Media', href: '/contact#press' },
    { label: 'Partner With Us', href: '/contact#partner' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
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
            fill="#0c0a09"
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white text-sm font-bold">
                RI
              </div>
              <span className="text-base font-bold text-white">
                Recon International
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs mt-4">
              A global trust dedicated to cultural diplomacy, heritage
              preservation, and people-to-people connections across 60+ nations.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {['𝕏', 'in', 'f', '▶'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-stone-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
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
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-amber-500">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-500 hover:text-white transition-colors"
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
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Recon International Trust. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
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
