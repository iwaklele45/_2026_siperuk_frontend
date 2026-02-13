import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <Badge variant="info" className="uppercase tracking-wide">
            SIPERUK v1 · Feb 2026
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl leading-tight sm:text-5xl">
              Kelola peminjaman ruangan kampus dengan cepat dan transparan
            </h1>
            <p className="text-lg text-slate-300">
              Pantau ketersediaan ruang, permintaan peminjaman, dan status persetujuan dalam satu layar.
              Integrasi mulus dengan backend .NET Web API Anda.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button as="a" href="/login" size="lg">
              Masuk sebagai Admin
            </Button>
            <Button as="a" href="/rooms" variant="secondary" size="lg">
              Lihat Ketersediaan Ruang
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <div>
              <p className="text-2xl font-semibold text-white">20+</p>
              <p>Ruang rapat dan aula</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">5 menit</p>
              <p>Proses persetujuan rata-rata</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">24/7</p>
              <p>Monitoring ketersediaan realtime</p>
            </div>
          </div>
        </div>

        <div className="glow rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Permintaan hari ini</p>
              <p className="text-3xl font-semibold text-white">12</p>
            </div>
            <Badge variant="success">+18% vs minggu lalu</Badge>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card title="Ruang Tersedia" description="Siap dipinjam" className="bg-slate-900/60 shadow-soft">
              <p className="text-3xl font-semibold text-white">14</p>
              <p className="text-sm text-slate-400">Termasuk Aula Mini & Kolaborasi</p>
            </Card>
            <Card title="Peminjaman Aktif" description="Sedang berlangsung" className="bg-slate-900/60 shadow-soft">
              <p className="text-3xl font-semibold text-white">6</p>
              <p className="text-sm text-slate-400">Disetujui oleh admin</p>
            </Card>
          </div>
          <div className="mt-6 rounded-xl border border-slate-800/70 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Status ruang populer</span>
              <Link to="/rooms" className="text-primary-300 hover:text-primary-200">
                Lihat daftar
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {[{ label: 'Ruang Rapat Utama', value: 82 }, { label: 'Ruang Kolaborasi', value: 64 }, { label: 'Aula Mini', value: 48 }].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span className="text-slate-200 font-semibold">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary-200">Fitur utama</p>
            <h2 className="text-2xl font-semibold">Didesain untuk admin dan pengguna</h2>
          </div>
          <Link to="/dashboard" className="text-sm text-primary-200 hover:text-primary-100">
            Demo dashboard →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Pantau ketersediaan"
            description="Table responsif dengan header lengket dan tampilan mobile yang ringkas."
          >
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Filter status ruang</li>
              <li>• Badge status dengan warna jelas</li>
              <li>• Sticky header untuk desktop</li>
            </ul>
          </Card>
          <Card
            title="Proses persetujuan"
            description="Login, context auth, dan ProtectedRoute untuk halaman privat."
          >
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Hook auth mock dengan login/logout</li>
              <li>• Redirect otomatis ke login</li>
              <li>• Topbar admin & logout cepat</li>
            </ul>
          </Card>
          <Card
            title="Integrasi API"
            description="Client fetcher siap pakai dengan base URL konfigurable."
          >
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Helper fetch JSON</li>
              <li>• Tipe Room & Booking sudah tersedia</li>
              <li>• Mudah sambungkan ke .NET Web API</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
