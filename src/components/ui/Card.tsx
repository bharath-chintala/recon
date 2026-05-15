'use client'

import { motion } from 'framer-motion'
import { scaleIn, viewportOnce } from '@/animations/variants'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  dark?: boolean
  onClick?: () => void
}

export function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  dark = false,
  onClick,
}: CardProps) {
  const base =
    'rounded-2xl overflow-hidden transition-all duration-300'
  const glassStyles = glass
    ? 'backdrop-blur-md bg-white/10 border border-white/20'
    : dark
    ? 'bg-[#1a2d47] border border-[#243b5a]'
    : 'bg-white border border-[#e0e7ef] shadow-sm'
  const hoverStyles = hover
    ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    : ''

  return (
    <motion.div
      className={`${base} ${glassStyles} ${hoverStyles} ${className}`}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

interface CardImageProps {
  src: string
  alt: string
  className?: string
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

export function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export default Card
