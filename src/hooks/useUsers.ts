import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { UserDto } from '../api/types'

const USERS_KEY = ['users']

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<UserDto[]>('/user')
      return data
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<UserDto, 'id'> & { password: string }) => {
      const { data } = await apiClient.post<UserDto>('/user', payload)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UserDto & { password?: string }) => {
      const { id, password, ...rest } = payload
      const body = password ? { ...rest, password } : rest
      const { data } = await apiClient.put<UserDto>(`/user/${id}`, body)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/user/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
