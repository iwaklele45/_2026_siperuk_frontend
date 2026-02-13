import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm uppercase tracking-wide text-primary-200">404</p>
      <h1 className="text-3xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="text-slate-400">Periksa kembali URL atau kembali ke dashboard.</p>
      <div className="flex gap-3">
        <Button as="a" href="/dashboard">Dashboard</Button>
        <Link to="/" className="text-primary-200 hover:text-primary-100">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  )
}
