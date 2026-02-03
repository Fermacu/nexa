'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '@app/contexts/AuthContext'

/**
 * Protege rutas que requieren sesión (JWT).
 * Si no hay usuario logueado, redirige a /auth.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
