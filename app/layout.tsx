'use client'

import './globals.css'
import { XpProvider } from './context/xp-context'
import { useEffect } from 'react'
import { getSupabase } from './lib/supabase'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    // 🔑 This restores session after Google redirect
   supabase.auth.onAuthStateChange((_event: any, session: any) => {
  console.log('Auth state changed:', _event, session)
})
  }, [])

  return (
    <html lang="en">
      <body>
        <XpProvider>
          {children}
        </XpProvider>
      </body>
    </html>
  )
}
