export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'user'
}

export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  description?: string
  status: 'available' | 'booked' | 'maintenance'
  features: string[]
  nextBooking?: string
}

export interface Booking {
  id: string
  roomId: string
  roomName: string
  requester?: string
  userName?: string
  date: string
  timeRange: string
  status: BookingStatus
  purpose: string
}

export interface BookingStatusItem {
  id: string
  name: string
  description?: string
}

export interface BookingStatusHistoryItem {
  id: string
  bookingId: string
  statusId: string
  note?: string
  createdAt: string
}
