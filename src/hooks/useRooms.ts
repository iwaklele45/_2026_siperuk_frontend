import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { RoomDto } from '../api/types'

export interface CreateRoomPayload {
  name: string
  location: string
  capacity: number
  description?: string
  status?: 'available' | 'booked' | 'maintenance'
  features?: string[]
}

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data } = await apiClient.get<RoomDto[]>('/room')
      return data
    },
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRoomPayload) => {
      const body = {
        ...payload,
        status: payload.status ?? 'available',
        features: payload.features ?? [],
      }
      const { data } = await apiClient.post<RoomDto>('/room', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export interface UpdateRoomPayload extends CreateRoomPayload {
  id: string
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateRoomPayload) => {
      const body = {
        ...payload,
        status: payload.status ?? 'available',
        features: payload.features ?? [],
      }
      const { data } = await apiClient.put<RoomDto>(`/room/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/room/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}
