'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const XpContext = createContext<any>(null)

export function XpProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client before accessing localStorage
  useEffect(() => {
    setIsClient(true)
    const savedXp = localStorage.getItem('xp')
    if (savedXp) {
      setXp(Number(savedXp))
    }
  }, [])

  // Save XP to localStorage whenever it changes (only on client)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('xp', xp.toString())
    }
  }, [xp, isClient])

  return (
    <XpContext.Provider value={{ xp, setXp }}>
      {children}
    </XpContext.Provider>
  )
}

export function useXp() {
  return useContext(XpContext)
}
