// ─── Recon International — Animation Variants ────────────────────────────────
// Centralised Framer Motion variant definitions for consistent motion design.

import type { Variants } from 'framer-motion'

// Typed cubic-bezier tuple so framer-motion accepts it as `Easing`
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Fade In Up ─────────────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: EASE,
    },
  },
}

// ─── Fade In Down ───────────────────────────────────────────────────────────

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: EASE,
    },
  },
}

// ─── Stagger Container ──────────────────────────────────────────────────────

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

// ─── Scale In ───────────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
}

export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
    },
  },
}

// ─── Slide In Left ──────────────────────────────────────────────────────────

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: EASE,
    },
  },
}

// ─── Slide In Right ─────────────────────────────────────────────────────────

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: EASE,
    },
  },
}

// ─── Blur In ────────────────────────────────────────────────────────────────

export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(12px)',
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
}

/** Slow sacred blur reveal — homepage cinematic typography */
export const cinematicBlurReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(14px)',
    y: 36,
    letterSpacing: '0.06em',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    letterSpacing: '0em',
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// ─── Draw Line ──────────────────────────────────────────────────────────────

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: 'easeInOut' },
      opacity: { duration: 0.3 },
    },
  },
}

// ─── Hover Scale ────────────────────────────────────────────────────────────

export const hoverScale = {
  scale: 1.04,
  transition: { duration: 0.25 },
}

export const tapScale = {
  scale: 0.97,
}

// ─── Viewport Defaults ──────────────────────────────────────────────────────

export const viewportOnce = { once: false, margin: '-100px' }
