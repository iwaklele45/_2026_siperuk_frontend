import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  actions?: ReactNode
}

export function Card({ children, className, title, description, actions }: CardProps) {
  return (
    <div className={cn('card-surface rounded-xl p-5', className)}>
      {(title || description || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-50">{title}</h3>}
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
