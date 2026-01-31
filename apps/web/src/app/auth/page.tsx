'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Grid, Typography, Button, Box, Tabs, Tab } from "@mui/material"
import Link from 'next/link'
import { DynamicForm, FormData } from '@app/components/DynamicForm'
import { registrationConfig, transformRegistrationData } from './registrationConfig'
import { loginConfig } from './loginConfig'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { useAuth } from '@app/contexts/AuthContext'

type ApiError = {
  response?: { data?: { error?: { errors?: Record<string, string> } } }
  message?: string
}

function getFieldErrors(error: ApiError): Record<string, string> | null {
  return error.response?.data?.error?.errors ?? null
}

export default function AuthPage() {
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({})
  const { showError, showSuccess } = useGlobalAlert()
  const { login, register } = useAuth()

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setExternalErrors({})
  }

  const handleLogin = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})
    const email = String(data.email ?? '')
    const password = String(data.password ?? '')

    try {
      await login(email, password)
      showSuccess('Inicio de sesión exitoso')
      router.push('/dashboard')
    } catch (error) {
      const apiError = error as ApiError
      const fieldErrors = getFieldErrors(apiError)
      if (fieldErrors) {
        setExternalErrors(fieldErrors)
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
      setLoading(false)
    }
  }

  const handleCompanyRegistration = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      const registrationData = transformRegistrationData(data)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Enviando registro al API...', registrationData.user?.email)
      }
      await register(registrationData)
      showSuccess('Cuenta creada correctamente. Bienvenido.')
      router.push('/dashboard')
    } catch (error) {
      const apiError = error as ApiError
      const fieldErrors = getFieldErrors(apiError)
      if (fieldErrors) {
        setExternalErrors(fieldErrors)
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
