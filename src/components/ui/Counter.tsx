'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface CounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  label?: string
}



export function Counter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
  label,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  
  const spring = useSpring(0, {
    bounce: 0,
    duration: duration,
  })

  const displayValue = useTransform(spring, (current: number) => Math.round(current).toLocaleString())

  useEffect(() => {
    if (isInView) {
      spring.set(target)
    }
  }, [isInView, target, spring])

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.span
        className="block text-2xl sm:text-3xl md:text-4xl font-bold text-[#335C8B] tabular-nums"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {prefix}
        <motion.span>{displayValue}</motion.span>
        {suffix}
      </motion.span>
      {label && (
        <span className="mt-1 block text-xs sm:text-sm text-[#5a7394] font-medium">
          {label}
        </span>
      )}
    </div>
  )
}

export default Counter
