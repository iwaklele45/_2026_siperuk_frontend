import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormInput } from '../components/ui/FormInput'
import { Card } from '../components/ui/Card'
import { useAuth } from '../features/auth/AuthContext'

export function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Masuk ke SIPERUK" description="Gunakan akun admin atau staff Anda." className="bg-slate-900/70">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Kata sandi"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Masuk dan lanjutkan
          </Button>
          <p className="text-xs text-slate-400">
            Masukkan email dan kata sandi Anda untuk login (mock server, tidak ada auto-admin).
          </p>
        </form>
      </Card>
    </div>
  )
}
