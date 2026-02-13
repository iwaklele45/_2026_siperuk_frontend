import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Column<T> = {
  key: string
  header: string
  render?: (item: T) => ReactNode
  align?: 'left' | 'right' | 'center'
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  getKey: (item: T) => string
  emptyState?: ReactNode
  className?: string
}

export function ResponsiveTable<T>({ data, columns, getKey, emptyState, className }: ResponsiveTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div className="card-surface p-6 text-center text-slate-400">{emptyState}</div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="hidden overflow-hidden rounded-xl border border-slate-800/70 shadow-soft md:block">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-slate-900/90 backdrop-blur">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-slate-300',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {data.map((item) => (
              <tr key={getKey(item)} className="hover:bg-slate-800/40">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-sm text-slate-100',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    {col.render ? col.render(item) : (item as Record<string, ReactNode>)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {data.map((item) => (
          <div key={getKey(item)} className="card-surface p-4">
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col">
                  <dt className="text-slate-400">{col.header}</dt>
                  <dd className="text-slate-100 font-medium">
                    {col.render ? col.render(item) : (item as Record<string, ReactNode>)[col.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
