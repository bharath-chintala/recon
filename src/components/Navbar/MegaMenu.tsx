'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface MegaMenuColumn {
  heading: string
  links: { label: string; href: string; desc?: string }[]
}

interface MegaMenuProps {
  columns: MegaMenuColumn[]
  isOpen: boolean
}

export function MegaMenu({ columns, isOpen }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`absolute left-0 top-full mt-2 w-max ${
            columns.length === 1 ? 'min-w-[250px]' : 'min-w-[500px]'
          } rounded-2xl border border-[#e0e7ef] bg-white shadow-2xl shadow-[#1a2d47]/10 z-50`}
        >
          <div className={`grid ${columns.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-0 p-6`}>
            {columns.map((col) => (
              <div key={col.heading} className="p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#335C8B]">
                  {col.heading}
                </p>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-[#e8edf3]"
                      >
                        <span className="text-sm font-semibold text-[#1a2d47] group-hover:text-[#335C8B]">
                          {link.label}
                        </span>
                        {link.desc && (
                          <span className="text-xs text-[#8a9bb5]">
                            {link.desc}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MegaMenu
