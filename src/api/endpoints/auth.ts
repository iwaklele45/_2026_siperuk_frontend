import { apiClient } from '../client'
import type { AuthResponse } from '../types'

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
  return response.data
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout')
}
