import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-800 text-slate-100 border border-slate-700',
  success: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/40',
  warning: 'bg-amber-400/15 text-amber-100 border border-amber-400/40',
  danger: 'bg-rose-500/15 text-rose-100 border border-rose-500/40',
  info: 'bg-primary-500/15 text-primary-100 border border-primary-500/40',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return <span className={cn('pill text-xs uppercase tracking-wide', variants[variant], className)}>{children}</span>
}
