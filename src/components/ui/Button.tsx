import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  as?: 'button' | 'a'
  href?: string
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>

const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white shadow-card hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700/70',
  ghost: 'text-slate-200 hover:bg-slate-800/60 border border-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  as = 'button',
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (as === 'a') {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a href={href} className={classes} aria-disabled={loading || anchorProps['aria-disabled']} {...anchorProps}>
        {loading && <span className="h-2 w-2 rounded-full bg-white animate-pulse" aria-hidden />}
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {loading && <span className="h-2 w-2 rounded-full bg-white animate-pulse" aria-hidden />}
      {children}
    </button>
  )
}
