'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Container, Grid, Typography, Button, Box, Tabs, Tab, CircularProgress } from "@mui/material"
import Link from 'next/link'
import { DynamicForm, FormData } from '@app/components/DynamicForm'
import { registrationConfig, transformRegistrationData } from './registrationConfig'
import { loginConfig } from './loginConfig'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { login, register } from '@app/services/auth'
import type { ApiError } from '@app/services/api'
import { useAuth } from '@app/contexts/AuthContext'

export default function AuthPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({})
  const { showError, showSuccess } = useGlobalAlert()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()

  // Only redirect if user manually navigates to /auth while already authenticated
  // This should only happen after auth check is complete, not during login flow
  useEffect(() => {
    // Only redirect if:
    // 1. Auth check is complete (not loading)
    // 2. User is authenticated
    // 3. We're on the /auth page
    if (!isLoading && isAuthenticated && pathname === '/auth') {
      router.replace('/dashboard')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setExternalErrors({})
  }

  const handleLogin = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      // Call the actual API
      await login({
        email: data.email as string,
        password: data.password as string,
      })

      // Handle successful login
      showSuccess('Inicio de sesión exitoso')
      
      // Token is already stored by login() function
      // Use window.location to force a full page reload and avoid loops
      // This completely resets React state and prevents any re-render loops
      // The AuthContext will check the token on the next page load
      window.location.href = '/dashboard'
      return // Exit early to prevent any further execution
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError

      if (apiError.errors) {
        setExternalErrors(apiError.errors)
      } else {
        const msg = apiError.message || 'Ocurrió un error. Por favor intenta de nuevo.'
        if (msg.includes('auth/invalid-credential') || msg.includes('invalid-credential')) {
          showError('Correo o contraseña incorrectos.')
        } else if (msg.includes('auth/user-not-found')) {
          showError('No existe una cuenta con este correo.')
        } else {
          showError(msg)
        }
      }
    } finally {
      // Don't set loading to false if we redirected
      // The redirect will cause a full page reload anyway
      setLoading(false)
    }
  }

  const handleCompanyRegistration = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      const registrationData = transformRegistrationData(data)

      // Call the actual API
      await register(registrationData)

      // Handle successful registration
      showSuccess('Cuenta creada correctamente. Ya puedes iniciar sesión.')
      
      // Switch to login tab
      setTabValue(0)
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError

      if (apiError.errors) {
        setExternalErrors(apiError.errors)
      } else {
        showError(apiError.message || 'Ocurrió un error. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Show loading only during initial auth check, not after login
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Grid container spacing={4}>
          {/* Título */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
            >
              Bienvenido a NEXA
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: "center",
                mb: 4,
              }}
            >
              Gestiona tu organización de forma inteligente
            </Typography>
          </Grid>

          {/* Tabs para Login/Registro */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                }}
              >
                <Tab label="Iniciar sesión" />
                <Tab label="Crear cuenta" />
              </Tabs>
            </Box>
          </Grid>

          {/* Sign In Form */}
          {tabValue === 0 && (
            <Grid size={{ xs: 12 }}>
              <DynamicForm
                config={loginConfig}
                onSubmit={handleLogin}
                loading={loading}
                errors={externalErrors}
              />
            </Grid>
          )}

          {/* Company Registration Form */}
          {tabValue === 1 && (
            <Grid size={{ xs: 12 }}>
              <DynamicForm
                config={registrationConfig}
                onSubmit={handleCompanyRegistration}
                loading={loading}
                errors={externalErrors}
              />
            </Grid>
          )}

          {/* Link de vuelta al inicio */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button
                  variant="text"
                  sx={{
                    textTransform: "none",
                    color: 'text.secondary',
                  }}
                >
                  Volver al inicio
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
