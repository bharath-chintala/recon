'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface NavLink {
  label: string
  href: string
}

interface MobileMenuProps {
  links: NavLink[]
  isOpen: boolean
  onClose: () => void
}

const menuVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.28 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.35 },
  }),
}

export function MobileMenu({ links, isOpen, onClose }: MobileMenuProps) {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[60] bg-[#0f1d30]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.nav
            key="drawer"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-[70] flex w-4/5 max-w-sm flex-col bg-[#0f1d30] px-8 py-10 shadow-2xl"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/recon-logo.webp"
                  alt="Recon Logo"
                  width={58}
                  height={58}
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[16px] font-extrabold uppercase tracking-wide text-white">
                    recon
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8bb8e8] mt-0.5">
                    International
                  </span>
                  <h5 className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-[#8bb8e8]/70 mt-1">
                    Charitable Trust
                  </h5>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#17A3FF] hover:text-[#17A3FF] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <ul className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-1">
              {links.map((link, i) => {
                const isAbout = link.label === 'About'
                if (isAbout) {
                  return (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col"
                    >
                      <button
                        onClick={() => setAboutOpen(!aboutOpen)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-[#17A3FF]"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="h-px bg-white/10 flex-1" />
                          <span>{link.label}</span>
                        </div>
                        <svg
                          className="h-4 w-4 text-white/50 transition-transform duration-300"
                          style={{ transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Dropdown links */}
                      <AnimatePresence>
                        {aboutOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden bg-white/5 rounded-xl mt-1 ml-4"
                          >
                            <ul className="py-2 px-4 space-y-1">
                              <li>
                                <Link
                                  href="/about"
                                  onClick={onClose}
                                  className="block py-2.5 text-sm font-medium text-white/70 hover:text-[#17A3FF] transition-colors"
                                >
                                  • About Overview
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/about#mission"
                                  onClick={onClose}
                                  className="block py-2.5 text-sm font-medium text-white/70 hover:text-[#17A3FF] transition-colors"
                                >
                                  • Our Mission
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/about#history"
                                  onClick={onClose}
                                  className="block py-2.5 text-sm font-medium text-white/70 hover:text-[#17A3FF] transition-colors"
                                >
                                  • Our History
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/about#members"
                                  onClick={onClose}
                                  className="block py-2.5 text-sm font-medium text-white/70 hover:text-[#17A3FF] transition-colors"
                                >
                                  • Trust Members
                                </Link>
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  )
                }

                return (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-[#17A3FF]"
                    >
                      <span className="h-px flex-1 bg-white/10" />
                      {link.label}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <Link
                href="/contact"
                onClick={onClose}
                className="block w-full rounded-full bg-[#17A3FF] py-3.5 text-center text-sm font-bold text-white hover:bg-[#17A3FF]/90 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
