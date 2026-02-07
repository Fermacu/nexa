'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, removeAuthToken } from '@app/services/auth'
import { getCurrentUser } from '@app/services/userService'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Validate authentication status on mount by checking with backend
  useEffect(() => {
    let isMounted = true

    const validateAuth = async () => {
      const token = getAuthToken()
      
      // If no token, user is not authenticated
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
        return
      }

      // If token exists, validate it with the backend
      try {
        await getCurrentUser()
        // If successful, user is authenticated
        if (isMounted) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        // If validation fails (network error, invalid token, etc.), user is not authenticated
        // Clean up invalid token
        removeAuthToken()
        if (isMounted) {
          setIsAuthenticated(false)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    validateAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = getAuthToken()
    
    // If no token, user is not authenticated
    if (!token) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }

    // Validate token with backend
    try {
      setIsLoading(true)
      await getCurrentUser()
      setIsAuthenticated(true)
      return true
    } catch (error) {
      // If validation fails, clean up and mark as not authenticated
      removeAuthToken()
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    removeAuthToken()
    setIsAuthenticated(false)
    router.push('/auth')
  }, [router])

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      logout,
      checkAuth,
    }),
    [isAuthenticated, isLoading, logout, checkAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
