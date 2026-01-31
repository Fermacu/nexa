'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@app/config/firebase'
import { registerUser as apiRegister } from '@app/lib/api'

interface AuthContextValue {
  user: FirebaseUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    user: { name: string; email: string; password: string; phone?: string }
    company: {
      name: string
      email: string
      phone: string
      address: { street: string; city: string; state: string; postalCode: string; country: string }
      website?: string
      industry?: string
      description?: string
    }
  }) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshToken = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setToken(null)
      return null
    }
    try {
      const t = await firebaseUser.getIdToken()
      setToken(t)
      return t
    } catch {
      setToken(null)
      return null
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      await refreshToken(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [refreshToken])

  const login = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error('Firebase Auth no está configurado')
      await signInWithEmailAndPassword(auth, email, password)
      const currentUser = auth.currentUser
      if (currentUser) await refreshToken(currentUser)
    },
    [refreshToken]
  )

  const register = useCallback(
    async (data: Parameters<AuthContextValue['register']>[0]) => {
      await apiRegister(data)
      if (!auth) throw new Error('Firebase Auth no está configurado')
      await signInWithEmailAndPassword(auth, data.user.email, data.user.password)
      const currentUser = auth.currentUser
      if (currentUser) await refreshToken(currentUser)
    },
    [refreshToken]
  )

  const logout = useCallback(async () => {
    if (auth) await firebaseSignOut(auth)
    setUser(null)
    setToken(null)
  }, [])

  const getToken = useCallback(async () => {
    if (!user) return null
    const t = await user.getIdToken()
    setToken(t)
    return t
  }, [user])

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
