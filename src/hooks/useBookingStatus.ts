import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { BookingStatusDto } from '../api/types'

export function useBookingStatus() {
  return useQuery({
    queryKey: ['booking-status'],
    queryFn: async () => {
      const { data } = await apiClient.get<BookingStatusDto[]>('/bookingstatus')
      return data
    },
  })
}
