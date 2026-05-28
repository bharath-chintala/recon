'use client'

import { motion } from 'framer-motion'
import { hoverScale, tapScale } from '@/animations/variants'

import Link from 'next/link'

const MotionLink = motion(Link)

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#335C8B] text-white hover:bg-[#4a7ab5] shadow-lg shadow-[#335C8B]/25',
  secondary:
    'bg-[#1a2d47] text-white hover:bg-[#243b5a] shadow-lg shadow-[#1a2d47]/20',
  ghost: 'bg-transparent text-[#1a2d47] hover:bg-[#e8edf3]',
  outline:
    'bg-transparent border border-[#335C8B] text-[#335C8B] hover:bg-[#335C8B] hover:text-white',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'right',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#335C8B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  )

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    
    if (isExternal) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileHover={hoverScale}
          whileTap={tapScale}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </motion.a>
      )
    }

    return (
      <MotionLink
        href={href}
        className={classes}
        whileHover={hoverScale}
        whileTap={tapScale}
      >
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? hoverScale : undefined}
      whileTap={!disabled ? tapScale : undefined}
    >
      {content}
    </motion.button>
  )
}

export default Button
