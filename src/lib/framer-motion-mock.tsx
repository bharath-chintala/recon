import React, { forwardRef, useEffect, useState, useRef } from 'react'

// Cache-busting timestamp to force Next.js Turbopack cache invalidation: 2026-05-27T19:22:00
// Helper mock types
export type Variants = any

// The motion proxy allows motion.div, motion.section, motion.h2, etc.
// to resolve to forwardRef wrappers rendering standard DOM elements with IntersectionObserver support.
const motionBase = (Component: any) => {
  const Wrapped = forwardRef(({
    children,
    whileHover,
    whileTap,
    whileInView,
    whileFocus,
    whileDrag,
    transition,
    animate,
    initial,
    exit,
    viewport,
    variants,
    layoutId,
    layout,
    custom,
    onViewportEnter,
    onViewportLeave,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    dragTransition,
    onAnimationStart,
    onAnimationComplete,
    onUpdate,
    ...props
  }: any, ref) => {
    const elementRef = useRef<any>(null)

    useEffect(() => {
      if (!onViewportEnter && !onViewportLeave) return

      const element = elementRef.current
      if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        if (onViewportEnter) onViewportEnter()
        return
      }

      const observerMargin = viewport?.margin || '0px'
      const observerOnce = viewport?.once !== false

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (onViewportEnter) onViewportEnter()
          if (observerOnce) {
            observer.unobserve(element)
          }
        } else {
          if (!observerOnce && onViewportLeave) {
            onViewportLeave()
          }
        }
      }, {
        rootMargin: observerMargin,
        threshold: viewport?.amount || 0,
      })

      observer.observe(element)
      return () => observer.disconnect()
    }, [onViewportEnter, onViewportLeave, viewport?.margin, viewport?.once, viewport?.amount])

    const setRefs = (node: any) => {
      elementRef.current = node
      if (ref) {
        if (typeof ref === 'function') ref(node)
        else (ref as any).current = node
      }
    }

    return React.createElement(Component, { ...props, ref: setRefs }, children)
  })
  Wrapped.displayName = `motion.${typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Component'}`
  return Wrapped
}

const motionComponentCache: Record<string, any> = {}

export const motion = new Proxy(
  motionBase,
  {
    get(target, tagName: string) {
      if (tagName in target) {
        return (target as any)[tagName]
      }
      if (motionComponentCache[tagName]) {
        return motionComponentCache[tagName]
      }
      const Component = forwardRef(({
        children,
        whileHover,
        whileTap,
        whileInView,
        whileFocus,
        whileDrag,
        transition,
        animate,
        initial,
        exit,
        viewport,
        variants,
        layoutId,
        layout,
        custom,
        onViewportEnter,
        onViewportLeave,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        dragTransition,
        onAnimationStart,
        onAnimationComplete,
        onUpdate,
        ...props
      }: any, ref) => {
        const elementRef = useRef<any>(null)

        useEffect(() => {
          if (!onViewportEnter && !onViewportLeave) return

          const element = elementRef.current
          if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            if (onViewportEnter) onViewportEnter()
            return
          }

          const observerMargin = viewport?.margin || '0px'
          const observerOnce = viewport?.once !== false

          const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
              if (onViewportEnter) onViewportEnter()
              if (observerOnce) {
                observer.unobserve(element)
              }
            } else {
              if (!observerOnce && onViewportLeave) {
                onViewportLeave()
              }
            }
          }, {
            rootMargin: observerMargin,
            threshold: viewport?.amount || 0,
          })

          observer.observe(element)
          return () => observer.disconnect()
        }, [onViewportEnter, onViewportLeave, viewport?.margin, viewport?.once, viewport?.amount])

        const setRefs = (node: any) => {
          elementRef.current = node
          if (ref) {
            if (typeof ref === 'function') ref(node)
            else (ref as any).current = node
          }
        }

        return React.createElement(tagName, { ...props, ref: setRefs }, children)
      })
      Component.displayName = `motion.${tagName}`
      motionComponentCache[tagName] = Component
      return Component
    },
  }
) as any

export const AnimatePresence = ({ children }: any) => <>{children}</>

export const useInView = (ref: any, options?: any) => {
  return true
}

export class MockMotionValue {
  private value: any
  private listeners: Set<(v: any) => void> = new Set()

  constructor(initial: any) {
    this.value = initial
  }

  get() {
    return this.value
  }

  set(target: any) {
    this.value = target
    this.listeners.forEach(cb => cb(target))
  }

  onChange(cb: (v: any) => void) {
    this.listeners.add(cb)
    return () => { this.listeners.delete(cb) }
  }

  on(event: string, cb: any) {
    this.listeners.add(cb)
    return () => { this.listeners.delete(cb) }
  }

  destroy() {
    this.listeners.clear()
  }
}

export const useScroll = (options?: any) => {
  const [scrollY] = useState(() => new MockMotionValue(0))
  const [scrollYProgress] = useState(() => new MockMotionValue(0))

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const raw = window.scrollY
      scrollY.set(raw)
      scrollYProgress.set(max > 0 ? raw / max : 0)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollY, scrollYProgress])

  return { scrollY, scrollYProgress }
}

export const useSpring = (initialValue: number | MockMotionValue, config?: any) => {
  const isMotionValue = initialValue instanceof MockMotionValue
  const rawInitial = isMotionValue ? (initialValue as MockMotionValue).get() : initialValue

  const [springValue] = useState(() => new MockMotionValue(rawInitial))
  const [, forceUpdate] = useState({})

  useEffect(() => {
    if (isMotionValue) {
      const parent = initialValue as MockMotionValue
      return parent.onChange((latest) => {
        springValue.set(latest)
      })
    }
  }, [initialValue, isMotionValue, springValue])

  useEffect(() => {
    return springValue.onChange(() => forceUpdate({}))
  }, [springValue])

  return springValue
}

// Robust multi-segment linear interpolation helper
function interpolate(value: number, inputRange: number[], outputRange: any[]) {
  const len = inputRange.length
  if (len === 0) return 0
  if (value <= inputRange[0]) return outputRange[0]
  if (value >= inputRange[len - 1]) return outputRange[len - 1]

  let i = 0
  for (i = 0; i < len - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      break
    }
  }

  const minIn = inputRange[i]
  const maxIn = inputRange[i + 1]
  const minOut = outputRange[i]
  const maxOut = outputRange[i + 1]

  // Handle CSS strings (e.g. "blur(0px)" -> "blur(10px)")
  if (typeof minOut === 'string' && typeof maxOut === 'string') {
    const numMin = parseFloat(minOut.replace(/[^0-9.-]/g, '')) || 0
    const numMax = parseFloat(maxOut.replace(/[^0-9.-]/g, '')) || 0
    const t = (value - minIn) / (maxIn - minIn)
    const interpolatedVal = numMin + t * (numMax - numMin)
    return minOut.replace(/[0-9.-]+/g, String(interpolatedVal))
  }

  // Handle standard numbers
  const t = (value - minIn) / (maxIn - minIn)
  return minOut + t * (maxOut - minOut)
}

export const useTransform = (value: MockMotionValue, transformerOrInput: any, output?: any) => {
  const [displayVal, setDisplayVal] = useState(() => {
    const raw = value && typeof value.get === 'function' ? value.get() : 0
    if (typeof transformerOrInput === 'function') {
      return transformerOrInput(raw)
    }
    if (Array.isArray(transformerOrInput) && Array.isArray(output)) {
      return interpolate(raw, transformerOrInput, output)
    }
    return raw
  })

  // Store configuration values in mutable refs to keep the subscription stable and prevent loop triggers
  const latestTransformer = useRef(transformerOrInput)
  const latestOutput = useRef(output)

  useEffect(() => {
    latestTransformer.current = transformerOrInput
    latestOutput.current = output
  })

  useEffect(() => {
    if (!value || typeof value.onChange !== 'function') return
    return value.onChange((latest) => {
      let next = latest
      const currentTransformer = latestTransformer.current
      const currentOutput = latestOutput.current
      if (typeof currentTransformer === 'function') {
        next = currentTransformer(latest)
      } else if (Array.isArray(currentTransformer) && Array.isArray(currentOutput)) {
        next = interpolate(latest, currentTransformer, currentOutput)
      }
      setDisplayVal(next)
    })
  }, [value])

  return displayVal
}
