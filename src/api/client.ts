import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5145'

export const apiClient = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('siperuk_auth')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { token?: string }
      if (parsed.token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    } catch (err) {
      console.error('Failed to parse auth token', err)
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('siperuk_auth')
      const requestedPath = error.config?.url ?? ''
      const isLoginRequest = requestedPath.includes('/auth/login')
      const alreadyOnLoginPage = window.location.pathname === '/login'

      if (!isLoginRequest && !alreadyOnLoginPage) {
        // Force navigation so stale in-memory auth state is cleared immediately
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
