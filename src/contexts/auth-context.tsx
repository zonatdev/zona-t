'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simular verificación de sesión al cargar
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('zonat_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Usuario principal: diego@zonat.com
    if (email === 'diego@zonat.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        name: 'Diego Admin',
        email: 'diego@zonat.com',
        password: 'admin123',
        role: 'superadmin',
        permissions: [
          { module: 'dashboard', actions: ['view'] },
          { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
          { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'logs', actions: ['view'] }
        ],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01',
        updatedAt: new Date().toISOString()
      }
      
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('zonat_user', JSON.stringify(userData))
      }
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zonat_user')
      document.cookie = 'zonat_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
