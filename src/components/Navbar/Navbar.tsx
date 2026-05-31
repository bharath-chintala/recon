'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
import { motion, useScroll } from 'framer-motion'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Contact', href: '/contact' },
]

const ABOUT_MEGA = {
  columns: [
    {
      heading: 'Organisation',
      links: [
        { label: 'Our Mission', href: '/about#mission', desc: 'What drives us' },
        { label: 'Our History', href: '/about#history', desc: '30 years of service' },
        { label: 'Trust Members', href: '/about#members', desc: 'Leadership & governance' },
      ],
    },
  ],
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [inHero, setInHero] = useState(true)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  const shouldHide = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      if (pathname === '/') {
        // Hero wrapper is 250vh, so we transition around 2.2vh
        setInHero(y < (window.innerHeight * 2.2))
      } else {
        setInHero(false)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (shouldHide) return null

  // It's transparent only if on the homepage AND still within the hero section
  const isTransparent = pathname === '/' && inHero

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isTransparent
          ? 'bg-transparent border-transparent'
          : 'bg-warm-ivory/80 border-b border-royal/15 shadow-sm backdrop-blur-md'
          }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Recon International — Home"
          >
            <Image
              src="/images/recon-logo.webp"
              alt="Recon Logo"
              width={70}
              height={70}
              className={`transition-all duration-300 group-hover:scale-105 ${isTransparent ? 'brightness-0 invert' : ''
                }`}
            />
            <div className="flex flex-col leading-none">
              <span className={`text-[17px] font-logo font-extrabold uppercase tracking-wide transition-colors ${isTransparent ? 'text-white group-hover:text-white/80' : 'text-royal group-hover:text-[#17A3FF]'
                }`}>
                recon
              </span>
              <span className={`text-[12px] font-logo font-bold uppercase tracking-[0.18em] mt-0.5 transition-colors ${isTransparent ? 'text-white/80' : 'text-royal'
                }`}>
                International
              </span>
              <h5 className={`text-[9px] font-logo font-semibold uppercase tracking-[0.12em] mt-1 transition-colors ${isTransparent ? 'text-white/70' : 'text-royal/70'
                }`}>
                Charitable Trust
              </h5>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              const isAbout = link.label === 'About'

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => isAbout && setAboutOpen(true)}
                  onMouseLeave={() => isAbout && setAboutOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-bold transition-colors ${isTransparent
                      ? active
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                      : active
                        ? 'text-[#17A3FF]'
                        : 'text-royal/80 hover:text-[#17A3FF]'
                      }`}
                  >
                    {link.label}
                    {isAbout && (
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-200"
                        style={{ transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                      </svg>
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className={`absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isTransparent ? 'bg-white' : 'bg-[#17A3FF]'
                          }`}
                      />
                    )}
                  </Link>

                  {isAbout && (
                    <MegaMenu columns={ABOUT_MEGA.columns} isOpen={aboutOpen} />
                  )}
                </div>
              )
            })}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isTransparent
                ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                : 'border-royal/20 text-royal hover:border-[#17A3FF] hover:text-[#17A3FF]'
                }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        links={NAV_LINKS}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  )
}

export default Navbar

