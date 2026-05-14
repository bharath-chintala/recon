'use client'

import { motion } from 'framer-motion'
import { hoverScale, tapScale } from '@/animations/variants'

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
    'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-600/25',
  secondary:
    'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20',
  ghost: 'bg-transparent text-stone-800 hover:bg-stone-100',
  outline:
    'bg-transparent border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white',
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
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
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
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={hoverScale}
        whileTap={tapScale}
      >
        {content}
      </motion.a>
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
