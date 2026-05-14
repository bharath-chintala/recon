'use client'

import Link from 'next/link'
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
            className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm"
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
            className="fixed right-0 top-0 bottom-0 z-50 flex w-4/5 max-w-sm flex-col bg-stone-950 px-8 py-10 shadow-2xl"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                Recon International
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-amber-400 hover:text-amber-400 transition-colors"
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
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-amber-400"
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
                className="block w-full rounded-full bg-amber-600 py-3.5 text-center text-sm font-bold text-white hover:bg-amber-500 transition-colors"
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
