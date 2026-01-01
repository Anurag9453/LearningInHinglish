'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const XpContext = createContext<any>(null)

export function XpProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0)

  // Load XP from localStorage on first load
  useEffect(() => {
    const savedXp = localStorage.getItem('xp')
    if (savedXp) {
      setXp(Number(savedXp))
    }
  }, [])

  // Save XP to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('xp', xp.toString())
  }, [xp])

  return (
    <XpContext.Provider value={{ xp, setXp }}>
      {children}
    </XpContext.Provider>
  )
}

export function useXp() {
  return useContext(XpContext)
}
