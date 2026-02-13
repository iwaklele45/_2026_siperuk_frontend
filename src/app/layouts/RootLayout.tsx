import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="container-page py-12">
        <Outlet />
      </main>
    </div>
  )
}
