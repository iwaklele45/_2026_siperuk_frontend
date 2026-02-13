import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { useAuth } from '../../features/auth/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'staff'] },
  { to: '/users', label: 'Pengguna', roles: ['admin', 'staff'] },
  { to: '/rooms', label: 'Daftar Ruang', roles: ['admin', 'staff', 'user'] },
  { to: '/bookings', label: 'Peminjaman', roles: ['admin', 'staff', 'user'] },
  { to: '/histories', label: 'History', roles: ['admin'] },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()

  const allowedNav = navItems.filter((item) => (user?.role ? item.roles.includes(user.role) : true))

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800/70 bg-slate-950/90 backdrop-blur transition-transform duration-200 md:static md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/70">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/90 text-sm">SI</span>
          <div className="leading-tight">
            SIPERUK
            <p className="text-xs text-slate-400">Dashboard</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={onClose}>
          ✕
        </Button>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
        {allowedNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-200 transition hover:bg-slate-800/60',
                isActive && 'bg-primary-500/15 text-primary-100 border border-primary-500/30',
              )
            }
            onClick={onClose}
          >
            <span className="text-lg" aria-hidden>
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
