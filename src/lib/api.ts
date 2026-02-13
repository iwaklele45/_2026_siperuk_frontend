const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiOptions = {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
}

function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem('siperuk_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored) as { token?: string }
    return parsed.token ?? null
  } catch (err) {
    console.error('Failed to read auth token', err)
    return null
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', headers, body } = options
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
}
