'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Grid, Typography, Button, Box, Tabs, Tab } from "@mui/material"
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
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({})
  const { showError, showSuccess } = useGlobalAlert()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setExternalErrors({}) // Clear errors when switching tabs
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
      
      // Update auth context
      checkAuth()
      
      // Redirect to dashboard
      router.push('/dashboard')
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

  const handleCompanyRegistration = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      // Transform form data to API format
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
