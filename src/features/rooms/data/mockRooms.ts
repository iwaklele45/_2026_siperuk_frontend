import type { Room } from '../../../lib/types'

export const mockRooms: Room[] = [
  {
    id: 'R-101',
    name: 'Ruang Rapat Utama',
    capacity: 20,
    location: 'Lantai 3 - Timur',
    status: 'available',
    features: ['Proyektor 4K', 'Whiteboard', 'AC'],
    nextBooking: '2026-02-15T09:00:00',
  },
  {
    id: 'R-205',
    name: 'Ruang Kolaborasi',
    capacity: 10,
    location: 'Lantai 2 - Tengah',
    status: 'booked',
    features: ['TV 65"', 'Kamera Konferensi'],
    nextBooking: '2026-02-12T13:30:00',
  },
  {
    id: 'R-310',
    name: 'Ruang Fokus',
    capacity: 6,
    location: 'Lantai 3 - Barat',
    status: 'maintenance',
    features: ['AC', 'Pencahayaan Hangat'],
  },
  {
    id: 'R-415',
    name: 'Aula Mini',
    capacity: 50,
    location: 'Lantai 4 - Selatan',
    status: 'available',
    features: ['Sound System', 'Proyektor Ultra Short Throw'],
    nextBooking: '2026-02-16T10:00:00',
  },
]
