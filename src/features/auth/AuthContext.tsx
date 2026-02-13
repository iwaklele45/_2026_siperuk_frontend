import { AxiosError } from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loginRequest, logoutRequest } from '../../api/endpoints/auth'
import type { User } from '../../lib/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'siperuk_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as { token: string; user: User }
        setUser(parsed.user)
        setToken(parsed.token)
      }
    } catch (err) {
      console.error('Failed to restore auth session', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email dan kata sandi wajib diisi')
    setLoading(true)
    try {
      const response = await loginRequest(email, password)
      const nextUser: User = {
        id: response.user.id,
        name: response.user.fullName ?? response.user.fullName ?? email,
        email: response.user.email,
        role: response.user.role,
      }
      setUser(nextUser)
      setToken(response.token)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: response.token, user: nextUser }))
    } catch (err) {
      if (err instanceof AxiosError) {
        const serverMsg =
          (err.response?.data as { message?: string; error?: string })?.message ||
          (err.response?.data as { message?: string; error?: string })?.error
        if (err.response?.status === 401) {
          throw new Error('Email atau kata sandi salah')
        }
        throw new Error(serverMsg || 'Login gagal: permintaan tidak valid, periksa input anda')
      }
      throw err instanceof Error ? err : new Error('Login gagal')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch (err) {
      console.warn('Logout request failed, clearing local session', err)
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
