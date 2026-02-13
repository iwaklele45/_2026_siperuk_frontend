import type { BookingStatus } from '../lib/types'

export interface AuthResponse {
  token: string
  user: {
    id: string
    fullName: string
    email: string
    role: 'admin' | 'staff' | 'user'
  }
}

export interface Paginated<T> {
  data: T[]
  total: number
}

export interface RoomDto {
  id: string
  name: string
  capacity: number
  location: string
  description?: string
  status: 'available' | 'booked' | 'maintenance'
  features: string[]
  nextBooking?: string
}

export interface BookingDto {
  id: string
  roomId: string
  requester?: string
  userName?: string
  date?: string
  timeRange?: string
  startTime?: string
  endTime?: string
  status?: BookingStatus
  bookingStatusId?: number
  userId?: string | number
  purpose: string
}

export interface BookingStatusDto {
  id: string
  name: string
  description?: string
}

export interface BookingStatusHistoryDto {
  id: string | number
  bookingId: string | number
  statusId?: string
  bookingStatusId?: number
  note?: string
  createdAt?: string
  changedAt?: string
  bookingStatus?: {
    name?: string
  }
  booking?: {
    id?: string | number
    roomId?: string | number
    roomName?: string
    userId?: string | number
    userName?: string
    startTime?: string
    endTime?: string
    purpose?: string
  }
}

export interface LatestBookingStatusHistoryDto {
  bookingId: string | number
  bookingStatusId: number
  changedAt: string
  notes?: string
}

export interface UserDto {
  id: string
  fullName: string
  email: string
  role: 'admin' | 'staff' | 'user'
}
