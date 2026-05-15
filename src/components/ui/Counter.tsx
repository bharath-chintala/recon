'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface CounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  label?: string
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

export function Counter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
  label,
}: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!isInView || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      setCount(Math.round(easedProgress * target))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.span
        className="block text-4xl font-bold text-[#335C8B] tabular-nums"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </motion.span>
      {label && (
        <span className="mt-1 block text-sm text-[#5a7394] font-medium">
          {label}
        </span>
      )}
    </div>
  )
}

export default Counter
