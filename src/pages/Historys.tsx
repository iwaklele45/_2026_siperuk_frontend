import { useState } from 'react'
import { useHistory } from '../hooks/useHistory'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FormInput } from '../components/ui/FormInput'
import { formatDateTime } from '../utils/format'

const bookingStatusOptions = [
  { id: 1, label: 'Waiting', badge: 'warning' as const },
  { id: 2, label: 'Approved', badge: 'success' as const },
  { id: 3, label: 'Rejected', badge: 'danger' as const },
  { id: 4, label: 'Finish', badge: 'info' as const },
]

export function HistorysPage() {
  const [bookingId, setBookingId] = useState('')
  const { data, isLoading, error, refetch, isFetching } = useHistory(bookingId || undefined)

  const histories = data ?? []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-primary-200">Riwayat Status</p>
        <h1 className="text-3xl font-semibold">Status terbaru per booking</h1>
        <p className="text-sm text-slate-400">Menampilkan status terakhir setiap booking. Bisa difilter berdasarkan Booking ID.</p>
      </div>

      <Card title="Filter" description="Masukkan Booking ID (opsional) untuk mempersempit daftar.">
        <form className="grid gap-3 sm:flex sm:items-end" onSubmit={handleSubmit}>
          <div className="sm:max-w-xs flex-1">
            <FormInput
              label="Booking ID (opsional)"
              placeholder="Contoh: BK-001"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full sm:w-auto" loading={isFetching}>
            Terapkan filter
          </Button>
        </form>
      </Card>

      <Card
        title="Riwayat status"
        description={bookingId ? `Riwayat untuk Booking ${bookingId}` : 'Semua riwayat status, urut terbaru'}
      >
        {isLoading ? (
          <div className="text-sm text-slate-400">Memuat riwayat...</div>
        ) : error ? (
          <div className="text-sm text-rose-300">{(error as Error).message}</div>
        ) : histories.length === 0 ? (
          <div className="text-sm text-slate-400">Belum ada riwayat.</div>
        ) : (
          <div className="space-y-4">
            {histories.map((item) => {
              const status = bookingStatusOptions.find((s) => s.id === item.bookingStatusId)
              return (
                <div key={`${item.id}-${item.changedAt}`} className="card-surface w-full rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-400">Booking ID</p>
                      <p className="font-semibold text-white">{item.bookingId}</p>
                    </div>
                    <Badge variant={status?.badge ?? 'info'}>{status?.label ?? item.bookingStatusName}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                    <div className="flex flex-col">
                      <span className="text-slate-400">Ruang</span>
                      <span className="font-medium text-white">{item.booking?.roomName ?? '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400">User</span>
                      <span className="font-medium text-white">{item.booking?.userName ?? '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400">Waktu</span>
                      <span className="font-medium text-white">
                        {item.booking?.startTime ? formatDateTime(item.booking.startTime) : '-'}
                        {item.booking?.endTime ? ` — ${formatDateTime(item.booking.endTime)}` : ''}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400">Keperluan</span>
                      <span className="font-medium text-white">{item.booking?.purpose ?? '-'}</span>
                    </div>
                  </div>
                  {item.notes && <p className="mt-2 text-sm text-slate-300">{item.notes}</p>}
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(item.changedAt)}</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
