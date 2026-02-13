import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/layout/Sidebar'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../features/auth/AuthContext'

export function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-800/70 bg-slate-950/85 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(true)}>
                ☰
              </Button>
              <div>
                <p className="text-xs text-slate-400">Halo,</p>
                <p className="text-sm font-semibold text-white">{user?.name ?? 'Pengguna'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill bg-slate-800 text-slate-200 capitalize">{user?.role ?? 'staff'}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Keluar
              </Button>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
