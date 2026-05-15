'use client'

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
                  src="/images/recon-logo.png"
                  alt="Recon Logo"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[14px] font-extrabold uppercase tracking-wide text-white">
                    recon
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8bb8e8]">
                    International
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#335C8B] hover:text-[#8bb8e8] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <ul className="flex-1 space-y-2">
              {links.map((link, i) => (
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
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-[#8bb8e8]"
                  >
                    <span className="h-px flex-1 bg-white/10" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <Link
                href="/contact"
                onClick={onClose}
                className="block w-full rounded-full bg-[#335C8B] py-3.5 text-center text-sm font-bold text-white hover:bg-[#4a7ab5] transition-colors"
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
