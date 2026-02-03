'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Box, CircularProgress, Typography, Container } from '@mui/material'
import { useAuth } from '@app/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication.
 * Redirects to /auth if user is not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only redirect once if not authenticated and not already on /auth
    if (!isLoading && !isAuthenticated && pathname !== '/auth' && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/auth')
    }
  }, [isLoading, isAuthenticated, pathname, router])
  
  // Reset redirect flag when pathname changes (user navigates)
  useEffect(() => {
    hasRedirected.current = false
  }, [pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Verificando autenticación...
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
