'use client'

type BadgeColor = 'gold' | 'blue' | 'green' | 'red' | 'purple' | 'stone'

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
  className?: string
  dot?: boolean
}

const colorMap: Record<BadgeColor, string> = {
  gold: 'bg-amber-100 text-amber-800 ring-amber-200/60',
  blue: 'bg-sky-100 text-sky-800 ring-sky-200/60',
  green: 'bg-emerald-100 text-emerald-800 ring-emerald-200/60',
  red: 'bg-rose-100 text-rose-800 ring-rose-200/60',
  purple: 'bg-violet-100 text-violet-800 ring-violet-200/60',
  stone: 'bg-stone-100 text-stone-700 ring-stone-200/60',
}

const dotMap: Record<BadgeColor, string> = {
  gold: 'bg-amber-500',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  purple: 'bg-violet-500',
  stone: 'bg-stone-400',
}

export function Badge({
  children,
  color = 'gold',
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ${colorMap[color]} ${className}`}
    >
      {dot && (
        <span
          className={`block h-1.5 w-1.5 rounded-full ${dotMap[color]}`}
        />
      )}
      {children}
    </span>
  )
}

export default Badge
