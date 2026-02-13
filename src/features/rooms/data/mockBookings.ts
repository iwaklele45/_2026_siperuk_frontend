import type { Booking } from '../../../lib/types'

export const mockBookings: Booking[] = [
  {
    id: 'BK-001',
    roomId: 'R-205',
    roomName: 'Ruang Kolaborasi',
    requester: 'Dewi Anjani',
    date: '2026-02-12',
    timeRange: '13:30 - 15:00',
    status: 'pending',
    purpose: 'Review sprint produk',
  },
  {
    id: 'BK-002',
    roomId: 'R-101',
    roomName: 'Ruang Rapat Utama',
    requester: 'Fikri Ramadhan',
    date: '2026-02-15',
    timeRange: '09:00 - 11:00',
    status: 'approved',
    purpose: 'Rapat anggaran triwulan',
  },
  {
    id: 'BK-003',
    roomId: 'R-415',
    roomName: 'Aula Mini',
    requester: 'Nadia Pratama',
    date: '2026-02-16',
    timeRange: '10:00 - 12:00',
    status: 'approved',
    purpose: 'Sosialisasi kebijakan keamanan',
  },
  {
    id: 'BK-004',
    roomId: 'R-310',
    roomName: 'Ruang Fokus',
    requester: 'Yoga Saputra',
    date: '2026-02-17',
    timeRange: '14:00 - 16:00',
    status: 'rejected',
    purpose: 'Pelatihan internal',
  },
]
