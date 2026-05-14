'use client'

// ─── useScrollReveal ─────────────────────────────────────────────────────────
// Wraps framer-motion's useInView with project-wide defaults.
// Usage:
//   const { ref, isInView } = useScrollReveal()
//   <motion.div ref={ref} variants={fadeInUp} initial="hidden" animate={isInView ? "visible" : "hidden"} />

import { useRef } from 'react'
import { useInView } from 'framer-motion'

interface UseScrollRevealOptions {
  /** Trigger once and stay visible (default: true) */
  once?: boolean
  /** Root margin for the intersection observer (default: '-80px') */
  margin?: string
  /** Amount of element visible before triggering (0–1, default: 0) */
  amount?: number | 'some' | 'all'
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { once = true, margin = '-80px', amount = 0 } = options
  const ref = useRef<T>(null)
  const isInView = useInView(ref, { once, margin, amount })

  return { ref, isInView }
}

export default useScrollReveal
