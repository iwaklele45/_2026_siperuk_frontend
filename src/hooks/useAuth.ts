import { useAuth as useAuthContext } from '../features/auth/AuthContext'

// Convenience hook that aligns with folder structure in prompt
export function useAuth() {
  return useAuthContext()
}
