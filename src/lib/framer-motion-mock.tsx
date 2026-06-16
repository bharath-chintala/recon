/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { forwardRef, useEffect, useState, useRef } from 'react'

// Helper mock types
export type Variants = any

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
    style,
    ...props
  }: any, ref) => {
    const elementRef = useRef<any>(null)

    // Handle children as MockMotionValue (like displayValue inside motion.span)
    useEffect(() => {
      const el = elementRef.current
      if (!el) return
      if (children instanceof MockMotionValue) {
        el.textContent = String(children.get())
        return children.onChange((latest) => {
          el.textContent = String(latest)
        })
      }
    }, [children])

    // Handle styles containing MockMotionValue objects
    useEffect(() => {
      const el = elementRef.current
      if (!el || !style) return

      const unsubs: (() => void)[] = []
      const transforms: Record<string, string | number> = {}

      const applyStyle = (key: string, val: any) => {
        const isTransform = ['scale', 'scaleX', 'scaleY', 'x', 'y', 'rotate', 'rotateX', 'rotateY'].includes(key)
        if (isTransform) {
          let unit = ''
          if (['x', 'y'].includes(key) && typeof val === 'number') {
            unit = 'px'
          } else if (['rotate', 'rotateX', 'rotateY'].includes(key) && typeof val === 'number') {
            unit = 'deg'
          }
          
          let cssKey = key
          if (key === 'x') cssKey = 'translateX'
          if (key === 'y') cssKey = 'translateY'
          
          transforms[key] = `${cssKey}(${val}${unit})`
          el.style.transform = Object.values(transforms).join(' ')
        } else {
          el.style[key as any] = val
        }
      }

      // Initialize and subscribe to motion styles
      Object.entries(style).forEach(([key, val]) => {
        if (val instanceof MockMotionValue) {
          applyStyle(key, val.get())
          const unsub = val.onChange((latest) => {
            applyStyle(key, latest)
          })
          unsubs.push(unsub)
        } else {
          applyStyle(key, val)
        }
      })

      return () => unsubs.forEach(fn => fn())
    }, [style])

    // Viewport IntersectionObserver
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

    // Pass styling without MockMotionValue values to prevent React stylesheet serialization errors
    const cleanedStyle: Record<string, any> = {}
    if (style) {
      Object.entries(style).forEach(([key, val]) => {
        if (!(val instanceof MockMotionValue)) {
          cleanedStyle[key] = val
        }
      })
    }

    const renderedChildren = children instanceof MockMotionValue ? String(children.get()) : children

    return React.createElement(Component, { 
      ...props, 
      style: cleanedStyle, 
      ref: setRefs 
    }, renderedChildren)
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
      const Component = motionBase(tagName)
      motionComponentCache[tagName] = Component
      return Component
    },
  }
) as any

export const AnimatePresence = ({ children }: any) => <>{children}</>

export const useInView = (ref: any, options?: any) => {
  return true
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

  useEffect(() => {
    if (isMotionValue) {
      const parent = initialValue as MockMotionValue
      return parent.onChange((latest) => {
        springValue.set(latest)
      })
    }
  }, [initialValue, isMotionValue, springValue])

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
  const rawInitial = value && typeof value.get === 'function' ? value.get() : 0
  
  const [transformedValue] = useState(() => {
    const compute = (val: any) => {
      if (typeof transformerOrInput === 'function') {
        return transformerOrInput(val)
      }
      if (Array.isArray(transformerOrInput) && Array.isArray(output)) {
        return interpolate(val, transformerOrInput, output)
      }
      return val
    }
    return new MockMotionValue(compute(rawInitial))
  })
  
  const latestCompute = useRef<(val: any) => any>(() => 0)
  
  useEffect(() => {
    latestCompute.current = (val: any) => {
      if (typeof transformerOrInput === 'function') {
        return transformerOrInput(val)
      }
      if (Array.isArray(transformerOrInput) && Array.isArray(output)) {
        return interpolate(val, transformerOrInput, output)
      }
      return val
    }
  }, [transformerOrInput, output])

  useEffect(() => {
    if (!value || typeof value.onChange !== 'function') return
    return value.onChange((latest) => {
      transformedValue.set(latestCompute.current(latest))
    })
  }, [value, transformedValue])

  return transformedValue
}
