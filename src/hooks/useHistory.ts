import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { BookingStatusHistoryDto } from '../api/types'

export function useHistory(bookingId?: string) {
  return useQuery({
    queryKey: ['booking-history-full', bookingId ?? 'all'],
    enabled: true,
    retry: false,
    queryFn: async () => {
      const { data } = await apiClient.get<BookingStatusHistoryDto[]>(
        bookingId ? `/bookingstatushistory/booking/${bookingId}` : '/bookingstatushistory',
      )
      const sorted = [...data].sort((a, b) => {
        const aTime = new Date(a.changedAt ?? a.createdAt ?? 0).getTime()
        const bTime = new Date(b.changedAt ?? b.createdAt ?? 0).getTime()
        return bTime - aTime
      })

      // Ambil status terbaru per booking
      const map = new Map<string, typeof sorted[number]>()
      for (const item of sorted) {
        const key = String(item.bookingId)
        if (!map.has(key)) {
          map.set(key, item)
        }
      }

      return Array.from(map.values())
    },
  })
}
