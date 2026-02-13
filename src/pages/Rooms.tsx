import { useState, type FormEvent } from 'react'
import { Card } from '../components/ui/Card'
import { ResponsiveTable } from '../components/ui/ResponsiveTable'
import { Button } from '../components/ui/Button'
import { FormInput } from '../components/ui/FormInput'
import { useAuth } from '../features/auth/AuthContext'
import { useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom } from '../hooks/useRooms'

export function RoomsPage() {
  const { user } = useAuth()
  const { data: rooms = [], isLoading } = useRooms()
  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom()
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom()
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom()
  const [form, setForm] = useState({ id: '', name: '', location: '', capacity: '', description: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const canManage = user?.role === 'admin' || user?.role === 'staff'
  const numberedRooms = rooms.map((room, index) => ({ ...room, displayIndex: index + 1 }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.name || !form.location || !form.capacity) {
      setError('Nama, lokasi, dan kapasitas wajib diisi')
      return
    }

    const capacity = Number(form.capacity)
    if (Number.isNaN(capacity) || capacity <= 0) {
      setError('Kapasitas harus berupa angka lebih dari 0')
      return
    }

    try {
      if (form.id) {
        await updateRoom({
          id: form.id,
          name: form.name,
          location: form.location,
          capacity,
          description: form.description || undefined,
        })
        setSuccess('Ruangan berhasil diperbarui')
      } else {
        await createRoom({
          name: form.name,
          location: form.location,
          capacity,
          description: form.description || undefined,
        })
        setSuccess('Ruangan berhasil ditambahkan')
      }
      setForm({ id: '', name: '', location: '', capacity: '', description: '' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan ruangan'
      setError(message)
    }
  }

  const onEdit = (room: (typeof rooms)[number]) => {
    setForm({
      id: room.id,
      name: room.name,
      location: room.location,
      capacity: String(room.capacity),
      description: room.description ?? '',
    })
    setSuccess(null)
    setError(null)
  }

  const onDelete = async (id: string) => {
    setError(null)
    setSuccess(null)
    try {
      await deleteRoom(id)
      setSuccess('Ruangan berhasil dihapus')
      if (form.id === id) {
        setForm({ id: '', name: '', location: '', capacity: '', description: '' })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus ruangan'
      setError(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-primary-200">Ruang</p>
        <h1 className="text-2xl font-semibold">Daftar ruang</h1>
        <p className="text-sm text-slate-400">{rooms.length} ruang terdaftar di database.</p>
      </div>

      {canManage && (
        <Card title="Tambah ruangan" description="Hanya admin dan staff yang bisa menambah data ruang">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Nama ruang"
                name="name"
                placeholder="Contoh: Ruang Rapat 1"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <FormInput
                label="Lokasi"
                name="location"
                placeholder="Contoh: Lantai 2"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              />
              <FormInput
                label="Kapasitas"
                name="capacity"
                type="number"
                min={1}
                placeholder="Contoh: 12"
                value={form.capacity}
                onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-200" htmlFor="description">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  placeholder="Opsional: keterangan tambahan"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}
            {success && <p className="text-sm text-emerald-300">{success}</p>}

            <div className="flex justify-end">
              <Button type="submit" loading={isCreating || isUpdating} disabled={isCreating || isUpdating}>
                {form.id ? 'Perbarui ruangan' : 'Simpan ruangan'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Daftar ruang" description="Data diambil langsung dari database">
        <ResponsiveTable
          data={numberedRooms}
          getKey={(room) => room.id}
          emptyState={isLoading ? 'Memuat data ruang…' : 'Belum ada data ruang.'}
          columns={[
            { key: 'displayIndex', header: '#', render: (room) => `${room.displayIndex}` },
            { key: 'name', header: 'Name', render: (room) => <div className="font-semibold text-white">{room.name}</div> },
            { key: 'location', header: 'Location' },
            {
              key: 'capacity',
              header: 'Capacity',
              align: 'center',
              render: (room) => <span className="font-semibold">{room.capacity}</span>,
            },
            {
              key: 'description',
              header: 'Description',
              render: (room) => room.description || '-',
            },
            ...(canManage
              ? [
                  {
                    key: 'actions',
                    header: 'Aksi',
                    render: (room: (typeof rooms)[number]) => (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => onEdit(room)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isDeleting}
                          onClick={() => onDelete(room.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  )
}
