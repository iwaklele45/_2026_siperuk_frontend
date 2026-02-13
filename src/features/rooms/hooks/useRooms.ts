import { useMemo } from 'react'
import { mockRooms } from '../data/mockRooms'
import type { Room } from '../../../lib/types'

type RoomFilter = 'all' | Room['status']

export function useRooms(filter: RoomFilter = 'all') {
  const rooms = useMemo(() => {
    if (filter === 'all') return mockRooms
    return mockRooms.filter((room) => room.status === filter)
  }, [filter])

  const totalAvailable = useMemo(
    () => mockRooms.filter((room) => room.status === 'available').length,
    [],
  )

  return { rooms, totalAvailable }
}
