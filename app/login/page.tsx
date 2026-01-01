'use client'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <p>Email:</p>
      <input />

      <p>Password:</p>
      <input type="password" />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
