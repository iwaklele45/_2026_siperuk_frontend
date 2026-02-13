import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { BookingDto } from '../api/types'
import type { BookingStatus } from '../lib/types'

export interface CreateBookingPayload {
  roomId: string
  startTime: string
  endTime: string
  purpose: string
  requester: string
  userName?: string
  userId?: string
  bookingStatusId?: number
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  id: string
  status?: BookingStatus
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<BookingDto[]>('/booking')
      return data
    },
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const body = {
        ...payload,
        userName: payload.userName ?? payload.requester,
        status: 'pending',
        bookingStatusId: payload.bookingStatusId ?? 1,
      }
      const { data } = await apiClient.post<BookingDto>('/booking', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBookingPayload) => {
      const { data } = await apiClient.put<BookingDto>(`/booking/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/booking/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
