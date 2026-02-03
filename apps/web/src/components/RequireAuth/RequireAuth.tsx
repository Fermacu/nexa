'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '@app/contexts/AuthContext'

/**
 * Protege rutas que requieren sesión (JWT).
 * Si no hay usuario logueado, redirige a /auth.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only redirect once if not authenticated and not already on /auth
    if (!isLoading && !isAuthenticated && pathname !== '/auth' && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/auth')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Reset redirect flag when pathname changes (user navigates)
  useEffect(() => {
    hasRedirected.current = false
  }, [pathname])

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
