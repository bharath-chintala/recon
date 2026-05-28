'use client'

// ─── useScrollReveal ─────────────────────────────────────────────────────────
// Wraps framer-motion's useInView with project-wide defaults.
// Usage:
//   const { ref, isInView } = useScrollReveal()
//   <motion.div ref={ref} variants={fadeInUp} initial="hidden" animate={isInView ? "visible" : "hidden"} />

import { useRef } from 'react'
import { useInView } from 'framer-motion'

export interface UseInViewOptions {
  once?: boolean
  margin?: string
  amount?: 'some' | 'all' | number
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { once = true, margin = '-80px', amount = 0 } = options
  const ref = useRef<T>(null)
  const isInView = useInView(ref, { once, margin, amount })

  return { ref, isInView }
}

export default useScrollReveal
