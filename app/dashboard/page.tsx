'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useXp } from '@/app/context/xp-context'
import { getSupabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { xp } = useXp()
  const router = useRouter()

   const handleLogout = () => {
    router.push('/')
  }

  // ✅ ADD THIS BLOCK HERE
  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

      supabase.auth.getUser().then((res: any) => {
    if (!res?.data?.user) {
      router.push('/login')
    }
  })
  }, [router])
  // ✅ END OF BLOCK



  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>📘 Class 10 Mathematics</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p><strong>Total XP:</strong> {xp}</p>

      <p>Select a module to start learning</p>

      <ul style={{ marginTop: 20 }}>
        <li>
          <Link href="/modules/real-numbers">👉 Real Numbers</Link>
        </li>
        <li>
          <Link href="/modules/polynomials">👉 Polynomials</Link>
        </li>
        <li>
          <Link href="/modules/linear-equations">👉 Pair of Linear Equations</Link>
        </li>
      </ul>
    </div>
  )
}
