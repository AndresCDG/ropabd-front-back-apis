"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("usuario")
      if (stored && stored !== "undefined" && stored !== "null") {
        setUser(JSON.parse(stored))
      }
    } catch (error) {
      console.error("❌ Error cargando usuario del localStorage:", error)
      localStorage.removeItem("usuario")
    } finally {
      setInitialized(true)
    }
  }, [])

  const login = (user: User) => {
    console.log("🔑 login ejecutado con:", user)
    setUser(user)
    localStorage.setItem("usuario", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("usuario")
  }

  if (!initialized) {
    return null // evita parpadeos
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
