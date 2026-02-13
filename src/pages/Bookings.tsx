import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ResponsiveTable } from '../components/ui/ResponsiveTable'
import { FormInput } from '../components/ui/FormInput'
import { useAuth } from '../features/auth/AuthContext'
import { useBookings, useCreateBooking, useDeleteBooking, useUpdateBooking } from '../hooks/useBookings'
import { useRooms } from '../hooks/useRooms'
import { formatDate } from '../lib/utils'

type BookingFilterKey = 'all' | 'approved' | 'pending'

const bookingFilters: Array<{ key: BookingFilterKey; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'approved', label: 'Disetujui' },
  { key: 'pending', label: 'Menunggu' },
]

const bookingStatusOptions = [
  { id: 1, label: 'Waiting', badge: 'warning' as const },
  { id: 2, label: 'Approved', badge: 'success' as const },
  { id: 3, label: 'Rejected', badge: 'danger' as const },
  { id: 4, label: 'Finish', badge: 'info' as const },
]

const toMinutes = (time: string) => {
  const [h = '0', m = '0'] = time.split(':')
  return Number(h) * 60 + Number(m)
}

const toIso = (date: string, time: string) => {
  if (!date || !time) return ''
  const iso = new Date(`${date}T${time}`).toISOString()
  return iso
}

const formatDateOnly = (value?: string) => (value ? new Date(value).toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}) : '-')

const formatTimeOnly = (value?: string) => (value ? new Date(value).toLocaleTimeString('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
}) : '')

const parseTimeRange = (timeRange?: string) => {
  const [start = '', end = ''] = (timeRange ?? '').split('-').map((part) => part.trim())
  return { start, end }
}

const getStatusKey = (booking: { bookingStatusId?: number | string; status?: string }) => {
  const id = Number(booking.bookingStatusId)
  if (!Number.isNaN(id)) {
    if (id === 1) return 'pending'
    if (id === 2) return 'approved'
    if (id === 3) return 'rejected'
    if (id === 4) return 'finish'
  }
  const normalized = (booking.status ?? '').toLowerCase()
  if (normalized === 'completed') return 'finish'
  return normalized
}

export function BookingsPage() {
  const { user } = useAuth()
  const canCreate = user?.role === 'user'
  const canManage = user?.role === 'admin' || user?.role === 'staff'

  const { data: bookings = [], isLoading } = useBookings()
  const { data: rooms = [] } = useRooms()
  const { mutateAsync: createBooking, isPending: isCreating } = useCreateBooking()
  const { mutateAsync: updateBooking, isPending: isUpdating } = useUpdateBooking()
  const { mutateAsync: deleteBooking, isPending: isDeleting } = useDeleteBooking()

  const [status, setStatus] = useState<BookingFilterKey>('all')
  const [form, setForm] = useState({
    id: '',
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    bookingStatusId: 1,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pendingStatusChange, setPendingStatusChange] = useState<{ bookingId: string; bookingStatusId: number } | null>(
    null,
  )
  const showForm = canCreate

  const filtered = useMemo(() => {
    const activeOnly = bookings.filter((booking) => {
      const key = getStatusKey(booking);
      return key !== 'finish' && key !== 'rejected';
    });

    if (status == 'all') return activeOnly;
    return activeOnly.filter((booking)=>getStatusKey(booking)===status);
  },[bookings, status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.roomId || !form.date || !form.startTime || !form.endTime || !form.purpose) {
      setError('Room, tanggal, waktu mulai, waktu selesai, dan keperluan wajib diisi')
      return
    }

    if (toMinutes(form.endTime) <= toMinutes(form.startTime)) {
      setError('Waktu selesai harus lebih besar dari waktu mulai')
      return
    }

    const startTimeIso = toIso(form.date, form.startTime)
    const endTimeIso = toIso(form.date, form.endTime)

    try {
      if (form.id) {
        if (!canManage) {
          setError('Hanya admin/staff yang boleh mengubah booking')
          return
        }
        await updateBooking({
          id: form.id,
          roomId: form.roomId,
          startTime: startTimeIso,
          endTime: endTimeIso,
          purpose: form.purpose,
          bookingStatusId: form.bookingStatusId,
        })
        setSuccess('Booking berhasil diperbarui')
      } else {
        if (!canCreate) {
          setError('Hanya pengguna dengan role user yang bisa membuat booking')
          return
        }
        await createBooking({
          roomId: form.roomId,
          startTime: startTimeIso,
          endTime: endTimeIso,
          purpose: form.purpose,
          userId: user?.id,
          userName: user?.name || user?.email || 'Pengguna',
          requester: user?.name || user?.email || 'Pengguna',
          bookingStatusId: form.bookingStatusId ?? 1,
        })
        setSuccess('Booking berhasil dibuat')
      }

      setForm({ id: '', roomId: '', date: '', startTime: '', endTime: '', purpose: '', bookingStatusId: 1 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan booking'
      setError(message)
    }
  }

  const onChangeStatus = async (
    bookingId: string,
    bookingStatusId: number,
    payload?: { roomId?: string; userId?: string; startTime?: string; endTime?: string; purpose?: string },
  ) => {
    setError(null)
    setSuccess(null)
    try {
      await updateBooking({ id: bookingId, bookingStatusId, ...payload })
      setSuccess('Status booking diperbarui')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui status'
      setError(message)
    }
  }

  const confirmPendingStatus = async () => {
    if (!pendingStatusChange) return
    const booking = bookings.find((b) => b.id === pendingStatusChange.bookingId)
    if (!booking) {
      setError('Booking tidak ditemukan')
      setPendingStatusChange(null)
      return
    }

    const hasIso = booking.startTime && booking.endTime
    const { start: rangeStart, end: rangeEnd } = parseTimeRange(booking.timeRange)
    const startIso = hasIso ? booking.startTime : toIso(booking.date ?? '', rangeStart)
    const endIso = hasIso ? booking.endTime : toIso(booking.date ?? '', rangeEnd)

    if (!startIso || !endIso) {
      setError('Data waktu booking tidak lengkap untuk memperbarui status')
      setPendingStatusChange(null)
      return
    }

    await onChangeStatus(booking.id, pendingStatusChange.bookingStatusId, {
      roomId: booking.roomId,
      userId: booking.userId ? String(booking.userId) : undefined,
      startTime: startIso,
      endTime: endIso,
      purpose: booking.purpose,
    })
    setPendingStatusChange(null)
  }

  const onDelete = async (id: string) => {
    setError(null)
    setSuccess(null)
    try {
      await deleteBooking(id)
      setSuccess('Booking berhasil dihapus')
      if (form.id === id) {
        setForm({ id: '', roomId: '', date: '', startTime: '', endTime: '', purpose: '', bookingStatusId: 1 })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus booking'
      setError(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-200">Peminjaman</p>
          <h1 className="text-2xl font-semibold">Permintaan peminjaman</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {bookingFilters.map((item) => (
            <Button
              key={item.key}
              size="sm"
              variant={status === item.key ? 'primary' : 'secondary'}
              onClick={() => setStatus(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {showForm ? (
        <Card
          title={form.id ? 'Edit booking' : 'Buat booking'}
          description={
            canCreate
              ? 'Role user dapat membuat booking baru. Admin/Staff dapat mengedit status lewat tabel.'
              : 'Admin/staff hanya dapat mengubah booking yang dipilih dari tabel.'
          }
        >
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input type="hidden" value={form.id} readOnly />

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="roomId">
                Ruang
              </label>
              <select
                id="roomId"
                name="roomId"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                value={form.roomId}
                onChange={(e) => setForm((prev) => ({ ...prev, roomId: e.target.value }))}
              >
                <option value="">Pilih ruang</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.location})
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Tanggal"
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            />
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="purpose">
                Keperluan
              </label>
              <textarea
                id="purpose"
                name="purpose"
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                placeholder="Contoh: Rapat mingguan"
                value={form.purpose}
                onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
              />
            </div>
            <FormInput
              label="Waktu mulai"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />
            <FormInput
              label="Waktu selesai"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
            />
            

            {error && <p className="md:col-span-2 text-sm text-rose-300">{error}</p>}
            {success && <p className="md:col-span-2 text-sm text-emerald-300">{success}</p>}

            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button
                type="submit"
                loading={isCreating || isUpdating}
                disabled={
                  isCreating ||
                  isUpdating ||
                  (!form.id && !canCreate) ||
                  (!form.id && canManage)
                }
              >
                {form.id ? 'Simpan perubahan' : 'Buat booking'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm({ id: '', roomId: '', date: '', startTime: '', endTime: '', purpose: '', bookingStatusId: 1 })}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card title="Daftar peminjaman">
        <ResponsiveTable
          data={filtered}
          getKey={(item) => item.id}
          emptyState={isLoading ? 'Memuat data booking…' : 'Belum ada booking.'}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'roomId', header: 'Ruang' },
            {
              key: 'userName',
              header: 'Pemohon',
              render: (booking) => booking.userName || booking.requester || '-',
            },
            {
              key: 'startTime',
              header: 'Waktu',
              render: (booking) => {
                const hasIso = booking.startTime && booking.endTime
                const dateLabel = hasIso ? formatDateOnly(booking.startTime) : formatDate(booking.date ?? '')
                const timeLabel = hasIso
                  ? `${formatTimeOnly(booking.startTime)} - ${formatTimeOnly(booking.endTime)}`
                  : booking.timeRange || '-'

                return (
                  <div className="text-sm text-slate-200">
                    <div>{dateLabel}</div>
                    <div className="text-slate-400">{timeLabel}</div>
                  </div>
                )
              },
            },
            {
              key: 'bookingStatusId',
              header: 'Status',
              render: (booking) => {
                const option = bookingStatusOptions.find((opt) => opt.id === booking.bookingStatusId)
                return (
                  <Badge variant={option?.badge ?? 'info'}>
                    {option?.label ?? 'Unknown'}
                  </Badge>
                )
              },
            },
            {
              key: 'purpose',
              header: 'Keperluan',
              render: (booking) => <span className="text-slate-100">{booking.purpose}</span>,
            },
            ...(canManage
              ? [
                  {
                    key: 'changeStatus',
                    header: 'Ubah status',
                    render: (booking: (typeof bookings)[number]) => (
                      <select
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        value={booking.bookingStatusId ?? 1}
                        disabled={isUpdating}
                        onChange={(e) => setPendingStatusChange({ bookingId: booking.id, bookingStatusId: Number(e.target.value) })}
                      >
                        {bookingStatusOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ),
                  },
                  {
                    key: 'actions',
                    header: 'Aksi',
                    render: (booking: (typeof bookings)[number]) => (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isDeleting}
                        onClick={() => onDelete(booking.id)}
                      >
                        Hapus
                      </Button>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Card>

      {pendingStatusChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Ubah status booking?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Status akan diubah menjadi
              <span className="ml-1 font-semibold text-white">
                {bookingStatusOptions.find((opt) => opt.id === pendingStatusChange.bookingStatusId)?.label ??
                  'Unknown'}
              </span>
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPendingStatusChange(null)}>
                Cancel
              </Button>
              <Button loading={isUpdating} onClick={confirmPendingStatus}>
                Oke
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
