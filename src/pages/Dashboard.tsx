import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ResponsiveTable } from '../components/ui/ResponsiveTable'
import { mockRooms } from '../features/rooms/data/mockRooms'
import { formatDate } from '../lib/utils'
import { useAuth } from '../hooks/useAuth'
import { useUsers } from '../hooks/useUsers'
import { useRooms } from '../hooks/useRooms'
import { useBookings } from '../hooks/useBookings'

const bookingStatusOptions = [
  { id: 1, label: 'Waiting', badge: 'warning' as const },
  { id: 2, label: 'Approved', badge: 'success' as const },
  { id: 3, label: 'Rejected', badge: 'danger' as const },
  { id: 4, label: 'Finish', badge: 'info' as const },
]

export function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const { data: users = [], isLoading: isUsersLoading } = useUsers()
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms()
  const { data: bookings = [], isLoading: isBookingsLoading } = useBookings()
  const navigate = useNavigate()

  useEffect(() => {
    if(loading || !isAuthenticated) return
    if (user?.role ==='user') {
      navigate('/rooms',{replace:true})
    }
  }, [isAuthenticated, loading, navigate,user])

  const stats = useMemo(() => {
    const getStatusKey = (booking: { bookingStatusId?: number | string; status?: string; bookingStatus?: { name?: string }; bookingStatusName?: string }) => {
      const id = Number(booking.bookingStatusId)
      if (!Number.isNaN(id)) {
        if (id === 2) return 'approved'
        if (id === 3) return 'rejected'
      }
      const name = (booking.status || booking.bookingStatus?.name || (booking as any).bookingStatusName || '').toLowerCase()
      return name
    }

    const approvedCount = bookings.filter((b) => getStatusKey(b) === 'approved').length
    const rejectedCount = bookings.filter((b) => getStatusKey(b) === 'rejected').length

    return [
      { label: 'Jumlah user', value: users.length },
      { label: 'Jumlah ruangan', value: rooms.length },
      { label: 'Peminjaman disetujui', value: approvedCount },
      { label: 'Peminjaman ditolak', value: rejectedCount },
    ]
  }, [bookings, rooms.length, users.length])

  const isStatsLoading = isUsersLoading || isRoomsLoading || isBookingsLoading

  const latestBookings = useMemo(() => {
    const parseStart = (b: (typeof bookings)[number]) => {
      if (b.startTime) return new Date(b.startTime).getTime()
      if (b.date) return new Date(b.date).getTime()
      return 0
    }
    return [...bookings].sort((a, b) => parseStart(b) - parseStart(a)).slice(0, 5)
  }, [bookings])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-primary-200">Dashboard</p>
        <h1 className="text-3xl font-semibold">Ringkasan operasional</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="shadow-soft">
            <p className="text-sm text-slate-400">{item.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-semibold text-white">{isStatsLoading ? '...' : item.value}</p>
              <Badge variant={isStatsLoading ? 'neutral' : 'info'}>{isStatsLoading ? 'Memuat' : 'Terkini'}</Badge>
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
          data={latestBookings}
          getKey={(booking) => booking.id}
          emptyState={isBookingsLoading ? 'Memuat data booking…' : 'Belum ada booking.'}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'roomId', header: 'Ruang', render: (booking) => (booking as any).roomName || booking.roomId || '-' },
            {
              key: 'userName',
              header: 'Pemohon',
              render: (booking) => booking.userName || booking.requester,
            },
            {
              key: 'date',
              header: 'Tanggal',
              render: (booking) => {
                const hasIso = booking.startTime && booking.endTime
                const dateLabel = hasIso ? formatDate(booking.startTime!) : booking.date ? formatDate(booking.date) : '-'
                const timeLabel = hasIso
                  ? `${new Date(booking.startTime!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.endTime!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                  : booking.timeRange || ''
                return timeLabel ? `${dateLabel} • ${timeLabel}` : dateLabel
              },
            },
            {
              key: 'status',
              header: 'Status',
              render: (booking) => {
                const option = bookingStatusOptions.find((opt) => opt.id === booking.bookingStatusId)
                const fallback = (booking.status ?? '').toLowerCase()
                const fallbackVariant =
                  fallback === 'approved'
                    ? 'success'
                    : fallback === 'pending'
                    ? 'warning'
                    : fallback === 'rejected'
                    ? 'danger'
                    : 'info'

                return (
                  <Badge variant={option?.badge ?? fallbackVariant}>
                    {option?.label ?? booking.status ?? 'Unknown'}
                  </Badge>
                )
              },
            },
          ]}
        />
      </Card>
    </div>
  )
}
