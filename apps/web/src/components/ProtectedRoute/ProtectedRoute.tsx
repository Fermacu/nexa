'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Double check auth status
      const authenticated = checkAuth()
      if (!authenticated) {
        router.push('/auth')
      }
    }
  }, [isLoading, isAuthenticated, checkAuth, router])

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
