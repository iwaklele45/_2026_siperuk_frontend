import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useHistory } from '../hooks/useHistory'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FormInput } from '../components/ui/FormInput'
import { apiClient } from '../api/client'
import type { BookingDto } from '../api/types'
import { formatDate, formatDateTime } from '../utils/format'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type BookingFilterKey = 'all' | 'finish' | 'rejected'

const bookingFilters: Array<{ key: BookingFilterKey; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'finish', label: 'Selesai' },
  { key: 'rejected', label: 'Ditolak' },
]

const bookingStatusOptions = [
  { id: 1, label: 'Waiting', badge: 'warning' as const },
  { id: 2, label: 'Approved', badge: 'success' as const },
  { id: 3, label: 'Rejected', badge: 'danger' as const },
  { id: 4, label: 'Finish', badge: 'info' as const },
]

export function HistorysPage() {
  const {user, isAuthenticated, loading}=useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if(loading||!isAuthenticated) return
    if(user?.role ==='staff' || user?.role ==='user'){
      navigate('/dashboard',{replace:true})
      return
    }
  },[isAuthenticated,loading,navigate,user])

  const [bookingId, setBookingId] = useState('')
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingFilterKey>('all')
  const { data, isLoading, error, refetch, isFetching } = useHistory(bookingId || undefined)

  const {
    data: bookingDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery({
    queryKey: ['booking-detail', selectedBookingId],
    enabled: Boolean(selectedBookingId),
    queryFn: async () => {
      if (!selectedBookingId) throw new Error('Booking ID tidak ditemukan')
      const { data: detail } = await apiClient.get<BookingDto>(`/booking/${selectedBookingId}`)
      return detail
    },
    retry: false,
  })

  const histories = data ?? []
  const filteredHistories = useMemo(() => {
    const getStatusKey = (item: { bookingStatusId?: number | string; statusId?: string | number; bookingStatus?: { name?: string } }) => {
      const id = Number(item.bookingStatusId ?? item.statusId)
      if (!Number.isNaN(id)) {
        if (id === 4) return 'finish'
        if (id === 3) return 'rejected'
        if (id === 2) return 'approved'
        if (id === 1) return 'waiting'
      }
      return (item.bookingStatus?.name ?? '').toLowerCase()
    }

    return histories.filter((item) => {
      const key = getStatusKey(item)
      const isFinish = key === 'finish' || key === 'finished' || key === 'complete' || key === 'completed'
      const isRejected = key === 'rejected'
      if (!isFinish && !isRejected) return false
      if (statusFilter === 'finish') return isFinish
      if (statusFilter === 'rejected') return isRejected
      return isFinish || isRejected
    })
  }, [histories, statusFilter])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-primary-200">Riwayat Status</p>
        <h1 className="text-3xl font-semibold">Status selesai per booking</h1>
      </div>

      <Card title="Filter" description="Pilih status dan/atau masukkan Booking ID untuk mempersempit daftar.">
        <form className="grid gap-3 sm:flex sm:items-end" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-2">
            {bookingFilters.map((item) => (
              <Button
                key={item.key}
                type="button"
                size="sm"
                variant={statusFilter === item.key ? 'primary' : 'secondary'}
                onClick={() => setStatusFilter(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </div>
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
        title="Status selesai dan ditolak"
        description={bookingId ? `Status selesai untuk ${bookingId}` : 'Status selesai untuk semua booking'}
      >
        {isLoading ? (
          <div className="text-sm text-slate-400">Memuat riwayat...</div>
        ) : error ? (
          <div className="text-sm text-rose-300">{(error as Error).message}</div>
        ) : filteredHistories.length === 0 ? (
          <div className="text-sm text-slate-400">Belum ada riwayat.</div>
        ) : (
          <div className="space-y-4">
            {filteredHistories.map((item) => {
              const status = bookingStatusOptions.find((s) => s.id === item.bookingStatusId)
              const timestamp = item.changedAt ?? item.createdAt
              return (
                <div
                  key={`${item.bookingId}-${item.bookingStatusId}`}
                  className="card-surface w-full rounded-xl p-4 cursor-pointer hover:border-primary-500/60"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedBookingId(String(item.bookingId))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedBookingId(String(item.bookingId))
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-400">Booking ID</p>
                      <p className="font-semibold text-white">{item.bookingId}</p>
                    </div>
                    <Badge variant={status?.badge ?? 'info'}>{status?.label ?? item.bookingStatus?.name ?? 'Unknown'}</Badge>
                  </div>
                  {item.note && <p className="mt-2 text-sm text-slate-300">{item.note}</p>}
                  <p className="mt-2 text-xs text-slate-500">{timestamp ? formatDateTime(timestamp) : '-'}</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {selectedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-200">Detail booking</p>
                <h3 className="text-xl font-semibold text-white">{selectedBookingId}</h3>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedBookingId(null)}>
                Tutup
              </Button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-200">
              {isDetailLoading ? (
                <p className="text-slate-400">Memuat detail...</p>
              ) : detailError ? (
                <p className="text-rose-300">{(detailError as Error).message}</p>
              ) : !bookingDetail ? (
                <p className="text-slate-400">Data booking tidak ditemukan.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Ruang</p>
                      <p className="font-medium text-white">{bookingDetail.roomId || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Pemohon</p>
                      <p className="font-medium text-white">{bookingDetail.userName || bookingDetail.requester || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Tanggal</p>
                      <p className="font-medium text-white">
                        {bookingDetail.startTime
                          ? formatDate(bookingDetail.startTime)
                          : bookingDetail.date
                          ? formatDate(bookingDetail.date)
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Waktu</p>
                      <p className="font-medium text-white">
                        {bookingDetail.startTime && bookingDetail.endTime
                          ? `${new Date(bookingDetail.startTime).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} - ${new Date(bookingDetail.endTime).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`
                          : bookingDetail.timeRange || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Status</p>
                      <p className="font-medium text-white">{bookingDetail.bookingStatusId ?? bookingDetail.status ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">User ID</p>
                      <p className="font-medium text-white">{bookingDetail.userId ?? '-'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Keperluan</p>
                    <p className="mt-1 text-white">{bookingDetail.purpose || '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
