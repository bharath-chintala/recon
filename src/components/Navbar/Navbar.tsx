'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
import { motion, useScroll, useTransform } from 'framer-motion'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Contact', href: '/contact' },
]

const ABOUT_MEGA = {
  columns: [
    {
      heading: 'Organisation',
      links: [
        { label: 'Our Mission', href: '/about#mission', desc: 'What drives us' },
        { label: 'Our History', href: '/about#history', desc: '25 years of service' },
        { label: 'Trust Members', href: '/about#members', desc: 'Leadership & governance' },
      ],
    },
  ],
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null
  }

  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 30))
    return unsubscribe
  }, [scrollY])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Force light theme (dark text) if not on home page or if scrolled
  const isLightTheme = scrolled || pathname !== '/'

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isLightTheme
            ? 'bg-[#FBFBFB]/95 shadow-sm shadow-[#1a2d47]/5 backdrop-blur-md'
            : 'bg-transparent'
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
              src="/images/recon-logo.png"
              alt="Recon Logo"
              width={56}
              height={56}
              className="transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span
                className={`text-[15px] font-extrabold uppercase tracking-wide transition-colors ${
                  isLightTheme ? 'text-[#1a2d47]' : 'text-white'
                }`}
              >
                recon
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isLightTheme ? 'text-[#335C8B]' : 'text-[#8bb8e8]'
                }`}
              >
                International
              </span>
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
                    className={`relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-bold transition-colors ${
                      active
                        ? isLightTheme
                          ? 'text-[#1a2d47]'
                          : 'text-[#8bb8e8]'
                        : isLightTheme
                        ? 'text-[#5a7394] hover:text-[#1a2d47]'
                        : 'text-white/80 hover:text-white'
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
                        className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-[#335C8B]"
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
              className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                isLightTheme
                  ? 'border-[#d0dae6] text-[#5a7394] hover:border-[#335C8B]'
                  : 'border-white/30 text-white hover:border-white/60'
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
