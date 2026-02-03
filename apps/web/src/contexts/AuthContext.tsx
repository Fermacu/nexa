'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, removeAuthToken } from '@app/services/auth'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = getAuthToken()
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }

  const checkAuth = (): boolean => {
    const token = getAuthToken()
    const authenticated = !!token
    setIsAuthenticated(authenticated)
    return authenticated
  }

  const logout = () => {
    removeAuthToken()
    setIsAuthenticated(false)
    router.push('/auth')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        logout,
        checkAuth,
      }}
    >
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
