import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function FormInput({ label, error, hint, className, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id || props.name} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <input className={cn(error ? 'border-rose-400/70 focus:ring-rose-400' : '', className)} {...props} />
      {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </div>
  )
}
