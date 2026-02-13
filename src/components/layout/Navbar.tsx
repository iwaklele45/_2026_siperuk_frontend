import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/rooms', label: 'Ruang' },
  { to: '/bookings', label: 'Peminjaman' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-base shadow-card">
            SI
          </span>
          <div className="leading-tight">
            <div>SIPERUK</div>
            <p className="text-xs text-slate-400">Sistem Peminjaman Ruangan</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn('hover:text-white transition', isActive ? 'text-white' : 'text-slate-300')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as="a" href="/login" variant="secondary" size="sm">
            Masuk
          </Button>
          <Button as="a" href="/rooms" size="sm">
            Lihat Ruang
          </Button>
        </div>
      </div>
    </header>
  )
}
