import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ResponsiveTable } from '../components/ui/ResponsiveTable'
import { mockRooms } from '../features/rooms/data/mockRooms'
import { mockBookings } from '../features/rooms/data/mockBookings'
import { formatDate } from '../lib/utils'

const stats = [
  { label: 'Permintaan baru', value: 12, delta: '+18%' },
  { label: 'Ruang tersedia', value: 14, delta: '+2 ruang' },
  { label: 'Peminjaman aktif', value: 6, delta: 'Stable' },
  { label: 'Ditolak hari ini', value: 1, delta: '-1' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-primary-200">Dashboard</p>
        <h1 className="text-3xl font-semibold">Ringkasan operasional</h1>
        <p className="text-sm text-slate-400">Data mock untuk demonstrasi UI dan layout.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="shadow-soft">
            <p className="text-sm text-slate-400">{item.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <Badge variant="success">{item.delta}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Tren peminjaman</h3>
              <p className="text-sm text-slate-400">Placeholder chart</p>
            </div>
            <Badge variant="info">Minggu ini</Badge>
          </div>
          <div className="mt-6 grid grid-cols-6 items-end gap-2">
            {[40, 52, 60, 35, 64, 58].map((value, idx) => (
              <div key={idx} className="relative flex justify-center">
                <div className="w-full rounded-lg bg-primary-500/20" style={{ height: '140px' }}>
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-primary-600 to-primary-400"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span className="absolute -bottom-6 text-xs text-slate-400">H{idx + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Ketersediaan ruang" description="Status terbaru ruang populer" className="lg:col-span-2">
          <ResponsiveTable
            data={mockRooms.slice(0, 3)}
            getKey={(room) => room.id}
            columns={[
              { key: 'name', header: 'Ruang', render: (room) => <div className="font-semibold text-white">{room.name}</div> },
              { key: 'location', header: 'Lokasi' },
              {
                key: 'status',
                header: 'Status',
                render: (room) => (
                  <Badge
                    variant={
                      room.status === 'available'
                        ? 'success'
                        : room.status === 'booked'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {room.status}
                  </Badge>
                ),
              },
            ]}
          />
        </Card>
      </div>

      <Card title="Peminjaman terbaru" description="Top 5 permintaan" className="shadow-soft">
        <ResponsiveTable
          data={mockBookings.slice(0, 4)}
          getKey={(booking) => booking.id}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'roomName', header: 'Ruang' },
            {
              key: 'userName',
              header: 'Pemohon',
              render: (booking) => booking.userName || booking.requester,
            },
            {
              key: 'date',
              header: 'Tanggal',
              render: (booking) => `${formatDate(booking.date)} • ${booking.timeRange}`,
            },
            {
              key: 'status',
              header: 'Status',
              render: (booking) => (
                <Badge
                  variant={
                    booking.status === 'approved'
                      ? 'success'
                      : booking.status === 'pending'
                      ? 'warning'
                      : booking.status === 'rejected'
                      ? 'danger'
                      : 'info'
                  }
                >
                  {booking.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
